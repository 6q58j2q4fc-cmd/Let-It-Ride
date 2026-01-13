/**
 * Automated SEO Blog Post Generator
 * Uses LLM to generate daily blog posts about Bend, Oregon e-bike tours
 */

import { invokeLLM } from './_core/llm';
import { getDb } from './db';
import { blogPosts } from '../drizzle/schema';
import { nanoid } from 'nanoid';

interface BlogPostContent {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
}

const BLOG_TOPICS = [
  {
    category: 'trails',
    topics: [
      'Best e-bike trails in Bend Oregon',
      'Scenic routes along the Deschutes River',
      'Mountain biking trails for e-bikes',
      'Family-friendly bike paths in Central Oregon',
      'Hidden gem trails near Bend',
      'Sunrise and sunset ride routes',
      'Waterfall trails accessible by e-bike'
    ]
  },
  {
    category: 'travel',
    topics: [
      'Planning your Bend Oregon vacation',
      'Best time to visit Bend for e-biking',
      'What to pack for an e-bike tour',
      'Bend Oregon travel guide for cyclists',
      'Weekend getaway ideas in Central Oregon',
      'Combining e-bike tours with other activities'
    ]
  },
  {
    category: 'ebike',
    topics: [
      'Pedego e-bike buying guide',
      'E-bike maintenance tips',
      'Choosing the right e-bike for you',
      'E-bike battery care and longevity',
      'Safety tips for e-bike riders',
      'E-bike accessories you need'
    ]
  },
  {
    category: 'local',
    topics: [
      'Best breweries to visit by e-bike in Bend',
      'Local restaurants near bike trails',
      'Bend Oregon craft beer scene',
      'Coffee shops along bike routes',
      'Local events and festivals in Bend',
      'Wildlife spotting on e-bike tours'
    ]
  },
  {
    category: 'family',
    topics: [
      'E-biking with kids in Bend',
      'Family vacation activities in Central Oregon',
      'Kid-friendly e-bike routes',
      'Multi-generational e-bike adventures',
      'Teaching kids to ride e-bikes safely'
    ]
  }
];

/**
 * Generate a random topic for a blog post
 */
function getRandomTopic(): { category: string; topic: string } {
  const categoryIndex = Math.floor(Math.random() * BLOG_TOPICS.length);
  const category = BLOG_TOPICS[categoryIndex];
  const topicIndex = Math.floor(Math.random() * category.topics.length);
  return {
    category: category.category,
    topic: category.topics[topicIndex]
  };
}

/**
 * Generate a slug from a title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 60);
}

/**
 * Generate a blog post using LLM
 */
export async function generateBlogPost(customTopic?: string): Promise<BlogPostContent | null> {
  const { category, topic } = customTopic 
    ? { category: 'custom', topic: customTopic }
    : getRandomTopic();
  
  try {
    const prompt = `You are an expert content writer for Let It Ride Electric Bikes, an e-bike tour and rental company in Bend, Oregon. 

Write a comprehensive, SEO-optimized blog post about: "${topic}"

The blog post should:
1. Be 800-1200 words
2. Include relevant keywords for SEO
3. Be engaging and informative
4. Include practical tips and local knowledge
5. Mention Let It Ride Electric Bikes naturally (not too promotional)
6. Include a call-to-action to book a tour or rent an e-bike

Business details to reference:
- Location: 25 NW Minnesota Ave #6, Bend, OR
- Phone: (541) 647-2331
- Tours: Short & Sweet ($75), Deschutes River ($100), Taste of Bend ($150)
- Premium Pedego e-bikes
- 189+ 5-star TripAdvisor reviews

Return the response as a JSON object with these fields:
- title: Catchy, SEO-friendly title (max 60 chars)
- content: Full blog post in Markdown format
- excerpt: Brief summary (max 160 chars)
- tags: Array of 5-7 relevant tags
- seoTitle: SEO meta title (max 60 chars)
- seoDescription: SEO meta description (max 160 chars)
- seoKeywords: Array of 5-10 SEO keywords`;

    const response = await invokeLLM({
      messages: [
        { role: 'system', content: 'You are an expert SEO content writer specializing in travel and outdoor recreation content.' },
        { role: 'user', content: prompt }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'blog_post',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              title: { type: 'string', description: 'Blog post title' },
              content: { type: 'string', description: 'Full blog post content in Markdown' },
              excerpt: { type: 'string', description: 'Brief summary' },
              tags: { type: 'array', items: { type: 'string' }, description: 'Relevant tags' },
              seoTitle: { type: 'string', description: 'SEO meta title' },
              seoDescription: { type: 'string', description: 'SEO meta description' },
              seoKeywords: { type: 'array', items: { type: 'string' }, description: 'SEO keywords' }
            },
            required: ['title', 'content', 'excerpt', 'tags', 'seoTitle', 'seoDescription', 'seoKeywords'],
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
    
    return {
      title: parsed.title,
      slug: generateSlug(parsed.title),
      content: parsed.content,
      excerpt: parsed.excerpt,
      category,
      tags: parsed.tags,
      seoTitle: parsed.seoTitle,
      seoDescription: parsed.seoDescription,
      seoKeywords: parsed.seoKeywords
    };
  } catch (error) {
    console.error('[Blog Generator] Error generating blog post:', error);
    return null;
  }
}

/**
 * Save a generated blog post to the database
 */
export async function saveBlogPost(post: BlogPostContent): Promise<number | null> {
  try {
    const db = await getDb();
    if (!db) {
      console.error('[Blog Generator] Database not available');
      return null;
    }

    const result = await db.insert(blogPosts).values({
      title: post.title,
      slug: post.slug + '-' + nanoid(6),
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      tags: JSON.stringify(post.tags),
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      seoKeywords: JSON.stringify(post.seoKeywords),
      featuredImage: getRandomFeaturedImage(),
      status: 'published',
      publishedAt: new Date(),
      authorId: 1, // System/admin author
    });

    console.log('[Blog Generator] Blog post saved:', post.title);
    return (result as any)[0]?.insertId ? Number((result as any)[0].insertId) : 1;
  } catch (error) {
    console.error('[Blog Generator] Error saving blog post:', error);
    return null;
  }
}

/**
 * Get a random featured image for blog posts
 */
function getRandomFeaturedImage(): string {
  const images = [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
    'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=1200',
    'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=1200',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200',
    'https://images.unsplash.com/photo-1593786267440-e3d8b4e13e3f?w=1200',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200'
  ];
  return images[Math.floor(Math.random() * images.length)];
}

/**
 * Generate and publish a daily blog post
 */
export async function generateDailyBlogPost(): Promise<boolean> {
  console.log('[Blog Generator] Starting daily blog post generation...');
  
  const post = await generateBlogPost();
  if (!post) {
    console.error('[Blog Generator] Failed to generate blog post');
    return false;
  }
  
  const postId = await saveBlogPost(post);
  if (!postId) {
    console.error('[Blog Generator] Failed to save blog post');
    return false;
  }
  
  console.log('[Blog Generator] Daily blog post published:', post.title);
  return true;
}
