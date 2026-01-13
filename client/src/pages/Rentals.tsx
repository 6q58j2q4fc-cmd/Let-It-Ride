import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { Clock, Users, MapPin, CheckCircle, Bike, Battery, Shield, Star } from 'lucide-react';

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

const bikeTypes = [
  {
    name: 'Pedego Cruiser',
    image: '/images/pedego-element.jpg',
    description: 'Comfortable upright riding position, perfect for casual rides',
    range: '40+ miles',
    speed: '20 mph',
    best: 'Casual riders, scenic tours'
  },
  {
    name: 'Pedego Ridge Rider',
    image: '/images/ebike-mountain-trail.jpg',
    description: 'Full suspension mountain e-bike for trail adventures',
    range: '35+ miles',
    speed: '20 mph',
    best: 'Trail riding, adventure seekers'
  },
  {
    name: 'Pedego Tandem',
    image: '/images/ebike-lake-tour.jpg',
    description: 'Two-person e-bike for couples and friends',
    range: '30+ miles',
    speed: '20 mph',
    best: 'Couples, families'
  }
];

export default function Rentals() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="container">
          <div className="max-w-3xl text-white">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">E-Bike Rentals</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Rent a Pedego E-Bike
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Experience Bend on a premium Pedego electric bike. Easy to ride, fun for everyone, 
              and the perfect way to explore Central Oregon's beautiful trails and scenery.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Reserve Now
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View Bike Types
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Rent Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Rent an E-Bike?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Electric bikes make exploring Bend accessible and fun for riders of all fitness levels
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center">
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
            
            <Card className="text-center">
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
            
            <Card className="text-center">
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
            
            <Card className="text-center">
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
              <Card key={option.name} className={`relative ${option.popular ? 'border-accent ring-2 ring-accent' : ''}`}>
                {option.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">
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
                  
                  <Button className={`w-full ${option.popular ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : ''}`}>
                    Reserve Now
                  </Button>
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
          
          <div className="grid md:grid-cols-3 gap-8">
            {bikeTypes.map((bike) => (
              <Card key={bike.name} className="overflow-hidden">
                <div className="aspect-video bg-muted">
                  <img 
                    src={bike.image} 
                    alt={bike.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{bike.name}</CardTitle>
                  <CardDescription>{bike.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Range:</span>
                      <p className="font-medium">{bike.range}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Top Speed:</span>
                      <p className="font-medium">{bike.speed}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <span className="text-sm text-muted-foreground">Best for:</span>
                    <p className="font-medium">{bike.best}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16">
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
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p className="text-muted-foreground">
                      25 NW Minnesota Ave #6, Bend, OR 97703<br />
                      Downtown Bend, near the Old Mill District
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 h-fit">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Hours</h3>
                    <p className="text-muted-foreground">
                      Daily: 9:00 AM - 6:00 PM<br />
                      Extended hours available by request
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 h-fit">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Requirements</h3>
                    <p className="text-muted-foreground">
                      Must be 16+ years old<br />
                      Valid ID and credit card required<br />
                      Helmets required (provided free)
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-secondary rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">What's Included</h3>
              <ul className="space-y-3">
                {[
                  'Premium Pedego electric bike',
                  'Safety helmet',
                  'Bike lock',
                  'Trail map of Bend',
                  'Basic riding orientation',
                  'Phone support during rental',
                  'Roadside assistance'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 pt-6 border-t">
                <p className="text-sm text-muted-foreground mb-4">
                  Questions about rentals? We're here to help!
                </p>
                <Button asChild className="w-full">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Ride?</h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Reserve your e-bike today and experience the best way to explore Bend, Oregon. 
            Walk-ins welcome, but reservations guarantee availability.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Reserve Online
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Call (541) 647-2331
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
