import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEOHead, PAGE_SEO } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { Clock, Users, MapPin, CheckCircle, Bike, Battery, Shield, Star, Phone, Zap } from 'lucide-react';

// Rental options matching letitridebend.com
const rentalOptions = [
  {
    name: '2-Hour Rental',
    price: 35,
    duration: '2 hours',
    description: 'Perfect for a quick spin around downtown Bend',
    features: ['Helmet included', 'Lock included', 'Trail map provided', 'Basic orientation']
  },
  {
    name: 'Half-Day Rental',
    price: 55,
    duration: '4 hours',
    description: 'Explore the Deschutes River Trail or Old Mill District',
    features: ['Helmet included', 'Lock included', 'Trail map provided', 'Phone mount', 'Water bottle holder'],
    popular: true
  },
  {
    name: 'Full-Day Rental',
    price: 75,
    duration: '8 hours',
    description: 'Maximum adventure time to explore all of Bend',
    features: ['Helmet included', 'Lock included', 'Trail map provided', 'Phone mount', 'Water bottle holder', 'Pannier bags']
  },
  {
    name: 'Multi-Day Rental',
    price: 60,
    priceNote: 'per day',
    duration: '2+ days',
    description: 'Extended rentals for the ultimate Bend experience',
    features: ['All full-day features', 'Discounted daily rate', 'Flexible pickup/return', 'Delivery available']
  }
];

// Bike types matching letitridebend.com rental fleet
const bikeTypes = [
  {
    name: 'StepThru Boomerang Cruiser',
    image: '/pedego-boomerang-red.webp',
    description: 'Easy step-through design, comfortable upright riding position. Our most popular rental!',
    range: '40+ miles',
    speed: '20 mph',
    best: 'All riders, easy on/off',
    color: 'Red'
  },
  {
    name: 'Pedego Tandem',
    image: '/pedego-tandem-red.webp',
    description: 'Two-person electric bike - double the fun! Perfect for couples and friends.',
    range: '30+ miles',
    speed: '20 mph',
    best: 'Couples, families, friends',
    color: 'Red'
  },
  {
    name: 'Pedego Cargo',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663234433834/JAjQFNXBbA5Quy72adLon7/tour-rental-center_ff692e69.webp',
    description: 'Extended cargo area for kids, pets, or gear. Great for family adventures!',
    range: '40+ miles',
    speed: '20 mph',
    best: 'Families with kids, hauling gear',
    color: 'Various'
  },
  {
    name: 'Fat-Tire E-Bike',
    image: '/ebike-rentals-shop.webp',
    description: 'Wide tires for extra stability on trails, sand, and varied terrain.',
    range: '35+ miles',
    speed: '20 mph',
    best: 'Trail riding, adventure seekers',
    color: 'Various'
  }
];

// Additional rental add-ons
const addOns = [
  { name: 'Kid Trailer', price: 25, description: 'Tow your little ones safely behind' },
  { name: 'Dog Trailer', price: 25, description: 'Bring your furry friend along' },
  { name: 'Child Seat', price: 15, description: 'Mounted seat for small children' },
  { name: 'Extra Battery', price: 20, description: 'Double your range for long adventures' }
];

export default function Rentals() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title={PAGE_SEO.rentals.title}
        description={PAGE_SEO.rentals.description}
        keywords={PAGE_SEO.rentals.keywords}
        canonicalUrl="https://letitridebend.com/rentals"
        structuredData={PAGE_SEO.rentals.structuredData}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary via-primary to-green-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Zap className="absolute top-10 right-20 w-24 h-24 text-yellow-400 animate-pulse" />
          <Zap className="absolute bottom-20 left-10 w-16 h-16 text-yellow-400 animate-bounce" />
        </div>
        <div className="container relative">
          <div className="max-w-3xl text-white">
            <Badge className="mb-4 bg-yellow-400/20 text-yellow-300 hover:bg-yellow-400/30 border-yellow-400/50">
              <Zap className="w-3 h-3 mr-1" />
              E-Bike Rentals
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Rent a Pedego E-Bike
            </h1>
            <p className="text-xl text-white/90 mb-6">
              A Pedego electric bike rental is the very best way to experience Bend and beyond! 
              The nearby bike trails are safe and breathtaking. Easy to ride, fun for everyone!
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:5413063177">
                <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black gap-2">
                  <Phone className="w-4 h-4" />
                  Call (541) 306-3177
                </Button>
              </a>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View Bike Types
              </Button>
            </div>
            <p className="mt-4 text-sm text-white/70">
              Rentals Phone: (541) 306-3177 | Store: 25 NW Minnesota Ave #6, Bend
            </p>
          </div>
        </div>
      </section>

      {/* Why Rent Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Rent an E-Bike?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Electric bikes make exploring Bend accessible and fun for riders of all fitness levels
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center border-green-200 dark:border-green-800">
              <CardContent className="pt-6">
                <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                  <Bike className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Easy to Ride</h3>
                <p className="text-sm text-muted-foreground">
                  Pedal-assist makes hills feel flat. Anyone can ride!
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-green-200 dark:border-green-800">
              <CardContent className="pt-6">
                <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                  <Battery className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Long Range</h3>
                <p className="text-sm text-muted-foreground">
                  40+ miles per charge. Explore all day without worry.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-green-200 dark:border-green-800">
              <CardContent className="pt-6">
                <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Safe & Reliable</h3>
                <p className="text-sm text-muted-foreground">
                  Premium Pedego bikes, regularly maintained and inspected.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-green-200 dark:border-green-800">
              <CardContent className="pt-6">
                <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Top Rated</h3>
                <p className="text-sm text-muted-foreground">
                  189+ 5-star reviews on TripAdvisor. Guests love us!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Rental Options */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Rental Options</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the rental duration that fits your adventure
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rentalOptions.map((option) => (
              <Card key={option.name} className={`relative ${option.popular ? 'border-yellow-400 ring-2 ring-yellow-400' : ''}`}>
                {option.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{option.name}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">${option.price}</span>
                    {option.priceNote && (
                      <span className="text-muted-foreground ml-1">/{option.priceNote}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Clock className="h-4 w-4" />
                    <span>{option.duration}</span>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {option.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <a href="tel:5413063177">
                    <Button className={`w-full ${option.popular ? 'bg-yellow-400 hover:bg-yellow-500 text-black' : ''}`}>
                      Reserve Now
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bike Types */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our E-Bike Fleet</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Premium Pedego electric bikes for every type of rider
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bikeTypes.map((bike) => (
              <Card key={bike.name} className="overflow-hidden">
                <div className="aspect-video bg-muted">
                  <img 
                    src={bike.image} 
                    alt={bike.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{bike.name}</CardTitle>
                  <CardDescription className="text-sm">{bike.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">Range:</span>
                      <p className="font-medium">{bike.range}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Speed:</span>
                      <p className="font-medium">{bike.speed}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t">
                    <span className="text-xs text-muted-foreground">Best for:</span>
                    <p className="text-sm font-medium">{bike.best}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Add-Ons */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Rental Add-Ons</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Bring the whole family - we have trailers for kids and dogs!
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {addOns.map((addon) => (
              <Card key={addon.name} className="text-center">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-1">{addon.name}</h3>
                  <p className="text-2xl font-bold text-primary mb-2">+${addon.price}</p>
                  <p className="text-sm text-muted-foreground">{addon.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Rental Information</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 h-fit">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Location</h3>
                    <p className="text-muted-foreground">
                      25 NW Minnesota Avenue #6<br />
                      Bend, OR 97701
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 h-fit">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Hours</h3>
                    <p className="text-muted-foreground">
                      Tue/Wed/Fri: 11AM - 5PM<br />
                      Saturday: 10AM - 4PM<br />
                      Sunday: 11AM - 4PM<br />
                      Mon/Thu: Closed
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 h-fit">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Contact</h3>
                    <p className="text-muted-foreground">
                      Rentals: (541) 306-3177<br />
                      Email: info@pedegobend.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-4">What's Included</h3>
              <ul className="space-y-3">
                {[
                  'Premium Pedego electric bike',
                  'Helmet (required by law)',
                  'Lock for secure parking',
                  'Trail map of Bend',
                  'Basic riding orientation',
                  'Phone holder (half-day+)',
                  'Water bottle holder'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 pt-6 border-t">
                <a href="tel:5413063177">
                  <Button size="lg" className="w-full gap-2">
                    <Phone className="w-4 h-4" />
                    Call to Reserve: (541) 306-3177
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Ride?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Call us today to reserve your e-bike and start exploring Bend!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:5413063177">
              <Button size="lg" variant="secondary" className="gap-2">
                <Phone className="w-4 h-4" />
                (541) 306-3177
              </Button>
            </a>
            <Link href="/tours">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View Guided Tours
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
