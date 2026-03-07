import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";
import { createBlogPost, createSocialPost, getPublishedBlogPosts } from "./db";
import { nanoid } from "nanoid";
import { sendBlogNotificationEmail } from "./emailNotification";
import { notifyOwner } from "./_core/notification";

// Blog topics for SEO optimization — Central Oregon / e-bike focused
export const BLOG_TOPICS = [
  "Best E-Bike Trails in Bend Oregon",
  "Top 10 Scenic Spots to Visit on an E-Bike Tour in Central Oregon",
  "Why Electric Bikes are Perfect for Bend's Terrain",
  "A Guide to Bend's Craft Brewery Scene by E-Bike",
  "Family-Friendly E-Bike Adventures in Bend",
  "Exploring the Deschutes River Trail: An E-Bike Guide",
  "Seasonal E-Bike Tours: What to Expect in Bend",
  "E-Bike Safety Tips for First-Time Riders",
  "The History of Bend Oregon: Discover It by E-Bike",
  "Pedego E-Bikes: Why We Love Them",
  "Sunset E-Bike Tours Along the Deschutes River",
  "Best Photo Spots in Bend for Your E-Bike Adventure",
  "How E-Bikes Make Bend Accessible to Everyone",
  "Taste of Bend: A Culinary E-Bike Journey",
  "Mountain Views and River Rides: Bend's Best E-Bike Routes",
  "Planning Your Perfect E-Bike Vacation in Bend",
  "Local Secrets: Hidden Gems to Discover by E-Bike",
  "E-Bike Rentals vs Tours: Which is Right for You?",
  "The Environmental Benefits of E-Bike Tourism",
  "Bend's Four Seasons: Year-Round E-Bike Adventures",
  "Smith Rock State Park by E-Bike: A Complete Guide",
  "Old Mill District Bend: Best E-Bike Stops",
  "Central Oregon Wildlife You'll See on an E-Bike Tour",
  "Urtopia E-Bikes: The Future of Electric Cycling",
  "Group E-Bike Tours: Perfect for Corporate Events and Celebrations",
];

export const SOCIAL_TEMPLATES = [
  "🚴‍♂️ Ready for an adventure? Book your e-bike tour today and explore Bend like never before! #BendOregon #EBikeTours #LetItRide",
  "☀️ Perfect weather for an e-bike ride along the Deschutes River! Who's joining us? #DeschutesRiver #EBike #BendLife",
  "🍺 Taste of Bend Tour = craft beer + e-bikes + stunning views. What more could you ask for? #CraftBeer #BendBreweries #EBikeTour",
  "🏔️ Miles of smiles await! Our guided tours show you the best of Central Oregon. Book now! #CentralOregon #Adventure #LetItRideBend",
  "⭐ Another 5-star review! Thank you to our amazing guests. See why we're #1 on TripAdvisor! #TripAdvisor #BendTours",
  "🌲 Explore downtown Bend, scenic trails, and local breweries - all on an electric bike! #ExploreBend #EBike #Oregon",
  "💚 No sweat, all fun! E-bikes make exploring Bend accessible to everyone. #ElectricBike #BendOregon #FamilyFun",
  "📸 The views from our Deschutes River Tour are unmatched. Tag us in your photos! #DeschutesRiver #BendViews #EBikeTour",
  "🎉 Looking for the perfect Bend experience? Our Short & Sweet Tour is the best bang for your buck! #BendTours #EBike",
  "🚲 Pedego e-bikes + expert guides + beautiful Bend = the perfect day! Book your tour now. #Pedego #LetItRide #BendOregon"
];

// Reliable fallback images (all verified to exist in the project)
const FALLBACK_IMAGES = [
  '/images/cascade-mountains.jpg',
  '/images/ebike-scenic.jpg',
  '/images/ebike-tour-group.jpg',
  '/images/bend-brewery-patio.jpg',
  '/images/ebike-mountain-trail.jpg',
  '/images/ebike-lake-tour.jpg',
  '/images/smith-rock.jpg',
  '/images/pedego-element.jpg',
  '/images/bend-mountain-lake.jpg',
  '/images/cascade-range.jpg',
];

/**
 * Generate an AI featured image for a blog post.
 * Falls back to a local image if generation fails.
 */
async function generateFeaturedImage(topic: string, title: string): Promise<string> {
  try {
    console.log(`[Automation] Generating AI image for: "${title}"`);
    const { url } = await generateImage({
      prompt: `Professional travel photography of ${topic} in Bend Oregon. Electric bikes on scenic Central Oregon trail with Cascade Mountains in background, golden hour lighting, vibrant colors, high quality, photorealistic, 16:9 landscape orientation.`
    });
    if (url) {
      console.log(`[Automation] AI image generated: ${url}`);
      return url;
    }
  } catch (err) {
    console.warn(`[Automation] AI image generation failed, using fallback:`, err);
  }
  // Return a random verified fallback image
  return FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
}

export async function generateDailyBlogPost(): Promise<{ success: boolean; postId?: number; title?: string; slug?: string; featuredImage?: string; error?: string }> {
  try {
    // Get existing posts to avoid duplicates
    const existingPosts = await getPublishedBlogPosts();
    const existingTitles = existingPosts.map(p => p.title.toLowerCase());

    // Find a topic that hasn't been used yet
    const availableTopics = BLOG_TOPICS.filter(topic =>
      !existingTitles.some(title => title.includes(topic.toLowerCase().split(':')[0].split(' ').slice(0, 3).join(' ')))
    );

    const topic = availableTopics.length > 0
      ? availableTopics[Math.floor(Math.random() * availableTopics.length)]
      : BLOG_TOPICS[Math.floor(Math.random() * BLOG_TOPICS.length)] + " — " + new Date().getFullYear();

    console.log(`[Automation] Generating blog post about: "${topic}"`);

    // Generate blog content using LLM
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are an expert travel blogger and SEO specialist writing for Let It Ride Electric Bikes in Bend, Oregon.
Write engaging, SEO-optimized blog posts that:
- Include relevant keywords naturally (e-bike, electric bike, Bend Oregon, tours, Deschutes River, Pedego, Central Oregon, etc.)
- Are informative and helpful for tourists planning to visit Bend
- Highlight the benefits of e-bike tours and rentals
- Include calls-to-action to book tours at letitridebend.com
- Are 1000-1500 words in length for better SEO
- Use proper headings (H2, H3) for structure
- Include local knowledge about Bend, Oregon
- Include fun facts about Bend (300+ days of sunshine, 30+ craft breweries, elevation 3,623 ft, etc.)
- Mention specific trails: Deschutes River Trail, Phil's Trail, Shevlin Park, Tumalo Creek
- Reference local landmarks: Old Mill District, Drake Park, Mirror Pond, Mt. Bachelor
- Include practical tips for visitors`
        },
        {
          role: "user",
          content: `Write a comprehensive, SEO-optimized blog post about: "${topic}"

Return the response in this exact JSON format:
{
  "title": "SEO-optimized title with primary keyword",
  "excerpt": "A compelling 150-character excerpt for previews and social sharing",
  "content": "Full blog post content in markdown format with H2 and H3 headings, bullet points, and a clear call-to-action",
  "metaTitle": "SEO meta title (60 chars max) - include Bend Oregon",
  "metaDescription": "SEO meta description (155 chars max) - compelling and keyword-rich",
  "category": "One of: adventures, trails, travel-tips, local-guide, ebike-guide, family-fun",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "keywords": "comma-separated list of 10-15 SEO keywords for this article"
}`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "blog_post",
          strict: true,
          schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              excerpt: { type: "string" },
              content: { type: "string" },
              metaTitle: { type: "string" },
              metaDescription: { type: "string" },
              category: { type: "string" },
              tags: { type: "array", items: { type: "string" } },
              keywords: { type: "string" }
            },
            required: ["title", "excerpt", "content", "metaTitle", "metaDescription", "category", "tags", "keywords"],
            additionalProperties: false
          }
        }
      }
    });

    const blogData = JSON.parse((response.choices[0].message.content as string) || "{}");

    // Create slug from title
    const slug = blogData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + nanoid(6);

    // Generate AI featured image (with fallback)
    const featuredImage = await generateFeaturedImage(topic, blogData.title);

    // Save to database
    const post = await createBlogPost({
      title: blogData.title,
      slug,
      excerpt: blogData.excerpt,
      content: blogData.content,
      category: blogData.category || 'adventures',
      tags: blogData.tags,
      seoTitle: blogData.metaTitle,
      seoDescription: blogData.metaDescription,
      seoKeywords: blogData.keywords,
      featuredImage,
      status: 'published',
      publishedAt: new Date(),
      isAiGenerated: true
    });

    console.log(`[Automation] Blog post created: "${blogData.title}" (slug: ${slug})`);

    // Send email notification to kevin@reacohomes.com
    await sendBlogNotificationEmail({
      title: blogData.title,
      slug,
      excerpt: blogData.excerpt,
      category: blogData.category,
      featuredImage: typeof featuredImage === 'string' && featuredImage.startsWith('http') ? featuredImage : undefined,
    });

    // Also send in-app owner notification
    try {
      await notifyOwner({
        title: `📝 New Blog Post Published: ${blogData.title}`,
        content: `A new SEO-optimized blog post has been automatically published on the Let It Ride website.\n\n**Title:** ${blogData.title}\n\n**Excerpt:** ${blogData.excerpt}\n\n**Read it:** https://letitrides-jajqfnxb.manus.space/blog/${slug}`
      });
    } catch (notifyErr) {
      console.warn('[Automation] Owner notification failed (non-critical):', notifyErr);
    }

    return { success: true, title: blogData.title, slug, featuredImage };
  } catch (error) {
    console.error('[Automation] Blog generation failed:', error);
    return { success: false, error: String(error) };
  }
}

export async function generateDailySocialPost(): Promise<{ success: boolean; postId?: number; error?: string }> {
  try {
    const template = SOCIAL_TEMPLATES[Math.floor(Math.random() * SOCIAL_TEMPLATES.length)];

    const posts = await getPublishedBlogPosts();
    const latestPost = posts[0];

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are a social media manager for Let It Ride Electric Bikes in Bend, Oregon.
Create engaging social media posts that drive engagement and bookings.
Keep posts under 280 characters for Twitter compatibility.
Include relevant hashtags and emojis.`
        },
        {
          role: "user",
          content: `Create a social media post based on this template: "${template}"

${latestPost ? `You can also reference our latest blog post: "${latestPost.title}"` : ''}

Return just the post content, no JSON formatting.`
        }
      ]
    });

    const content = (response.choices[0].message.content as string) || template;

    await createSocialPost({
      platform: 'both',
      content: content.slice(0, 500),
      link: latestPost ? `/blog/${latestPost.slug}` : '/tours',
      scheduledAt: new Date(Date.now() + 60 * 60 * 1000)
    });

    return { success: true };
  } catch (error) {
    console.error('[Automation] Social post generation failed:', error);
    return { success: false, error: String(error) };
  }
}

export async function runDailyAutomation(): Promise<{
  blog: { success: boolean; title?: string; slug?: string; error?: string };
  social: { success: boolean; error?: string };
}> {
  console.log('[Automation] Starting daily automation run at', new Date().toISOString());

  const blogResult = await generateDailyBlogPost();
  console.log('[Automation] Blog generation:', blogResult.success ? `Success — "${blogResult.title}"` : `Failed — ${blogResult.error}`);

  const socialResult = await generateDailySocialPost();
  console.log('[Automation] Social post generation:', socialResult.success ? 'Success' : `Failed — ${socialResult.error}`);

  return { blog: blogResult, social: socialResult };
}
