import { NextRequest, NextResponse } from 'next/server';
import {
  getGlobalPortfolioContent,
  saveGlobalPortfolioContent,
} from '@/lib/portfolio-storage';
import { normalizePortfolioContent } from '@/lib/portfolio-content';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const content = await getGlobalPortfolioContent();
    return NextResponse.json(content, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error) {
    console.error('Error fetching global portfolio content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch global portfolio content' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const normalized = normalizePortfolioContent(body);
    const saved = await saveGlobalPortfolioContent(normalized);

    if (!saved) {
      return NextResponse.json(
        { error: 'Failed to write content to storage' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      content: normalized,
    });
  } catch (error) {
    console.error('Error updating global portfolio content:', error);
    return NextResponse.json(
      { error: 'Failed to update global portfolio content' },
      { status: 500 }
    );
  }
}
