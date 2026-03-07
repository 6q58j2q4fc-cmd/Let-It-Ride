import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEOHead, PAGE_SEO } from '@/components/SEOHead';
import { Calendar, Clock, ChevronRight, User, Loader2, BookOpen } from 'lucide-react';
import { trpc } from '@/lib/trpc';

// Default static posts for fallback
const defaultBlogPosts = [
  {
    id: 1,
    slug: 'best-ebike-trails-bend-oregon',
    title: 'The 10 Best E-Bike Trails in Bend, Oregon',
    excerpt: 'Discover the most scenic and enjoyable e-bike trails in Central Oregon, from riverside paths to mountain adventures.',
    featuredImage: '/images/cascade-mountains.jpg',
    category: 'Trails & Routes',
    publishedAt: new Date('2026-01-10'),
    content: '',
    isAiGenerated: false
  },
  {
    id: 2,
    slug: 'why-ebikes-perfect-bend-vacation',
    title: 'Why E-Bikes Are Perfect for Your Bend Vacation',
    excerpt: 'Learn why electric bikes are the ideal way to explore Bend, Oregon during your visit to Central Oregon.',
    featuredImage: '/images/ebike-scenic.jpg',
    category: 'Travel Tips',
    publishedAt: new Date('2026-01-08'),
    content: '',
    isAiGenerated: false
  },
  {
    id: 3,
    slug: 'pedego-electric-bike-guide',
    title: 'Complete Guide to Pedego Electric Bikes',
    excerpt: 'Everything you need to know about Pedego e-bikes, from choosing the right model to maintenance tips.',
    featuredImage: '/images/pedego-element.jpg',
    category: 'E-Bike Guide',
    publishedAt: new Date('2026-01-05'),
    content: '',
    isAiGenerated: false
  },
  {
    id: 4,
    slug: 'bend-brewery-tour-guide',
    title: 'The Ultimate Bend Brewery Tour Guide',
    excerpt: 'Plan your perfect brewery hopping adventure in Bend with our comprehensive guide to the best craft breweries.',
    featuredImage: '/images/bend-brewery-patio.jpg',
    category: 'Local Guide',
    publishedAt: new Date('2026-01-03'),
    content: '',
    isAiGenerated: false
  },
  {
    id: 5,
    slug: 'deschutes-river-trail-ebike',
    title: 'Exploring the Deschutes River Trail by E-Bike',
    excerpt: 'A detailed guide to riding the beautiful Deschutes River Trail, including tips, stops, and what to expect.',
    featuredImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663234433834/JAjQFNXBbA5Quy72adLon7/deschutes-river-trail_ab82c02b.jpg',
    category: 'Trails & Routes',
    publishedAt: new Date('2026-01-01'),
    content: '',
    isAiGenerated: false
  },
  {
    id: 6,
    slug: 'family-ebike-adventures-bend',
    title: 'Family E-Bike Adventures in Bend',
    excerpt: 'Tips and ideas for enjoying e-bike rides with the whole family, including kid-friendly routes and equipment.',
    featuredImage: '/images/ebike-tour-group.jpg',
    category: 'Family Fun',
    publishedAt: new Date('2025-12-28'),
    content: '',
    isAiGenerated: false
  }
];

const categories = ['All', 'Trails & Routes', 'Travel Tips', 'E-Bike Guide', 'Local Guide', 'Family Fun', 'Adventures'];

// Helper to estimate read time from content
function estimateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content?.split(/\s+/).length || 0;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${Math.max(minutes, 3)} min read`;
}

export default function Blog() {
  // Fetch blog posts from database
  const { data: dbPosts, isLoading } = trpc.blog.getAll.useQuery();
  
  // Combine database posts with default posts, prioritizing database posts
  const blogPosts = dbPosts && dbPosts.length > 0 
    ? [...dbPosts, ...defaultBlogPosts.filter(dp => !dbPosts.some(p => p.slug === dp.slug))]
    : defaultBlogPosts;

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={PAGE_SEO.blog.title}
        description={PAGE_SEO.blog.description}
        keywords={PAGE_SEO.blog.keywords}
        canonicalUrl="https://letitridebend.com/blog"
        structuredData={PAGE_SEO.blog.structuredData}
      />
      <Header />
      
      {/* Hero */}
      <section className="relative py-20 bg-[oklch(0.14_0.03_148)] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="container relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-sm font-medium mb-5">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              Let It Ride Blog
            </div>
            <h1 className="heading-display text-4xl md:text-5xl text-white mb-4">
              E-Bike Adventures &amp; <span className="text-gradient-amber">Local Tips</span>
            </h1>
            <p className="text-lg text-white/65 leading-relaxed max-w-xl">
              Discover the best trails, local secrets, and e-bike tips for exploring Bend, Oregon.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-5 border-b border-border bg-white">
        <div className="container">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  cat === 'All'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'border border-border hover:border-primary hover:text-primary text-muted-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12">
        <div className="container">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading posts...</span>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {blogPosts.length > 0 && (
                <div className="mb-12 rounded-2xl overflow-hidden border border-border shadow-[0_4px_24px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.11)] transition-shadow duration-300">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative h-64 md:h-auto min-h-[280px]">
                      <img
                        src={blogPosts[0].featuredImage || '/images/cascade-mountains.jpg'}
                        alt={blogPosts[0].title}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/images/cascade-mountains.jpg'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <span className="absolute top-4 left-4 px-3 py-1.5 bg-amber-400 text-amber-950 text-xs font-bold rounded-full">
                        {blogPosts[0].isAiGenerated ? 'New' : 'Featured'}
                      </span>
                    </div>
                    <div className="p-8 lg:p-10 bg-white flex flex-col justify-center">
                      <span className="inline-block px-3 py-1 rounded-full bg-primary/8 text-primary text-xs font-semibold mb-4">
                        {blogPosts[0].category || 'Adventures'}
                      </span>
                      <h2 className="heading-section text-2xl md:text-3xl text-foreground mb-4">
                        {blogPosts[0].title}
                      </h2>
                      <p className="text-muted-foreground mb-5 text-sm leading-relaxed">
                        {blogPosts[0].excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(blogPosts[0].publishedAt || new Date()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {estimateReadTime(blogPosts[0].content || '')}
                        </span>
                      </div>
                      <Link href={`/blog/${blogPosts[0].slug}`}>
                        <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all duration-200 shadow-md hover:-translate-y-0.5 w-fit" style={{ fontFamily: 'Sora, sans-serif' }}>
                          Read Article
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Post Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.slice(1).map((post) => (
                  <div key={post.id} className="group bg-white rounded-2xl overflow-hidden border border-border shadow-[0_2px_12px_rgba(0,0,0,0.05)] hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)] transition-all duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.featuredImage || '/images/cascade-mountains.jpg'}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/images/cascade-mountains.jpg'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    </div>
                    <div className="p-5">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-primary/8 text-primary text-xs font-semibold mb-3">
                        {post.category || 'Adventures'}
                      </span>
                      <h3 className="font-bold text-foreground line-clamp-2 mb-2 leading-snug" style={{ fontFamily: 'Sora, sans-serif' }}>
                        {post.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(post.publishedAt || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <Link href={`/blog/${post.slug}`}>
                          <button className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                            Read More
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Articles
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 section-subtle border-t border-border">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter for the latest e-bike tips, trail updates, and exclusive offers.
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              <button className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors" style={{ fontFamily: 'Sora, sans-serif' }}>Subscribe</button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
