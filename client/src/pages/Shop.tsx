import { useState } from 'react';
import { Link, useSearch } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { ShoppingCart, ChevronRight, Filter, Star } from 'lucide-react';

const categories = [
  { id: 'all', name: 'All E-Bikes' },
  { id: 'cruiser', name: 'Cruisers' },
  { id: 'tandem', name: 'Tandems' },
  { id: 'cargo', name: 'Cargo Bikes' },
  { id: 'mountain', name: 'Mountain Bikes' },
  { id: 'fat-tire', name: 'Fat-Tire Bikes' },
  { id: 'accessory', name: 'Accessories' }
];

const products = [
  {
    id: 1,
    slug: 'pedego-boomerang',
    name: 'Pedego Boomerang',
    category: 'cruiser',
    price: 2995,
    salePrice: null,
    image: '/images/products/pedego-interceptor.jpg',
    shortDescription: 'Step-through cruiser for easy on/off riding',
    brand: 'Pedego',
    isFeatured: true,
    rating: 4.9
  },
  {
    id: 2,
    slug: 'pedego-interceptor',
    name: 'Pedego Interceptor',
    category: 'cruiser',
    price: 2795,
    salePrice: null,
    image: '/images/products/pedego-interceptor.jpg',
    shortDescription: 'Classic cruiser with powerful performance',
    brand: 'Pedego',
    isFeatured: true,
    rating: 4.8
  },
  {
    id: 3,
    slug: 'pedego-tandem',
    name: 'Pedego Tandem',
    category: 'tandem',
    price: 5495,
    salePrice: 4995,
    image: '/images/products/pedego-tandem.jpg',
    shortDescription: 'Double the fun with our tandem e-bike',
    brand: 'Pedego',
    isFeatured: false,
    rating: 4.7
  },
  {
    id: 4,
    slug: 'pedego-stretch',
    name: 'Pedego Stretch',
    category: 'cargo',
    price: 3995,
    salePrice: null,
    image: '/images/products/pedego-stretch.jpg',
    shortDescription: 'Cargo bike perfect for families',
    brand: 'Pedego',
    isFeatured: true,
    rating: 4.9
  },
  {
    id: 5,
    slug: 'pedego-ridge-rider',
    name: 'Pedego Ridge Rider',
    category: 'mountain',
    price: 3495,
    salePrice: null,
    image: '/images/products/pedego-ridge-rider.jpg',
    shortDescription: 'Conquer any trail with ease',
    brand: 'Pedego',
    isFeatured: false,
    rating: 4.8
  },
  {
    id: 6,
    slug: 'pedego-trail-tracker',
    name: 'Pedego Trail Tracker',
    category: 'fat-tire',
    price: 2995,
    salePrice: 2695,
    image: '/images/products/pedego-trail-tracker.jpg',
    shortDescription: 'Fat-tire bike for all terrain adventures',
    brand: 'Pedego',
    isFeatured: true,
    rating: 4.9
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
      <Header />
      
      {/* Hero */}
      <section className="relative py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium mb-4">
              Official Pedego Dealer
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Shop Electric Bikes
            </h1>
            <p className="text-xl opacity-90">
              America's #1 electric bike brand. Premium quality, exceptional comfort, 
              and unmatched customer service.
            </p>
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

                <div className="mt-8 p-4 bg-secondary rounded-lg">
                  <h4 className="font-semibold mb-2">Need Help Choosing?</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Our experts can help you find the perfect e-bike for your needs.
                  </p>
                  <a href="tel:5416472331">
                    <Button variant="outline" size="sm" className="w-full">
                      Call (541) 647-2331
                    </Button>
                  </a>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  Showing {filteredProducts.length} products
                </p>
              </div>

              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="card-hover overflow-hidden group">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {product.salePrice && (
                        <Badge className="absolute top-3 left-3 bg-destructive">
                          Sale
                        </Badge>
                      )}
                      {product.isFeatured && !product.salePrice && (
                        <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
                          Featured
                        </Badge>
                      )}
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
                      <CardDescription>{product.shortDescription}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-baseline gap-2">
                        {product.salePrice ? (
                          <>
                            <span className="text-2xl font-bold text-destructive">
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
      <section className="py-16 bg-secondary">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Pedego?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              America's #1 selling electric bike brand, known for quality, comfort, and exceptional customer service.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: '5-Year Warranty', desc: 'Industry-leading warranty coverage' },
              { title: 'Made for Comfort', desc: 'Ergonomic design for all-day riding' },
              { title: 'Powerful Motors', desc: 'Up to 500W for effortless hills' },
              { title: 'Local Support', desc: 'Expert service right here in Bend' }
            ].map((item, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
