import { useState } from 'react';
import { useParams, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { ShoppingCart, ArrowLeft, Check, Star, Minus, Plus, Truck, Shield, Phone } from 'lucide-react';

const productsData: Record<string, any> = {
  'pedego-boomerang': {
    id: 1,
    slug: 'pedego-boomerang',
    name: 'Pedego Boomerang',
    category: 'cruiser',
    price: 2995,
    salePrice: null,
    image: '/images/pedego-element.jpg',
    gallery: [
      '/images/pedego-element.jpg',
      '/images/ebike-scenic.jpg'
    ],
    shortDescription: 'Step-through cruiser for easy on/off riding',
    description: 'The Pedego Boomerang is the ultimate step-through electric bike, designed for riders who want easy on-and-off access. Perfect for cruising around town, running errands, or enjoying a leisurely ride along the river. Features a powerful 500W motor, long-range battery, and Pedego\'s signature comfort.',
    brand: 'Pedego',
    features: ['Step-through frame', '500W motor', '48V 10Ah battery', 'Up to 40 miles range', 'Pedal assist & throttle', 'LCD display'],
    specifications: { Motor: '500W hub motor', Battery: '48V 10Ah lithium', Range: 'Up to 40 miles', Speed: 'Up to 20 mph', Weight: '55 lbs', 'Frame Material': 'Aluminum alloy' },
    rating: 4.9,
    stock: 3
  },
  'pedego-interceptor': {
    id: 2,
    slug: 'pedego-interceptor',
    name: 'Pedego Interceptor',
    category: 'cruiser',
    price: 2795,
    salePrice: null,
    image: '/images/ebike-scenic.jpg',
    gallery: [],
    shortDescription: 'Classic cruiser with powerful performance',
    description: 'The Pedego Interceptor is the classic cruiser that started it all. With its timeless design and powerful performance, it\'s perfect for riders who want style and substance. Enjoy effortless riding with the powerful motor and comfortable upright seating position.',
    brand: 'Pedego',
    features: ['Classic cruiser frame', '500W motor', '48V 10Ah battery', 'Up to 40 miles range', 'Pedal assist & throttle', 'LCD display'],
    specifications: { Motor: '500W hub motor', Battery: '48V 10Ah lithium', Range: 'Up to 40 miles', Speed: 'Up to 20 mph', Weight: '57 lbs', 'Frame Material': 'Aluminum alloy' },
    rating: 4.8,
    stock: 5
  },
  'pedego-tandem': {
    id: 3,
    slug: 'pedego-tandem',
    name: 'Pedego Tandem',
    category: 'tandem',
    price: 5495,
    salePrice: 4995,
    image: '/images/ebike-lake-tour.jpg',
    gallery: [],
    shortDescription: 'Double the fun with our tandem e-bike',
    description: 'The Pedego Tandem brings twice the joy to your ride. Perfect for couples, friends, or family members who want to share the e-bike experience together. With a powerful motor and extended frame, you\'ll cruise in comfort and style.',
    brand: 'Pedego',
    features: ['Tandem frame', '500W motor', '48V 15Ah battery', 'Up to 35 miles range', 'Pedal assist & throttle', 'Dual LCD displays'],
    specifications: { Motor: '500W hub motor', Battery: '48V 15Ah lithium', Range: 'Up to 35 miles', Speed: 'Up to 20 mph', Weight: '85 lbs', 'Frame Material': 'Steel alloy' },
    rating: 4.7,
    stock: 1
  },
  'pedego-stretch': {
    id: 4,
    slug: 'pedego-stretch',
    name: 'Pedego Stretch',
    category: 'cargo',
    price: 3995,
    salePrice: null,
    image: '/images/pedego-tour.jpg',
    gallery: [],
    shortDescription: 'Cargo bike perfect for families',
    description: 'The Pedego Stretch is the ultimate family cargo bike. With an extended rear rack that can carry kids, groceries, or gear, it\'s perfect for replacing car trips around town. Powerful motor handles the extra weight with ease.',
    brand: 'Pedego',
    features: ['Extended cargo frame', '500W motor', '52V 13Ah battery', 'Up to 45 miles range', 'Carries up to 400 lbs', 'Child seat compatible'],
    specifications: { Motor: '500W hub motor', Battery: '52V 13Ah lithium', Range: 'Up to 45 miles', Speed: 'Up to 20 mph', Weight: '68 lbs', 'Cargo Capacity': '400 lbs' },
    rating: 4.9,
    stock: 2
  },
  'pedego-ridge-rider': {
    id: 5,
    slug: 'pedego-ridge-rider',
    name: 'Pedego Ridge Rider',
    category: 'mountain',
    price: 3495,
    salePrice: null,
    image: '/images/ebike-mountain-trail.jpg',
    gallery: [],
    shortDescription: 'Conquer any trail with ease',
    description: 'The Pedego Ridge Rider is built for adventure. With full suspension, knobby tires, and a powerful motor, it handles any terrain Central Oregon can throw at it. Perfect for exploring the trails around Bend.',
    brand: 'Pedego',
    features: ['Full suspension', '500W motor', '48V 14Ah battery', 'Up to 50 miles range', 'Hydraulic disc brakes', 'Shimano 9-speed'],
    specifications: { Motor: '500W mid-drive', Battery: '48V 14Ah lithium', Range: 'Up to 50 miles', Speed: 'Up to 20 mph', Weight: '52 lbs', 'Suspension': 'Front & rear' },
    rating: 4.8,
    stock: 4
  },
  'pedego-trail-tracker': {
    id: 6,
    slug: 'pedego-trail-tracker',
    name: 'Pedego Trail Tracker',
    category: 'fat-tire',
    price: 2995,
    salePrice: 2695,
    image: '/images/pedego-element-red.jpg',
    gallery: [],
    shortDescription: 'Fat-tire bike for all terrain adventures',
    description: 'The Pedego Trail Tracker features oversized fat tires that roll over sand, snow, and rough terrain with ease. Perfect for beach cruising, winter riding, or exploring off-road trails around Bend.',
    brand: 'Pedego',
    features: ['4" fat tires', '500W motor', '48V 10Ah battery', 'Up to 40 miles range', 'All-terrain capable', 'Front suspension'],
    specifications: { Motor: '500W hub motor', Battery: '48V 10Ah lithium', Range: 'Up to 40 miles', Speed: 'Up to 20 mph', Weight: '62 lbs', 'Tire Size': '26" x 4"' },
    rating: 4.9,
    stock: 2
  }
};

export default function ProductDetail() {
  const params = useParams<{ slug: string }>();
  const product = productsData[params.slug || ''];
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Link href="/shop">
              <Button>View All Products</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      type: 'product',
      name: product.name,
      price: product.salePrice || product.price,
      quantity,
      image: product.image
    });
    toast.success(`${product.name} added to cart!`);
  };

  const images = [product.image, ...(product.gallery || [])];
  const currentPrice = product.salePrice || product.price;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <section className="py-8">
        <div className="container">
          <Link href="/shop" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4">
                <img 
                  src={images[selectedImage]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.salePrice && (
                  <Badge className="absolute top-4 left-4 bg-destructive text-lg px-4 py-1">
                    Sale
                  </Badge>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === i ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.brand}</Badge>
                <Badge variant="outline">{product.category}</Badge>
              </div>
              
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="text-muted-foreground">({product.rating})</span>
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                {product.salePrice ? (
                  <>
                    <span className="text-4xl font-bold text-destructive">
                      ${product.salePrice.toLocaleString()}
                    </span>
                    <span className="text-2xl text-muted-foreground line-through">
                      ${product.price.toLocaleString()}
                    </span>
                    <Badge className="bg-destructive">
                      Save ${(product.price - product.salePrice).toLocaleString()}
                    </Badge>
                  </>
                ) : (
                  <span className="text-4xl font-bold">
                    ${product.price.toLocaleString()}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground mb-6">{product.description}</p>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border rounded-lg">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.stock} in stock
                </span>
              </div>

              <div className="flex gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground btn-glow"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart - ${(currentPrice * quantity).toLocaleString()}
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-5 w-5 text-primary" />
                  <span>Free Local Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>5-Year Warranty</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>Expert Support</span>
                </div>
              </div>

              {/* Features */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-2 gap-2">
                    {product.features.map((feature: string, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Specifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key}>
                        <dt className="text-sm text-muted-foreground">{key}</dt>
                        <dd className="font-medium">{value as string}</dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
