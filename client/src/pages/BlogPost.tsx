import { Link, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Calendar, Clock, ArrowLeft, Share2, Facebook, Twitter, ChevronRight, User, Loader2, MapPin, Lightbulb, Star, Gift, Linkedin, Mail, Printer, BookmarkPlus } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Streamdown } from 'streamdown';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

// Bend, Oregon fun facts for articles
const bendFunFacts = [
  "Bend has over 300 days of sunshine per year, making it perfect for e-bike adventures!",
  "The Deschutes River that flows through Bend is over 250 miles long.",
  "Bend is home to more than 30 craft breweries - more per capita than almost any US city!",
  "Mt. Bachelor, just 22 miles from Bend, receives an average of 462 inches of snow annually.",
  "Bend was named one of the best mountain biking destinations in the world by National Geographic.",
  "The Old Mill District was once the largest sawmill operation in the world.",
  "Bend sits at an elevation of 3,623 feet above sea level.",
  "The Three Sisters volcanic peaks visible from Bend are over 10,000 feet tall.",
  "Bend's population has grown over 50% in the last decade, making it one of the fastest-growing cities in Oregon.",
  "The Newberry Volcanic Monument near Bend has the largest obsidian flow in North America."
];

// Default static posts for fallback
const defaultBlogPostsData: Record<string, any> = {
  'best-ebike-trails-bend-oregon': {
    id: 1,
    slug: 'best-ebike-trails-bend-oregon',
    title: 'The 10 Best E-Bike Trails in Bend, Oregon',
    excerpt: 'Discover the most scenic and enjoyable e-bike trails in Central Oregon, from riverside paths to mountain adventures.',
    featuredImage: '/images/cascade-mountains.jpg',
    category: 'Trails & Routes',
    publishedAt: new Date('2026-01-10'),
    seoMeta: {
      keywords: ['e-bike trails Bend Oregon', 'best cycling routes Central Oregon', 'Deschutes River Trail', 'electric bike paths', 'Bend outdoor activities'],
      description: 'Discover the 10 best e-bike trails in Bend, Oregon. From the scenic Deschutes River Trail to Phil\'s Trail Complex, explore Central Oregon\'s top cycling routes.'
    },
    content: `# The 10 Best E-Bike Trails in Bend, Oregon

Bend, Oregon is a paradise for outdoor enthusiasts, and with an e-bike, you can explore even more of this beautiful region. Here are our top 10 favorite trails for e-bike riding.

## 1. Deschutes River Trail

The Deschutes River Trail is perhaps the most iconic ride in Bend. This paved and gravel path follows the beautiful Deschutes River through town, offering stunning views and easy access to parks, breweries, and restaurants.

**Distance:** 10+ miles  
**Difficulty:** Easy  
**Highlights:** River views, wildlife, downtown access

## 2. Phil's Trail Complex

For those seeking a bit more adventure, Phil's Trail offers miles of singletrack through beautiful pine forests. E-bikes make the climbs effortless while you enjoy the scenery.

**Distance:** Various loops  
**Difficulty:** Moderate  
**Highlights:** Forest scenery, technical options

## 3. Cascade Lakes Scenic Byway

Take your e-bike on an epic adventure along the Cascade Lakes Scenic Byway. While you'll need to transport your bike to the trailheads, the views of the Cascade mountains are unmatched.

**Distance:** Various segments  
**Difficulty:** Moderate to Challenging  
**Highlights:** Mountain views, alpine lakes

## 4. Shevlin Park Loop

A local favorite, Shevlin Park offers a beautiful loop through a forested canyon. The paved and gravel paths are perfect for e-bikes of all types.

**Distance:** 5 miles  
**Difficulty:** Easy  
**Highlights:** Canyon views, creek crossings

## 5. Tumalo Creek Trail

Follow Tumalo Creek through beautiful forest scenery. This trail offers a mix of paved and natural surfaces, perfect for exploring on an e-bike.

**Distance:** 4 miles  
**Difficulty:** Easy to Moderate  
**Highlights:** Creek views, forest scenery

## Tips for E-Bike Trail Riding

1. **Check trail regulations** - Some trails have e-bike restrictions
2. **Bring water and snacks** - Even with motor assist, you'll work up an appetite
3. **Respect other trail users** - Yield to hikers and horses
4. **Stay on designated trails** - Protect the environment
5. **Book a guided tour** - Let us show you the best spots!

## Ready to Explore?

At Let It Ride, we offer guided e-bike tours that take you to the best spots in Bend. Our expert guides know all the hidden gems and can customize your experience based on your interests and skill level.

[Book a Tour Today](/tours)`
  }
};

// Helper to estimate read time from content
function estimateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content?.split(/\s+/).length || 0;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${Math.max(minutes, 3)} min read`;
}

// Get random fun facts
function getRandomFunFacts(count: number = 3): string[] {
  const shuffled = [...bendFunFacts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || '';
  const [readingProgress, setReadingProgress] = useState(0);
  const [funFacts] = useState(() => getRandomFunFacts(3));
  
  // Fetch post from database
  const { data: dbPost, isLoading } = trpc.blog.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );
  
  // Fetch related posts from database
  const { data: relatedPostsData } = trpc.blog.getAll.useQuery();
  
  // Use database post if available, otherwise fall back to static data
  const post = dbPost || defaultBlogPostsData[slug] || defaultBlogPostsData['best-ebike-trails-bend-oregon'];
  
  // Filter out current post from related posts
  const relatedPosts = (relatedPostsData || [])
    .filter((p: any) => p.slug !== slug)
    .slice(0, 3)
    .map((p: any) => ({
      slug: p.slug,
      title: p.title,
      image: p.featuredImage || '/images/cascade-mountains.jpg'
    }));

  // Reading progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / documentHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Generate share URLs
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(post?.title || '');
  const encodedExcerpt = encodeURIComponent(post?.excerpt || post?.seoMeta?.description || '');

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=Check out this article: ${encodedUrl}%0A%0A${encodedExcerpt}`
  };

  const handleShare = (platform: keyof typeof shareUrls) => {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  // SEO meta data
  const seoTitle = `${post?.title || 'Blog'} | Let It Ride Electric Bikes Bend, Oregon`;
  const seoDescription = post?.seoMeta?.description || post?.excerpt || 'Discover e-bike adventures in Bend, Oregon with Let It Ride Electric Bikes. Guided tours, rentals, and sales of premium Pedego e-bikes.';
  const seoKeywords = post?.seoMeta?.keywords?.join(', ') || 'e-bike Bend Oregon, electric bike tours, Pedego bikes, Deschutes River, Central Oregon cycling';
  const seoImage = post?.featuredImage || '/images/cascade-mountains.jpg';

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading article...</span>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords} />
        <meta name="author" content="Let It Ride Electric Bikes" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:title" content={post?.title} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={seoImage} />
        <meta property="og:site_name" content="Let It Ride Electric Bikes" />
        <meta property="article:published_time" content={new Date(post?.publishedAt || new Date()).toISOString()} />
        <meta property="article:author" content="Let It Ride Team" />
        <meta property="article:section" content={post?.category || 'Adventures'} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={currentUrl} />
        <meta name="twitter:title" content={post?.title} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={seoImage} />
        
        {/* Additional SEO */}
        <link rel="canonical" href={currentUrl} />
        <meta name="geo.region" content="US-OR" />
        <meta name="geo.placename" content="Bend, Oregon" />
        <meta name="geo.position" content="44.0582;-121.3153" />
        <meta name="ICBM" content="44.0582, -121.3153" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        {/* Reading Progress Bar */}
        <div 
          className="fixed top-0 left-0 h-1 bg-gradient-to-r from-primary via-yellow-400 to-primary z-50 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
        
        <Header />
        
        {/* Hero Image */}
        <section className="relative h-[40vh] md:h-[50vh]">
          <img 
            src={post.featuredImage || '/images/cascade-mountains.jpg'} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="container max-w-4xl">
              <Badge className="bg-primary text-primary-foreground mb-4">
                {post.category || 'Adventures'}
              </Badge>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">{post.title}</h1>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 bg-gradient-to-b from-background to-muted/20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Link href="/blog" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>

              {/* Article Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4 text-primary" />
                  Let It Ride Team
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-primary" />
                  {new Date(post.publishedAt || new Date()).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-primary" />
                  {estimateReadTime(post.content || '')}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-primary" />
                  Bend, Oregon
                </span>
              </div>

              {/* Quick Share Bar */}
              <div className="flex items-center gap-2 mb-8 p-4 bg-muted/50 rounded-lg print:hidden">
                <span className="text-sm font-medium mr-2">Share:</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-9 w-9 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
                  onClick={() => handleShare('facebook')}
                  title="Share on Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-9 w-9 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-colors"
                  onClick={() => handleShare('twitter')}
                  title="Share on Twitter/X"
                >
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-9 w-9 hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-colors"
                  onClick={() => handleShare('linkedin')}
                  title="Share on LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-9 w-9 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                  onClick={() => handleShare('email')}
                  title="Share via Email"
                >
                  <Mail className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-9 w-9 hover:bg-gray-700 hover:text-white hover:border-gray-700 transition-colors"
                  onClick={handleCopyLink}
                  title="Copy Link"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-9 w-9 hover:bg-gray-600 hover:text-white hover:border-gray-600 transition-colors ml-auto"
                  onClick={handlePrint}
                  title="Print Article"
                >
                  <Printer className="h-4 w-4" />
                </Button>
              </div>

              {/* Fun Facts Sidebar Card */}
              <div className="float-right ml-6 mb-6 w-full md:w-80 print:hidden">
                <Card className="bg-gradient-to-br from-primary/10 to-yellow-500/10 border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      Did You Know?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {funFacts.map((fact, index) => (
                      <p key={index} className="text-sm text-muted-foreground border-l-2 border-primary/50 pl-3">
                        {fact}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Article Content */}
              <article className="prose prose-lg max-w-none mb-12 prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80">
                <Streamdown>{post.content || ''}</Streamdown>
              </article>

              {/* Area Map */}
              <Card className="mb-8 overflow-hidden print:hidden">
                <CardHeader className="bg-muted/50">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Explore Bend, Oregon
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d91584.67893396453!2d-121.38661!3d44.0582!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54b8c0ffa5d3d251%3A0x1088e7acc720d1b4!2sBend%2C%20OR!5e0!3m2!1sen!2sus!4v1706000000000!5m2!1sen!2sus"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Bend, Oregon Map"
                  />
                </CardContent>
              </Card>

              {/* TripAdvisor Review CTA with BOGO Coupon */}
              <Card className="mb-8 bg-gradient-to-r from-green-600 to-green-700 text-white border-0 print:hidden">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                        <Gift className="h-10 w-10 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-2xl font-bold mb-2">🎁 Get a FREE Tour!</h3>
                      <p className="text-green-100 mb-4">
                        Love your experience with Let It Ride? Leave us a review on TripAdvisor and receive a <strong>Buy One Get One FREE</strong> tour coupon!
                      </p>
                      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                        <a 
                          href="https://www.tripadvisor.com/Attraction_Review-g29809-d12345678-Reviews-Let_It_Ride_Electric_Bikes-Bend_Oregon.html" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Button variant="secondary" size="lg" className="bg-white text-green-700 hover:bg-green-50">
                            <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                            Write a Review
                          </Button>
                        </a>
                        <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                          <span className="text-sm">Use code:</span>
                          <code className="bg-white text-green-700 px-3 py-1 rounded font-bold">BOGO-REVIEW</code>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bottom Share Section */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-b mb-12 print:hidden">
                <span className="font-medium">Enjoyed this article? Share it!</span>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="default" 
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleShare('facebook')}
                  >
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    className="bg-sky-500 hover:bg-sky-600"
                    onClick={() => handleShare('twitter')}
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    className="bg-blue-700 hover:bg-blue-800"
                    onClick={() => handleShare('linkedin')}
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                </div>
              </div>

              {/* Book a Tour CTA */}
              <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground mb-12 overflow-hidden print:hidden">
                <CardContent className="p-8 text-center relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400/20 rounded-full translate-y-1/2 -translate-x-1/2" />
                  <h3 className="text-2xl font-bold mb-4 relative">Ready to Explore Bend?</h3>
                  <p className="mb-6 opacity-90 relative max-w-lg mx-auto">
                    Book a guided e-bike tour and let our expert guides show you the best of Bend, Oregon! From scenic river trails to brewery hopping, we've got the perfect adventure for you.
                  </p>
                  <Link href="/tours">
                    <Button variant="secondary" size="lg" className="relative">
                      Book a Tour Today
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="print:hidden">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <BookmarkPlus className="h-5 w-5 text-primary" />
                    Related Articles
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {relatedPosts.map((related: any) => (
                      <Link key={related.slug} href={`/blog/${related.slug}`}>
                        <Card className="card-hover overflow-hidden group">
                          <div className="relative h-40 overflow-hidden">
                            <img 
                              src={related.image} 
                              alt={related.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          </div>
                          <CardHeader className="p-4">
                            <CardTitle className="text-sm line-clamp-2 group-hover:text-primary transition-colors">{related.title}</CardTitle>
                          </CardHeader>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          body {
            font-size: 12pt;
            line-height: 1.5;
          }
          article {
            max-width: 100% !important;
          }
          a {
            text-decoration: none;
            color: inherit;
          }
          h1, h2, h3 {
            page-break-after: avoid;
          }
          img {
            max-width: 100%;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </>
  );
}
