import { Request, Response } from 'express';
import { runDailyAutomation } from './automation';
import { getDb } from './db';
import { blogPosts, socialPosts } from '../drizzle/schema';
import { desc } from 'drizzle-orm';

// Secret key for cron job authentication (should match what's configured in the scheduler)
const CRON_SECRET = process.env.CRON_SECRET || 'letitride-cron-secret-2024';

/**
 * Verify cron request authenticity
 */
function verifyCronRequest(req: Request): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader) return false;
  
  const token = authHeader.replace('Bearer ', '');
  return token === CRON_SECRET;
}

/**
 * Main daily cron handler - runs all automated tasks
 * This endpoint should be called by an external cron service daily at 9 AM
 */
export async function handleDailyCron(req: Request, res: Response) {
  console.log('[Cron] Daily automation triggered at', new Date().toISOString());
  
  try {
    // Run the full daily automation
    const results = await runDailyAutomation();
    
    console.log('[Cron] Daily automation completed:', results);
    
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      results: {
        blog: results.blog,
        social: results.social
      }
    });
    
  } catch (error) {
    console.error('[Cron] Error in daily automation:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Get automation status and recent posts
 */
export async function getAutomationStatus(req: Request, res: Response) {
  try {
    const db = await getDb();
    
    let recentBlogPosts: any[] = [];
    let recentSocialPosts: any[] = [];
    let blogCount = 0;
    let socialCount = 0;
    
    if (db) {
      recentBlogPosts = await db
        .select()
        .from(blogPosts)
        .orderBy(desc(blogPosts.createdAt))
        .limit(5);
      
      recentSocialPosts = await db
        .select()
        .from(socialPosts)
        .orderBy(desc(socialPosts.createdAt))
        .limit(10);
      
      blogCount = recentBlogPosts.length;
      socialCount = recentSocialPosts.length;
    }
    
    res.json({
      success: true,
      status: {
        blogAutomation: 'active',
        socialAutomation: 'active',
        wordpressIntegration: 'configured',
        wordpressUrl: 'http://bn2fdnkzf8-virgt.wordpress.com',
        lastCheck: new Date().toISOString(),
        schedule: {
          blogGeneration: '9:00 AM daily (Pacific Time)',
          socialPosting: '10:00 AM daily (Pacific Time)',
          wordpressSync: '9:00 AM daily (Pacific Time)'
        },
        stats: {
          totalBlogPosts: blogCount,
          totalSocialPosts: socialCount
        }
      },
      recentBlogPosts: recentBlogPosts.map(p => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        status: p.status,
        createdAt: p.createdAt,
        isAiGenerated: p.isAiGenerated
      })),
      recentSocialPosts: recentSocialPosts.map(p => ({
        id: p.id,
        platform: p.platform,
        content: p.content?.substring(0, 100) + '...',
        status: p.status,
        createdAt: p.createdAt
      }))
    });
  } catch (error) {
    console.error('[Status] Error getting automation status:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Health check endpoint for monitoring
 */
export async function healthCheck(req: Request, res: Response) {
  res.json({
    status: 'healthy',
    service: 'Let It Ride Bend - Automation Service',
    timestamp: new Date().toISOString(),
    endpoints: {
      dailyCron: '/api/cron/daily',
      status: '/api/cron/status',
      health: '/api/cron/health'
    }
  });
}
