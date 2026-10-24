import fs from 'fs';
import path from 'path';
import { prisma } from './prisma';
import {
  defaultPortfolioContent,
  normalizePortfolioContent,
  type PortfolioContent,
} from './portfolio-content';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'portfolio-content.json');

// In-memory server-side cache across warm serverless requests
let memoryCachedContent: PortfolioContent | null = null;
let isTableInitialized = false;

async function ensureTableExists() {
  if (isTableInitialized || !process.env.DATABASE_URL) return;
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS portfolio_settings (
        id TEXT PRIMARY KEY,
        content JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    isTableInitialized = true;
  } catch (err) {
    console.warn('Could not ensure portfolio_settings table exists:', err);
  }
}

/**
 * Reads global portfolio content:
 * 1. Checks PostgreSQL database (Neon on Vercel) if DATABASE_URL is set
 * 2. Checks in-memory cache
 * 3. Checks data/portfolio-content.json file
 * 4. Falls back to defaultPortfolioContent
 */
export async function getGlobalPortfolioContent(): Promise<PortfolioContent> {
  // 1. Try PostgreSQL Database (Vercel Production)
  if (process.env.DATABASE_URL) {
    try {
      await ensureTableExists();
      const rows = await prisma.$queryRawUnsafe<Array<{ content: any }>>(`
        SELECT content FROM portfolio_settings WHERE id = 'global' LIMIT 1;
      `);
      if (rows && rows.length > 0 && rows[0].content) {
        const normalized = normalizePortfolioContent(rows[0].content);
        memoryCachedContent = normalized;
        return normalized;
      }
    } catch (err) {
      console.warn('Error querying portfolio_settings from database:', err);
    }
  }

  // 2. Check in-memory cache
  if (memoryCachedContent) {
    return memoryCachedContent;
  }

  // 3. Fallback to local file (local development)
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      const normalized = normalizePortfolioContent(parsed);
      memoryCachedContent = normalized;
      return normalized;
    }
  } catch (error) {
    // Expected on Vercel read-only filesystem if file is not writable
  }

  return defaultPortfolioContent;
}

/**
 * Saves global portfolio content:
 * 1. Saves to PostgreSQL database (Neon on Vercel)
 * 2. Updates in-memory cache
 * 3. Saves to local file if writable
 */
export async function saveGlobalPortfolioContent(content: PortfolioContent): Promise<boolean> {
  memoryCachedContent = content;
  let savedToDb = false;

  // 1. Save to PostgreSQL Database
  if (process.env.DATABASE_URL) {
    try {
      await ensureTableExists();
      const contentJson = JSON.stringify(content);
      await prisma.$executeRawUnsafe(
        `
        INSERT INTO portfolio_settings (id, content, updated_at)
        VALUES ('global', $1::jsonb, CURRENT_TIMESTAMP)
        ON CONFLICT (id) DO UPDATE
        SET content = EXCLUDED.content, updated_at = CURRENT_TIMESTAMP;
      `,
        contentJson
      );
      savedToDb = true;
    } catch (err) {
      console.error('Failed to save portfolio content to database:', err);
    }
  }

  // 2. Try saving to local file (succeeds locally, silently handled if read-only on Vercel)
  let savedToFile = false;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(content, null, 2), 'utf-8');
    savedToFile = true;
  } catch (error) {
    // Normal on Vercel serverless read-only filesystem
  }

  // Also try saving to /tmp on serverless if available
  try {
    const tmpFile = path.join('/tmp', 'portfolio-content.json');
    fs.writeFileSync(tmpFile, JSON.stringify(content, null, 2), 'utf-8');
  } catch {}

  return savedToDb || savedToFile;
}
