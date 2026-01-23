import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// Simple bot detection - checks common bot user agents
function isBot(userAgent: string): boolean {
  const botPatterns = [
    'bot',
    'crawler',
    'spider',
    'scraper',
    'curl',
    'wget',
    'headless',
    'phantom',
    'python-requests',
    'axios',
    'java',
    'go-http-client',
  ];

  const ua = userAgent.toLowerCase();
  return botPatterns.some((pattern) => ua.includes(pattern));
}

// Create fingerprint from IP + User Agent
function createFingerprint(ip: string, userAgent: string): string {
  return crypto
    .createHash('sha256')
    .update(`${ip}:${userAgent}`)
    .digest('hex');
}

// Hash IP for privacy
function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    // Extract IP address
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor
      ? forwardedFor.split(',')[0].trim()
      : request.headers.get('x-real-ip') || 'unknown';

    // Extract User Agent
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Check if it's a bot - if yes, don't track
    if (isBot(userAgent)) {
      return NextResponse.json(
        { success: true, message: 'Bot detected - not tracked' },
        { status: 200 }
      );
    }

    // Get existing cookie
    const existingCookieId = request.cookies.get('visitor_id')?.value;

    // Create fingerprint
    const fingerprint = createFingerprint(ip, userAgent);
    const ipHash = hashIP(ip);

    // Get start of today (00:00:00)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Check if visitor already visited today
    const existingVisitor = await prisma.visitor.findFirst({
      where: {
        OR: [
          { cookieId: existingCookieId || undefined },
          { fingerprint: fingerprint },
        ],
        visitDate: {
          gte: todayStart,
        },
      },
    });

    // If visitor already counted today, just return success
    if (existingVisitor) {
      return NextResponse.json(
        { success: true, message: 'Already counted today' },
        { status: 200 }
      );
    }

    // New visitor today - create record
    const newCookieId = crypto.randomUUID();

    await prisma.visitor.create({
      data: {
        fingerprint,
        cookieId: newCookieId,
        userAgent,
        ipHash,
        isBot: false,
      },
    });

    // Set cookie for 24 hours
    const response = NextResponse.json(
      { success: true, message: 'Visit recorded' },
      { status: 200 }
    );

    response.cookies.set('visitor_id', newCookieId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 24 hours in seconds
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error tracking visitor:', error);
    return NextResponse.json(
      { success: false, message: 'Error tracking visitor' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to retrieve visitor stats
export async function GET() {
  try {
    // Today's count
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayCount = await prisma.visitor.count({
      where: {
        visitDate: {
          gte: todayStart,
        },
        isBot: false,
      },
    });

    // All-time count
    const totalCount = await prisma.visitor.count({
      where: {
        isBot: false,
      },
    });

    // Last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const lastWeekCount = await prisma.visitor.count({
      where: {
        visitDate: {
          gte: sevenDaysAgo,
        },
        isBot: false,
      },
    });

    return NextResponse.json({
      success: true,
      stats: {
        today: todayCount,
        lastWeek: lastWeekCount,
        allTime: totalCount,
      },
    });
  } catch (error) {
    console.error('Error fetching visitor stats:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching stats' },
      { status: 500 }
    );
  }
}
