import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Calendar, Clock, ChevronRight, User } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    slug: 'best-ebike-trails-bend-oregon',
    title: 'The 10 Best E-Bike Trails in Bend, Oregon',
    excerpt: 'Discover the most scenic and enjoyable e-bike trails in Central Oregon, from riverside paths to mountain adventures.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
    category: 'Trails & Routes',
    author: 'Let It Ride Team',
    publishedAt: '2026-01-10',
    readTime: '8 min read'
  },
  {
    id: 2,
    slug: 'why-ebikes-perfect-bend-vacation',
    title: 'Why E-Bikes Are Perfect for Your Bend Vacation',
    excerpt: 'Learn why electric bikes are the ideal way to explore Bend, Oregon during your visit to Central Oregon.',
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=400&fit=crop',
    category: 'Travel Tips',
    author: 'Let It Ride Team',
    publishedAt: '2026-01-08',
    readTime: '5 min read'
  },
  {
    id: 3,
    slug: 'pedego-electric-bike-guide',
    title: 'Complete Guide to Pedego Electric Bikes',
    excerpt: 'Everything you need to know about Pedego e-bikes, from choosing the right model to maintenance tips.',
    image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&h=400&fit=crop',
    category: 'E-Bike Guide',
    author: 'Let It Ride Team',
    publishedAt: '2026-01-05',
    readTime: '10 min read'
  },
  {
    id: 4,
    slug: 'bend-brewery-tour-guide',
    title: 'The Ultimate Bend Brewery Tour Guide',
    excerpt: 'Plan your perfect brewery hopping adventure in Bend with our comprehensive guide to the best craft breweries.',
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&h=400&fit=crop',
    category: 'Local Guide',
    author: 'Let It Ride Team',
    publishedAt: '2026-01-03',
    readTime: '7 min read'
  },
  {
    id: 5,
    slug: 'deschutes-river-trail-ebike',
    title: 'Exploring the Deschutes River Trail by E-Bike',
    excerpt: 'A detailed guide to riding the beautiful Deschutes River Trail, including tips, stops, and what to expect.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=400&fit=crop',
    category: 'Trails & Routes',
    author: 'Let It Ride Team',
    publishedAt: '2026-01-01',
    readTime: '6 min read'
  },
  {
    id: 6,
    slug: 'family-ebike-adventures-bend',
    title: 'Family E-Bike Adventures in Bend',
    excerpt: 'Tips and ideas for enjoying e-bike rides with the whole family, including kid-friendly routes and equipment.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
    category: 'Family Fun',
    author: 'Let It Ride Team',
    publishedAt: '2025-12-28',
    readTime: '5 min read'
  }
];

const categories = ['All', 'Trails & Routes', 'Travel Tips', 'E-Bike Guide', 'Local Guide', 'Family Fun'];

export default function Blog() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero */}
      <section className="relative py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium mb-4">
              Let It Ride Blog
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              E-Bike Adventures & Local Tips
            </h1>
            <p className="text-xl opacity-90">
              Discover the best trails, local secrets, and e-bike tips for exploring Bend, Oregon.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b">
        <div className="container">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button 
                key={cat} 
                variant={cat === 'All' ? 'default' : 'outline'}
                size="sm"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12">
        <div className="container">
          {/* Featured Post */}
          <Card className="mb-12 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-64 md:h-auto">
                <img 
                  src={blogPosts[0].image} 
                  alt={blogPosts[0].title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                  Featured
                </Badge>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <Badge variant="outline" className="w-fit mb-4">
                  {blogPosts[0].category}
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  {blogPosts[0].title}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(blogPosts[0].publishedAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {blogPosts[0].readTime}
                  </span>
                </div>
                <Link href={`/blog/${blogPosts[0].slug}`}>
                  <Button>
                    Read Article
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Post Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post) => (
              <Card key={post.id} className="card-hover overflow-hidden">
                <div className="relative h-48">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <Badge variant="outline" className="w-fit mb-2">
                    {post.category}
                  </Badge>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <Button variant="ghost" size="sm">
                      Read More
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-secondary">
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
                className="flex-1 px-4 py-2 rounded-lg border bg-background"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
