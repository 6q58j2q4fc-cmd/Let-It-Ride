import { Request, Response } from 'express';
import { getDb } from './db';
import { blogPosts } from '../drizzle/schema';
import { desc, eq } from 'drizzle-orm';

const SITE_URL = 'https://letitridebend.com';

// Static pages for the sitemap
const STATIC_PAGES = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/tours', priority: '0.9', changefreq: 'weekly' },
  { url: '/shop', priority: '0.9', changefreq: 'weekly' },
  { url: '/rentals', priority: '0.8', changefreq: 'weekly' },
  { url: '/blog', priority: '0.8', changefreq: 'daily' },
  { url: '/about', priority: '0.7', changefreq: 'monthly' },
  { url: '/contact', priority: '0.7', changefreq: 'monthly' },
  { url: '/affiliate', priority: '0.6', changefreq: 'monthly' },
];

// Tour detail pages
const TOUR_PAGES = [
  { url: '/tours/short-sweet', priority: '0.8', changefreq: 'weekly' },
  { url: '/tours/deschutes-river', priority: '0.8', changefreq: 'weekly' },
  { url: '/tours/taste-of-bend', priority: '0.8', changefreq: 'weekly' },
];

// Product pages
const PRODUCT_PAGES = [
  { url: '/shop/pedego-interceptor', priority: '0.7', changefreq: 'weekly' },
  { url: '/shop/pedego-tandem', priority: '0.7', changefreq: 'weekly' },
  { url: '/shop/pedego-stretch', priority: '0.7', changefreq: 'weekly' },
  { url: '/shop/pedego-ridge-rider', priority: '0.7', changefreq: 'weekly' },
  { url: '/shop/pedego-trail-tracker', priority: '0.7', changefreq: 'weekly' },
];

/**
 * Generate XML Sitemap
 */
export async function generateSitemap(req: Request, res: Response) {
  try {
    const db = await getDb();
    let blogUrls: Array<{ url: string; priority: string; changefreq: string; lastmod: string }> = [];
    
    if (db) {
      // Get all published blog posts
      const posts = await db
        .select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt })
        .from(blogPosts)
        .where(eq(blogPosts.status, 'published'))
        .orderBy(desc(blogPosts.createdAt));
      
      blogUrls = posts.map(post => ({
        url: `/blog/${post.slug}`,
        priority: '0.6',
        changefreq: 'monthly',
        lastmod: post.updatedAt ? new Date(post.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      }));
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    const allPages = [
      ...STATIC_PAGES.map(p => ({ ...p, lastmod: today })),
      ...TOUR_PAGES.map(p => ({ ...p, lastmod: today })),
      ...PRODUCT_PAGES.map(p => ({ ...p, lastmod: today })),
      ...blogUrls
    ];
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allPages.map(page => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
    
    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.send(xml);
  } catch (error) {
    console.error('[Sitemap] Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
}

/**
 * Generate RSS Feed for Blog Posts
 */
export async function generateRSSFeed(req: Request, res: Response) {
  try {
    const db = await getDb();
    let posts: Array<{
      title: string;
      slug: string;
      excerpt: string | null;
      content: string;
      createdAt: Date;
      category: string | null;
    }> = [];
    
    if (db) {
      posts = await db
        .select({
          title: blogPosts.title,
          slug: blogPosts.slug,
          excerpt: blogPosts.excerpt,
          content: blogPosts.content,
          createdAt: blogPosts.createdAt,
          category: blogPosts.category
        })
        .from(blogPosts)
        .where(eq(blogPosts.status, 'published'))
        .orderBy(desc(blogPosts.createdAt))
        .limit(50);
    }
    
    const now = new Date().toUTCString();
    
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Let It Ride Electric Bikes - Bend Oregon E-Bike Blog</title>
    <link>${SITE_URL}</link>
    <description>Latest news, tips, and adventures from Bend, Oregon's premier electric bike tour company. Discover e-bike trails, local attractions, and eco-friendly travel guides.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <pubDate>${now}</pubDate>
    <ttl>60</ttl>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/logo.png</url>
      <title>Let It Ride Electric Bikes</title>
      <link>${SITE_URL}</link>
    </image>
    <copyright>Copyright ${new Date().getFullYear()} Let It Ride Electric Bikes. All rights reserved.</copyright>
    <managingEditor>info@letitridebend.com (Let It Ride Electric Bikes)</managingEditor>
    <webMaster>info@letitridebend.com (Let It Ride Electric Bikes)</webMaster>
    <category>Travel</category>
    <category>Electric Bikes</category>
    <category>Bend Oregon</category>
    <category>Outdoor Recreation</category>
${posts.map(post => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt || post.content.substring(0, 200) + '...'}]]></description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      <dc:creator>Let It Ride Electric Bikes</dc:creator>
      ${post.category ? `<category>${post.category}</category>` : ''}
    </item>`).join('\n')}
  </channel>
</rss>`;
    
    res.set('Content-Type', 'application/rss+xml');
    res.set('Cache-Control', 'public, max-age=1800'); // Cache for 30 minutes
    res.send(rss);
  } catch (error) {
    console.error('[RSS] Error generating RSS feed:', error);
    res.status(500).send('Error generating RSS feed');
  }
}

/**
 * Generate Atom Feed for Blog Posts
 */
export async function generateAtomFeed(req: Request, res: Response) {
  try {
    const db = await getDb();
    let posts: Array<{
      title: string;
      slug: string;
      excerpt: string | null;
      content: string;
      createdAt: Date;
      updatedAt: Date;
      category: string | null;
    }> = [];
    
    if (db) {
      posts = await db
        .select({
          title: blogPosts.title,
          slug: blogPosts.slug,
          excerpt: blogPosts.excerpt,
          content: blogPosts.content,
          createdAt: blogPosts.createdAt,
          updatedAt: blogPosts.updatedAt,
          category: blogPosts.category
        })
        .from(blogPosts)
        .where(eq(blogPosts.status, 'published'))
        .orderBy(desc(blogPosts.createdAt))
        .limit(50);
    }
    
    const now = new Date().toISOString();
    
    const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Let It Ride Electric Bikes - Bend Oregon E-Bike Blog</title>
  <subtitle>Latest news, tips, and adventures from Bend, Oregon's premier electric bike tour company.</subtitle>
  <link href="${SITE_URL}/atom.xml" rel="self" type="application/atom+xml"/>
  <link href="${SITE_URL}" rel="alternate" type="text/html"/>
  <id>${SITE_URL}/</id>
  <updated>${now}</updated>
  <author>
    <name>Let It Ride Electric Bikes</name>
    <email>info@letitridebend.com</email>
    <uri>${SITE_URL}</uri>
  </author>
  <rights>Copyright ${new Date().getFullYear()} Let It Ride Electric Bikes</rights>
  <generator>Let It Ride Blog Engine</generator>
  <icon>${SITE_URL}/favicon.ico</icon>
  <logo>${SITE_URL}/logo.png</logo>
${posts.map(post => `  <entry>
    <title><![CDATA[${post.title}]]></title>
    <link href="${SITE_URL}/blog/${post.slug}" rel="alternate" type="text/html"/>
    <id>${SITE_URL}/blog/${post.slug}</id>
    <published>${new Date(post.createdAt).toISOString()}</published>
    <updated>${new Date(post.updatedAt).toISOString()}</updated>
    <summary type="html"><![CDATA[${post.excerpt || post.content.substring(0, 200) + '...'}]]></summary>
    <content type="html"><![CDATA[${post.content}]]></content>
    <author>
      <name>Let It Ride Electric Bikes</name>
    </author>
    ${post.category ? `<category term="${post.category}"/>` : ''}
  </entry>`).join('\n')}
</feed>`;
    
    res.set('Content-Type', 'application/atom+xml');
    res.set('Cache-Control', 'public, max-age=1800'); // Cache for 30 minutes
    res.send(atom);
  } catch (error) {
    console.error('[Atom] Error generating Atom feed:', error);
    res.status(500).send('Error generating Atom feed');
  }
}

/**
 * Generate robots.txt
 */
export function generateRobotsTxt(req: Request, res: Response) {
  const robotsTxt = `# robots.txt for Let It Ride Electric Bikes
# https://letitridebend.com

User-agent: *
Allow: /

# Sitemaps
Sitemap: ${SITE_URL}/sitemap.xml

# RSS Feeds
# RSS: ${SITE_URL}/rss.xml
# Atom: ${SITE_URL}/atom.xml

# Disallow admin and API routes
Disallow: /admin
Disallow: /api/
Disallow: /affiliate-dashboard

# Allow search engines to crawl important pages
Allow: /tours
Allow: /shop
Allow: /rentals
Allow: /blog
Allow: /about
Allow: /contact

# Crawl-delay for polite crawling
Crawl-delay: 1
`;
  
  res.set('Content-Type', 'text/plain');
  res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
  res.send(robotsTxt);
}
