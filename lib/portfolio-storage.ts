import fs from 'fs';
import path from 'path';
import {
  defaultPortfolioContent,
  normalizePortfolioContent,
  type PortfolioContent,
} from './portfolio-content';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'portfolio-content.json');

/**
 * Reads global portfolio content from persistent server storage (data/portfolio-content.json)
 */
export function getGlobalPortfolioContent(): PortfolioContent {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return normalizePortfolioContent(parsed);
    }
  } catch (error) {
    console.error('Error reading global portfolio content file:', error);
  }

  // If file doesn't exist, create it with default content
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify(defaultPortfolioContent, null, 2),
      'utf-8'
    );
  } catch (err) {
    console.error('Error creating initial global portfolio content file:', err);
  }

  return defaultPortfolioContent;
}

/**
 * Saves global portfolio content to persistent server storage (data/portfolio-content.json)
 */
export function saveGlobalPortfolioContent(content: PortfolioContent): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(content, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing global portfolio content file:', error);
    return false;
  }
}
