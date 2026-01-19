import { useState } from 'react';
import { Link, useSearch } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEOHead, PAGE_SEO } from '@/components/SEOHead';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { ShoppingCart, ChevronRight, Filter, Star, Zap, Phone } from 'lucide-react';

const categories = [
  { id: 'all', name: 'All E-Bikes' },
  { id: 'cruiser', name: 'Cruisers' },
  { id: 'low-step', name: 'Low Step / Step-Thru' },
  { id: 'commuter', name: 'Commuters' },
  { id: 'cargo', name: 'Cargo Bikes' },
  { id: 'adventure', name: 'Adventure' },
  { id: 'fat-tire', name: 'Fat-Tire Bikes' },
  { id: 'trike', name: 'Trikes' },
  { id: 'accessory', name: 'Accessories' }
];

// Products matching pedegobend.com pricing and models
const products = [
  // Cruiser Category
  {
    id: 1,
    slug: 'pedego-interceptor',
    name: 'Pedego Interceptor',
    category: 'cruiser',
    price: 1949,
    salePrice: null,
    image: '/images/products/pedego-interceptor.jpg',
    shortDescription: 'Classic cruiser with powerful performance. Top speed 20/28 MPH, range up to 75 miles.',
    brand: 'Pedego',
    isFeatured: true,
    rating: 4.9,
    specs: { topSpeed: '20/28 MPH', range: '75 miles', payload: '250 lb' }
  },
  {
    id: 2,
    slug: 'pedego-interceptor-platinum',
    name: 'Pedego Interceptor: Platinum Edition',
    category: 'cruiser',
    price: 2499,
    salePrice: null,
    image: '/images/products/pedego-interceptor.jpg',
    shortDescription: 'Premium cruiser with upgraded features. Top speed 20/28 MPH, range up to 75 miles.',
    brand: 'Pedego',
    isFeatured: false,
    rating: 4.9,
    specs: { topSpeed: '20/28 MPH', range: '75 miles', payload: '250 lb' }
  },
  {
    id: 3,
    slug: 'pedego-comfort-cruiser',
    name: 'Pedego Comfort Cruiser',
    category: 'cruiser',
    price: 2095,
    salePrice: 999,
    image: '/images/products/pedego-interceptor.jpg',
    shortDescription: 'The original Pedego! Comfortable cruising at its best. Top speed 20 MPH, range up to 53 miles.',
    brand: 'Pedego',
    isFeatured: true,
    rating: 4.8,
    specs: { topSpeed: '20 MPH', range: '53 miles', payload: '250 lb' }
  },
  // Low Step Category
  {
    id: 4,
    slug: 'pedego-boomerang',
    name: 'Pedego Boomerang',
    category: 'low-step',
    price: 2495,
    salePrice: null,
    image: '/images/products/pedego-boomerang.jpg',
    shortDescription: 'Step-through design for easy on/off. Top speed 20/28 MPH, range up to 75 miles.',
    brand: 'Pedego',
    isFeatured: true,
    rating: 4.9,
    specs: { topSpeed: '20/28 MPH', range: '75 miles', payload: '250 lb' }
  },
  {
    id: 5,
    slug: 'pedego-boomerang-platinum',
    name: 'Pedego Boomerang: Platinum Edition',
    category: 'low-step',
    price: 3049,
    salePrice: null,
    image: '/images/products/pedego-boomerang.jpg',
    shortDescription: 'Premium step-through with upgraded features. Top speed 20/28 MPH, range up to 75 miles.',
    brand: 'Pedego',
    isFeatured: false,
    rating: 4.9,
    specs: { topSpeed: '20/28 MPH', range: '75 miles', payload: '250 lb' }
  },
  // Commuter Category
  {
    id: 6,
    slug: 'pedego-avenue',
    name: 'Pedego Avenue',
    category: 'commuter',
    price: 1999,
    salePrice: null,
    image: '/images/products/pedego-avenue.jpg',
    shortDescription: 'Perfect city commuter. Top speed 20 MPH, range up to 56 miles.',
    brand: 'Pedego',
    isFeatured: true,
    rating: 4.8,
    specs: { topSpeed: '20 MPH', range: '56 miles', payload: '250 lb' }
  },
  {
    id: 7,
    slug: 'pedego-city-commuter',
    name: 'Pedego City Commuter',
    category: 'commuter',
    price: 1795,
    salePrice: 1299,
    image: '/images/products/pedego-city-commuter.jpg',
    shortDescription: 'Urban commuting made easy. Top speed up to 28 MPH, range up to 75 miles.',
    brand: 'Pedego',
    isFeatured: true,
    rating: 4.8,
    specs: { topSpeed: '28 MPH', range: '75 miles', payload: '250 lb' }
  },
  {
    id: 8,
    slug: 'pedego-city-commuter-platinum',
    name: 'Pedego City Commuter: Platinum Edition',
    category: 'commuter',
    price: 2895,
    salePrice: null,
    image: '/images/products/pedego-city-commuter.jpg',
    shortDescription: 'Premium commuter with all the extras. Top speed up to 28 MPH, range up to 75 miles.',
    brand: 'Pedego',
    isFeatured: false,
    rating: 4.9,
    specs: { topSpeed: '28 MPH', range: '75 miles', payload: '250 lb' }
  },
  // Adventure Category
  {
    id: 9,
    slug: 'pedego-moto',
    name: 'Pedego Moto',
    category: 'adventure',
    price: 3995,
    salePrice: null,
    image: '/images/products/pedego-moto.jpg',
    shortDescription: 'NEW! Adventure-ready with 400 lb payload. Top speed up to 28 MPH, range up to 75 miles.',
    brand: 'Pedego',
    isFeatured: true,
    rating: 4.9,
    specs: { topSpeed: '28 MPH', range: '75 miles', payload: '400 lb' }
  },
  // Cargo Category
  {
    id: 10,
    slug: 'pedego-cargo',
    name: 'Pedego Cargo',
    category: 'cargo',
    price: 3895,
    salePrice: 3495,
    image: '/images/products/pedego-cargo.jpg',
    shortDescription: 'Haul it all! Extended range up to 132 miles with optional battery. Top speed 20/28 MPH.',
    brand: 'Pedego',
    isFeatured: true,
    rating: 4.9,
    specs: { topSpeed: '20/28 MPH', range: '132 miles', payload: 'Extended' }
  },
  // Fat Tire Category
  {
    id: 11,
    slug: 'pedego-element',
    name: 'Pedego Element',
    category: 'fat-tire',
    price: 1999,
    salePrice: null,
    image: '/images/products/pedego-element.jpg',
    shortDescription: 'Fat-tire fun for any terrain. Top speed 20 MPH, range up to 56 miles.',
    brand: 'Pedego',
    isFeatured: true,
    rating: 4.8,
    specs: { topSpeed: '20 MPH', range: '56 miles', payload: '250 lb' }
  },
  // Trike Category
  {
    id: 12,
    slug: 'pedego-fat-tire-trike',
    name: 'Pedego Fat Tire Trike',
    category: 'trike',
    price: 3295,
    salePrice: null,
    image: '/images/products/pedego-trike.jpg',
    shortDescription: 'NEW! Three-wheel stability with fat tires. Top speed 15 MPH, range up to 75 miles.',
    brand: 'Pedego',
    isFeatured: true,
    rating: 4.9,
    specs: { topSpeed: '15 MPH', range: '75 miles', payload: '325 lb' }
  }
];

export default function Shop() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const categoryParam = params.get('category') || 'all';
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const { addItem } = useCart();

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({
      id: product.id,
      type: 'product',
      name: product.name,
      price: product.salePrice || product.price,
      quantity: 1,
      image: product.image
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={PAGE_SEO.shop.title}
        description={PAGE_SEO.shop.description}
        keywords={PAGE_SEO.shop.keywords}
        canonicalUrl="https://letitridebend.com/shop"
        structuredData={PAGE_SEO.shop.structuredData}
      />
      <Header />
      
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-primary via-primary to-green-700 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full animate-pulse" />
          <div className="absolute bottom-10 right-10 w-24 h-24 border-4 border-yellow-400 rounded-full animate-bounce" />
          <Zap className="absolute top-20 right-20 w-16 h-16 text-yellow-400 animate-pulse" />
        </div>
        <div className="container relative">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-4 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium mb-4">
              <Zap className="w-4 h-4 text-yellow-400" />
              Central Oregon's Only Pedego Dealer
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Shop Pedego Electric Bikes
            </h1>
            <p className="text-xl opacity-90 mb-6">
              America's #1 electric bike brand. Premium quality, exceptional comfort, 
              and industry-leading 5-year warranty. Prices updated to match official Pedego pricing.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:5413063177">
                <Button size="lg" variant="secondary" className="gap-2">
                  <Phone className="w-4 h-4" />
                  Call (541) 306-3177
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Content */}
      <section className="py-12">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-24">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-secondary'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    Need Help Choosing?
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Our experts can help you find the perfect e-bike for your needs.
                  </p>
                  <a href="tel:5413063177">
                    <Button variant="outline" size="sm" className="w-full">
                      Call (541) 306-3177
                    </Button>
                  </a>
                </div>

                <div className="mt-4 p-4 bg-secondary rounded-lg">
                  <h4 className="font-semibold mb-2">Store Hours</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Tue/Wed/Fri: 11AM - 5PM</p>
                    <p>Saturday: 10AM - 4PM</p>
                    <p>Sunday: 11AM - 4PM</p>
                    <p>Mon/Thu: Closed</p>
                  </div>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  Showing {filteredProducts.length} products
                </p>
                <Badge variant="outline" className="gap-1">
                  <Zap className="w-3 h-3" />
                  Winter Sale Active
                </Badge>
              </div>

              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="card-hover overflow-hidden group">
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {product.salePrice && (
                        <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                          SALE
                        </Badge>
                      )}
                      {product.name.includes('NEW') || product.shortDescription.includes('NEW') ? (
                        <Badge className="absolute top-3 right-3 bg-yellow-500 text-black">
                          NEW
                        </Badge>
                      ) : product.isFeatured && !product.salePrice ? (
                        <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
                          Featured
                        </Badge>
                      ) : null}
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">{product.rating}</span>
                      </div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{product.shortDescription}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-baseline gap-2 mb-2">
                        {product.salePrice ? (
                          <>
                            <span className="text-2xl font-bold text-red-500">
                              ${product.salePrice.toLocaleString()}
                            </span>
                            <span className="text-lg text-muted-foreground line-through">
                              ${product.price.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold">
                            ${product.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {product.specs && (
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="px-2 py-1 bg-secondary rounded">{product.specs.topSpeed}</span>
                          <span className="px-2 py-1 bg-secondary rounded">{product.specs.range}</span>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="gap-2">
                      <Link href={`/shop/${product.slug}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      <Button 
                        size="icon"
                        onClick={() => handleAddToCart(product)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Pedego */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Pedego?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              America's #1 selling electric bike brand, known for quality, comfort, and exceptional customer service.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: '5-Year Warranty', desc: 'Industry-leading warranty coverage', icon: '🛡️' },
              { title: 'Made for Comfort', desc: 'Ergonomic design for all-day riding', icon: '🪑' },
              { title: 'Powerful Motors', desc: 'Up to 500W for effortless hills', icon: '⚡' },
              { title: 'Local Support', desc: 'Expert service right here in Bend', icon: '🔧' }
            ].map((item, i) => (
              <Card key={i} className="text-center">
                <CardHeader>
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Info */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">E-Bike Service & Repairs</h2>
            <p className="text-muted-foreground mb-6">
              We service both electric and traditional bicycles. Two complimentary service check-ups 
              on any bike purchased through our shop!
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-background rounded-lg">
                <div className="text-2xl font-bold text-primary">$60-$120</div>
                <div className="text-sm text-muted-foreground">Tune Up</div>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <div className="text-2xl font-bold text-primary">$100/hr</div>
                <div className="text-sm text-muted-foreground">Service Rate</div>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <div className="text-2xl font-bold text-primary">$125-$250</div>
                <div className="text-sm text-muted-foreground">E-Bike Build</div>
              </div>
            </div>
            <a href="tel:5413063177">
              <Button size="lg" className="gap-2">
                <Phone className="w-4 h-4" />
                Call for Service: (541) 306-3177
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
