import { invokeLLM } from "./_core/llm";
import { createBlogPost, createSocialPost, getPublishedBlogPosts } from "./db";
import { nanoid } from "nanoid";

// Blog topics for SEO optimization
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
  "Bend's Four Seasons: Year-Round E-Bike Adventures"
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

export async function generateDailyBlogPost(): Promise<{ success: boolean; postId?: number; title?: string; error?: string }> {
  try {
    // Get existing posts to avoid duplicates
    const existingPosts = await getPublishedBlogPosts();
    const existingTitles = existingPosts.map(p => p.title.toLowerCase());
    
    // Find a topic that hasn't been used
    const availableTopics = BLOG_TOPICS.filter(topic => 
      !existingTitles.some(title => title.includes(topic.toLowerCase().split(':')[0]))
    );
    
    const topic = availableTopics.length > 0 
      ? availableTopics[Math.floor(Math.random() * availableTopics.length)]
      : BLOG_TOPICS[Math.floor(Math.random() * BLOG_TOPICS.length)] + " - " + new Date().toLocaleDateString();
    
    // Generate blog content using LLM
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are an expert travel blogger and SEO specialist writing for Let It Ride Electric Bikes in Bend, Oregon. 
          Write engaging, SEO-optimized blog posts that:
          - Include relevant keywords naturally (e-bike, electric bike, Bend Oregon, tours, Deschutes River, etc.)
          - Are informative and helpful for tourists planning to visit Bend
          - Highlight the benefits of e-bike tours and rentals
          - Include calls-to-action to book tours
          - Are 800-1200 words in length
          - Use proper headings (H2, H3) for structure
          - Include local knowledge about Bend, Oregon`
        },
        {
          role: "user",
          content: `Write a blog post about: "${topic}"
          
          Return the response in this exact JSON format:
          {
            "title": "SEO-optimized title",
            "excerpt": "A compelling 150-character excerpt for previews",
            "content": "Full blog post content in markdown format",
            "metaTitle": "SEO meta title (60 chars max)",
            "metaDescription": "SEO meta description (155 chars max)",
            "tags": ["tag1", "tag2", "tag3"]
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
              tags: { type: "array", items: { type: "string" } }
            },
            required: ["title", "excerpt", "content", "metaTitle", "metaDescription", "tags"],
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
    
    // Save to database
    await createBlogPost({
      title: blogData.title,
      slug,
      excerpt: blogData.excerpt,
      content: blogData.content,
      category: 'adventures',
      tags: blogData.tags,
      seoTitle: blogData.metaTitle,
      seoDescription: blogData.metaDescription,
      featuredImage: '/images/cascade-mountains.jpg',
      status: 'published',
      publishedAt: new Date(),
      isAiGenerated: true
    });

    return { success: true, title: blogData.title };
  } catch (error) {
    console.error('[Automation] Blog generation failed:', error);
    return { success: false, error: String(error) };
  }
}

export async function generateDailySocialPost(): Promise<{ success: boolean; postId?: number; error?: string }> {
  try {
    // Get a random template
    const template = SOCIAL_TEMPLATES[Math.floor(Math.random() * SOCIAL_TEMPLATES.length)];
    
    // Get latest blog post for potential link
    const posts = await getPublishedBlogPosts();
    const latestPost = posts[0];
    
    // Generate enhanced content using LLM
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
    
    // Create social post for both platforms
    const post = await createSocialPost({
      platform: 'both',
      content: content.slice(0, 500),
      link: latestPost ? `/blog/${latestPost.slug}` : '/tours',
      scheduledAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
    });

    return { success: true, postId: 1 };
  } catch (error) {
    console.error('[Automation] Social post generation failed:', error);
    return { success: false, error: String(error) };
  }
}

export async function runDailyAutomation(): Promise<{
  blog: { success: boolean; title?: string; error?: string };
  social: { success: boolean; error?: string };
}> {
  console.log('[Automation] Starting daily automation run...');
  
  const blogResult = await generateDailyBlogPost();
  console.log('[Automation] Blog generation:', blogResult.success ? 'Success' : 'Failed');
  
  const socialResult = await generateDailySocialPost();
  console.log('[Automation] Social post generation:', socialResult.success ? 'Success' : 'Failed');
  
  return {
    blog: blogResult,
    social: socialResult
  };
}
