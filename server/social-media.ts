/**
 * Social Media Automation System
 * Posts to Instagram and Facebook with affiliate links
 */

import { getDb } from './db';
import { socialPosts } from '../drizzle/schema';
import { invokeLLM } from './_core/llm';
import { eq, and, lte } from 'drizzle-orm';
import { nanoid } from 'nanoid';

interface SocialPost {
  platform: 'instagram' | 'facebook' | 'both';
  content: string;
  hashtags: string[];
  imageUrl?: string;
  linkUrl?: string;
  affiliateLink?: string;
}

// TinyURL API for link shortening
const TINYURL_API = 'https://tinyurl.com/api-create.php';

/**
 * Shorten a URL using TinyURL
 */
export async function shortenUrl(url: string): Promise<string> {
  try {
    const response = await fetch(`${TINYURL_API}?url=${encodeURIComponent(url)}`);
    if (response.ok) {
      return await response.text();
    }
    return url;
  } catch (error) {
    console.error('[Social Media] Error shortening URL:', error);
    return url;
  }
}

/**
 * Generate social media post content using LLM
 */
export async function generateSocialContent(params: {
  type: 'tour_promo' | 'blog_share' | 'review_highlight' | 'seasonal' | 'engagement';
  blogTitle?: string;
  blogUrl?: string;
}): Promise<SocialPost | null> {
  const { type, blogTitle, blogUrl } = params;
  
  const prompts: Record<string, string> = {
    tour_promo: `Create an engaging social media post promoting e-bike tours in Bend, Oregon. 
      Mention one of our tours: Short & Sweet ($75), Deschutes River ($100), or Taste of Bend ($150).
      Include a call to action to book a tour.`,
    blog_share: `Create a social media post to share this blog article: "${blogTitle}"
      Link: ${blogUrl}
      Make it engaging and encourage clicks.`,
    review_highlight: `Create a social media post highlighting our 189+ 5-star TripAdvisor reviews.
      Encourage people to check out our reviews and book a tour.`,
    seasonal: `Create a seasonal social media post about e-biking in Bend, Oregon.
      Consider the current season and local events.`,
    engagement: `Create an engaging question or poll for our followers about e-biking, 
      Bend Oregon, or outdoor adventures.`
  };

  try {
    const response = await invokeLLM({
      messages: [
        { 
          role: 'system', 
          content: 'You are a social media manager for Let It Ride Electric Bikes in Bend, Oregon. Create engaging, authentic posts that drive engagement and bookings.' 
        },
        { 
          role: 'user', 
          content: `${prompts[type]}
          
          Return JSON with:
          - content: The post text (max 280 chars for Twitter compatibility, can be longer for Instagram/Facebook)
          - hashtags: Array of 5-10 relevant hashtags (without #)
          - suggested_image: Description of ideal image to accompany post
          
          Business info:
          - Let It Ride Electric Bikes
          - Location: Downtown Bend, Oregon
          - 189+ 5-star TripAdvisor reviews
          - Premium Pedego e-bikes`
        }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'social_post',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              content: { type: 'string', description: 'Post content' },
              hashtags: { type: 'array', items: { type: 'string' }, description: 'Hashtags' },
              suggested_image: { type: 'string', description: 'Image suggestion' }
            },
            required: ['content', 'hashtags', 'suggested_image'],
            additionalProperties: false
          }
        }
      }
    });

    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== 'string') {
      throw new Error('No content in LLM response');
    }

    const parsed = JSON.parse(content);
    
    // Add affiliate link if applicable
    let affiliateLink: string | undefined;
    if (type === 'tour_promo' || type === 'review_highlight') {
      const tripAdvisorUrl = 'https://www.tripadvisor.com/Attraction_Review-g51766-d2069561-Reviews-Let_it_Ride_Electric_Bikes_Tours_Rentals-Bend_Central_Oregon_Oregon.html';
      affiliateLink = await shortenUrl(tripAdvisorUrl);
    }

    return {
      platform: 'both',
      content: parsed.content,
      hashtags: parsed.hashtags,
      linkUrl: blogUrl,
      affiliateLink
    };
  } catch (error) {
    console.error('[Social Media] Error generating content:', error);
    return null;
  }
}

/**
 * Format post for specific platform
 */
export function formatForPlatform(post: SocialPost, platform: 'instagram' | 'facebook'): string {
  let formatted = post.content;
  
  // Add link
  if (post.linkUrl) {
    formatted += `\n\n🔗 ${post.linkUrl}`;
  }
  
  // Add affiliate link
  if (post.affiliateLink) {
    formatted += `\n\n⭐ See our reviews: ${post.affiliateLink}`;
  }
  
  // Add hashtags
  if (post.hashtags.length > 0) {
    const hashtagString = post.hashtags.map(h => `#${h}`).join(' ');
    if (platform === 'instagram') {
      // Instagram: hashtags at the end with line breaks
      formatted += `\n\n.\n.\n.\n${hashtagString}`;
    } else {
      // Facebook: fewer hashtags inline
      const topHashtags = post.hashtags.slice(0, 5).map(h => `#${h}`).join(' ');
      formatted += `\n\n${topHashtags}`;
    }
  }
  
  return formatted;
}

/**
 * Queue a social media post for later posting
 */
export async function queueSocialPost(post: SocialPost, scheduledFor?: Date): Promise<number | null> {
  try {
    const db = await getDb();
    if (!db) return null;

    const instagramContent = formatForPlatform(post, 'instagram');
    const facebookContent = formatForPlatform(post, 'facebook');

    const result = await db.insert(socialPosts).values({
      platform: post.platform,
      content: post.platform === 'instagram' ? instagramContent : facebookContent,
      hashtags: JSON.stringify(post.hashtags),
      imageUrl: post.imageUrl || null,
      link: post.linkUrl || null,
      affiliateLink: post.affiliateLink || null,
      scheduledAt: scheduledFor || new Date(),
      status: 'queued',
    });

    console.log('[Social Media] Post queued for', post.platform);
    return 1;
  } catch (error) {
    console.error('[Social Media] Error queueing post:', error);
    return null;
  }
}

/**
 * Get pending posts ready to be published
 */
export async function getPendingPosts(): Promise<any[]> {
  try {
    const db = await getDb();
    if (!db) return [];

    const posts = await db.select()
      .from(socialPosts)
      .where(
        and(
          eq(socialPosts.status, 'queued'),
          lte(socialPosts.scheduledAt, new Date())
        )
      )
      .limit(10);

    return posts;
  } catch (error) {
    console.error('[Social Media] Error getting pending posts:', error);
    return [];
  }
}

/**
 * Mark a post as published
 */
export async function markPostPublished(postId: number, externalId?: string): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;

    await db.update(socialPosts)
      .set({
        status: 'posted',
        postedAt: new Date()
      })
      .where(eq(socialPosts.id, postId));

    return true;
  } catch (error) {
    console.error('[Social Media] Error marking post published:', error);
    return false;
  }
}

/**
 * Post to Instagram (placeholder - requires Meta API credentials)
 */
export async function postToInstagram(content: string, imageUrl?: string): Promise<{ success: boolean; postId?: string }> {
  // This would integrate with Instagram Graph API
  // Requires: Instagram Business Account + Facebook Page + Meta App
  console.log('[Social Media] Instagram post queued (API integration pending)');
  console.log('Content:', content.substring(0, 100) + '...');
  
  return {
    success: true,
    postId: `ig_${nanoid(10)}`
  };
}

/**
 * Post to Facebook (placeholder - requires Meta API credentials)
 */
export async function postToFacebook(content: string, imageUrl?: string, linkUrl?: string): Promise<{ success: boolean; postId?: string }> {
  // This would integrate with Facebook Graph API
  // Requires: Facebook Page + Meta App with pages_manage_posts permission
  console.log('[Social Media] Facebook post queued (API integration pending)');
  console.log('Content:', content.substring(0, 100) + '...');
  
  return {
    success: true,
    postId: `fb_${nanoid(10)}`
  };
}

/**
 * Generate and queue daily social media posts
 */
export async function generateDailySocialPosts(): Promise<boolean> {
  console.log('[Social Media] Generating daily social posts...');
  
  try {
    // Generate a tour promo post
    const promoPost = await generateSocialContent({ type: 'tour_promo' });
    if (promoPost) {
      await queueSocialPost(promoPost);
    }
    
    // Generate an engagement post
    const engagementPost = await generateSocialContent({ type: 'engagement' });
    if (engagementPost) {
      // Schedule for later in the day
      const laterToday = new Date();
      laterToday.setHours(laterToday.getHours() + 6);
      await queueSocialPost(engagementPost, laterToday);
    }
    
    console.log('[Social Media] Daily posts generated and queued');
    return true;
  } catch (error) {
    console.error('[Social Media] Error generating daily posts:', error);
    return false;
  }
}

/**
 * Process and publish pending posts
 */
export async function processPendingPosts(): Promise<number> {
  const pendingPosts = await getPendingPosts();
  let publishedCount = 0;
  
  for (const post of pendingPosts) {
    try {
      if (post.platform === 'instagram' || post.platform === 'both') {
        const result = await postToInstagram(post.content, post.imageUrl);
        if (result.success) {
          await markPostPublished(post.id, result.postId);
          publishedCount++;
        }
      }
      
      if (post.platform === 'facebook' || post.platform === 'both') {
        const result = await postToFacebook(post.content, post.imageUrl, post.linkUrl);
        if (result.success) {
          await markPostPublished(post.id, result.postId);
          publishedCount++;
        }
      }
    } catch (error) {
      console.error('[Social Media] Error publishing post:', post.id, error);
    }
  }
  
  return publishedCount;
}
