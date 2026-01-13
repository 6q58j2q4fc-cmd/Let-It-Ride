import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { EcoSavingsCalculator } from '@/components/EcoSavingsCalculator';
import { GreenEnergySection } from '@/components/GreenEnergySection';
import { 
  Star, 
  Clock, 
  Users, 
  MapPin, 
  Bike, 
  Mountain, 
  Wine, 
  ChevronRight,
  Play,
  Award,
  Shield,
  Heart,
  Zap,
  Leaf,
  Battery
} from 'lucide-react';

const tours = [
  {
    slug: 'short-and-sweet',
    name: 'Short & Sweet Tour',
    duration: '1.5 hours',
    price: 75,
    description: 'Perfect introduction to Bend! Breeze through town on our guided tour, learn local history, and discover great photo spots.',
    image: '/images/ebike-tour-group.jpg',
    icon: Bike,
    highlights: ['Local history', 'Photo opportunities', 'Downtown Bend']
  },
  {
    slug: 'deschutes-river',
    name: 'Deschutes River Tour',
    duration: '2 hours',
    price: 100,
    description: 'Cruise along the beautiful Deschutes River, enjoy stunning scenery and wildlife while your guide shares historic stories.',
    image: '/images/deschutes-river-trail.jpg',
    icon: Mountain,
    highlights: ['River views', 'Wildlife spotting', 'Scenic trails']
  },
  {
    slug: 'taste-of-bend',
    name: 'Taste of Bend Tour',
    duration: '2 hours',
    price: 150,
    description: 'Experience Bend\'s famous craft beverage scene! Visit breweries, cider houses, and tasting rooms on this delicious adventure.',
    image: '/images/bend-brewery-patio.jpg',
    icon: Wine,
    highlights: ['Craft breweries', 'Local tastings', 'Food & drink']
  }
];

const reviews = [
  {
    name: 'Nunis Adriana',
    rating: 5,
    text: 'Excellent experience in Bend OR! People at Let it Ride Pedego were so friendly and helpful. The e-bikes are awesome, super comfortable and easy to use.',
    source: 'TripAdvisor'
  },
  {
    name: 'Madhuri B',
    rating: 5,
    text: 'Relaxing, Scenic and Thoroughly Enjoyable! Our group took the best of bend tour with Vance as our guide. It was an amazing 2 hours - felt like a real vacation!',
    source: 'TripAdvisor'
  },
  {
    name: 'Michael G',
    rating: 5,
    text: 'Elec. Bike Brewery Tour Can\'t Be Missed! My wife and I spent our anniversary in Bend and had an absolute blast the entire time!',
    source: 'TripAdvisor'
  }
];

const features = [
  {
    icon: Award,
    title: '#1 Pedego Dealer',
    description: 'Official dealer of America\'s #1 electric bike brand'
  },
  {
    icon: Shield,
    title: 'Safe & Easy',
    description: 'Comfortable bikes suitable for all skill levels'
  },
  {
    icon: Heart,
    title: 'Family Friendly',
    description: 'Tandems, trailers, and options for everyone'
  },
  {
    icon: Star,
    title: '189+ 5-Star Reviews',
    description: 'Consistently rated excellent on TripAdvisor'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/images/cascade-mountains.jpg)'
          }}
        >
          <div className="absolute inset-0 hero-gradient" />
        </div>
        
        <div className="container relative z-10 py-20">
          <div className="max-w-2xl text-white">
            <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium mb-4">
              Bend, Oregon's Premier E-Bike Experience
            </span>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <Zap className="inline-block w-12 h-12 text-yellow-400 lightning-icon mr-2" />
              Hello Fun!<br />
              <span className="text-accent">Miles of Smiles</span> Await
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Experience the joy, freedom, and fun of electric bikes in beautiful Central Oregon. 
              Guided tours, rentals, and sales of premium Pedego e-bikes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/tours">
                <Button size="lg" className="btn-lightning text-lg px-8">
                  <Zap className="mr-2 h-5 w-5" />
                  Book a Tour
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/shop">
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur border-white text-white hover:bg-white/20 text-lg px-8">
                  Shop E-Bikes
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Features bar with electric theme */}
      <section className="bg-gradient-to-r from-primary/5 via-secondary to-primary/5 py-8 border-y border-primary/10">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 group">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors electric-glow">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm flex items-center gap-1">
                    {feature.title}
                    {index === 0 && <Zap className="w-3 h-3 text-yellow-500" />}
                  </h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tours Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-primary font-medium">Our Tours</span>
            <h2 className="text-4xl font-bold mt-2 mb-4">Explore Bend on Two Wheels</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our curated e-bike tours designed to showcase the best of Bend. 
              No experience needed – just hop on and enjoy the ride!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <Card key={tour.slug} className="card-hover overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={tour.image} 
                    alt={tour.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="price-tag">${tour.price}</span>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Clock className="h-4 w-4" />
                    {tour.duration}
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    <tour.icon className="h-5 w-5 text-primary" />
                    {tour.name}
                  </CardTitle>
                  <CardDescription>{tour.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tour.highlights.map((highlight, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-secondary rounded-full">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/tours/${tour.slug}`} className="w-full">
                    <Button className="w-full">
                      Book Now
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Request a Custom Tour
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Green Energy Section */}
      <GreenEnergySection />

      {/* About Section */}
      <section className="py-20 bg-secondary">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-medium">About Let It Ride</span>
              <h2 className="text-4xl font-bold mt-2 mb-6">
                Bend's Original E-Bike Tour Company
              </h2>
              <p className="text-muted-foreground mb-4">
                Have you seen this place? We love Bend and so will you. This Central Oregon town 
                is rated as a must-see destination with some of the most beautiful landscapes in the world.
              </p>
              <p className="text-muted-foreground mb-6">
                Combine that with Bend's small town feel, the Deschutes River, and a nice little downtown, 
                and there you go – a perfect place for a bike ride! Tour with us and experience the fun 
                and freedom of Pedego Electric Bikes.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-background rounded-lg">
                  <div className="text-3xl font-bold text-primary">189+</div>
                  <div className="text-sm text-muted-foreground">5-Star Reviews</div>
                </div>
                <div className="p-4 bg-background rounded-lg">
                  <div className="text-3xl font-bold text-primary">10+</div>
                  <div className="text-sm text-muted-foreground">Years in Business</div>
                </div>
              </div>
              <Link href="/about">
                <Button size="lg">
                  Learn More About Us
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img 
                src="/images/ebike-lake-tour.jpg"
                alt="E-bike tour in Bend"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span className="font-semibold">Downtown Bend, OR</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-primary font-medium">Customer Reviews</span>
            <h2 className="text-4xl font-bold mt-2 mb-4">What Our Riders Say</h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 font-semibold">189+ Reviews on TripAdvisor</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <Card key={index} className="card-hover">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-foreground italic">
                    "{review.text}"
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{review.name}</div>
                    <div className="text-sm text-muted-foreground">{review.source}</div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <a 
              href="https://www.tripadvisor.com/Attraction_Review-g51766-d2069561-Reviews-Let_it_Ride_Electric_Bikes_Tours_Rentals-Bend_Central_Oregon_Oregon.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg">
                Read All Reviews on TripAdvisor
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Eco Savings Calculator */}
      <EcoSavingsCalculator />

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Electric background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-primary-foreground rounded-full animate-ping" style={{animationDuration: '3s'}} />
          <div className="absolute bottom-10 right-10 w-32 h-32 border-2 border-primary-foreground rounded-full animate-ping" style={{animationDuration: '4s'}} />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-primary-foreground rounded-full animate-ping" style={{animationDuration: '5s'}} />
        </div>
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Zap className="w-10 h-10 text-yellow-300 lightning-icon" />
            Ready for Miles of Smiles?
            <Zap className="w-10 h-10 text-yellow-300 lightning-icon" />
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Book your e-bike adventure today and discover why Bend is the perfect place for a ride!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/tours">
              <Button size="lg" className="btn-lightning text-lg px-8">
                <Zap className="mr-2 h-5 w-5" />
                Book a Tour
              </Button>
            </Link>
            <a href="tel:5416472331">
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8">
                Call (541) 647-2331
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
