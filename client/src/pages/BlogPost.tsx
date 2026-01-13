import { useParams, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Calendar, Clock, ArrowLeft, Share2, Facebook, Twitter, ChevronRight, User } from 'lucide-react';

const blogPostsData: Record<string, any> = {
  'best-ebike-trails-bend-oregon': {
    id: 1,
    slug: 'best-ebike-trails-bend-oregon',
    title: 'The 10 Best E-Bike Trails in Bend, Oregon',
    excerpt: 'Discover the most scenic and enjoyable e-bike trails in Central Oregon, from riverside paths to mountain adventures.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop',
    category: 'Trails & Routes',
    author: 'Let It Ride Team',
    publishedAt: '2026-01-10',
    readTime: '8 min read',
    content: `
# The 10 Best E-Bike Trails in Bend, Oregon

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

[Book a Tour Today](/tours)
    `
  }
};

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const post = blogPostsData[params.slug || ''] || blogPostsData['best-ebike-trails-bend-oregon'];

  const relatedPosts = [
    { slug: 'why-ebikes-perfect-bend-vacation', title: 'Why E-Bikes Are Perfect for Your Bend Vacation', image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=250&fit=crop' },
    { slug: 'deschutes-river-trail-ebike', title: 'Exploring the Deschutes River Trail by E-Bike', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop' },
    { slug: 'family-ebike-adventures-bend', title: 'Family E-Bike Adventures in Bend', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Image */}
      <section className="relative h-[40vh] md:h-[50vh]">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <Link href="/blog" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>

            <Badge variant="outline" className="mb-4">
              {post.category}
            </Badge>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
            </div>

            {/* Article Content */}
            <article className="prose prose-lg max-w-none mb-12">
              <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>').replace(/## /g, '<h2>').replace(/# /g, '<h1>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            </article>

            {/* Share */}
            <div className="flex items-center gap-4 py-6 border-t border-b mb-12">
              <span className="font-medium">Share this article:</span>
              <Button variant="outline" size="icon">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* CTA */}
            <Card className="bg-primary text-primary-foreground mb-12">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Explore Bend?</h3>
                <p className="opacity-90 mb-6">
                  Book a guided e-bike tour and let us show you the best of Bend, Oregon!
                </p>
                <Link href="/tours">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    Book a Tour
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Related Posts */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((related) => (
                  <Link key={related.slug} href={`/blog/${related.slug}`}>
                    <Card className="card-hover overflow-hidden">
                      <div className="h-32">
                        <img 
                          src={related.image} 
                          alt={related.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm line-clamp-2">{related.title}</CardTitle>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
