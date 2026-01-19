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
  MapPin, 
  Bike, 
  Mountain, 
  Wine, 
  ChevronRight,
  Award,
  Shield,
  Heart,
  Zap,
  ArrowRight,
  Play,
  Sparkles,
  Quote,
  Users
} from 'lucide-react';

const tours = [
  {
    slug: 'short-and-sweet',
    name: 'Short & Sweet Tour',
    duration: '1.5 hours',
    price: 75,
    description: 'Perfect introduction to Bend! Breeze through town on our guided tour, learn local history, and discover great photo spots.',
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop',
    icon: Bike,
    highlights: ['Local history', 'Photo opportunities', 'Downtown Bend'],
    popular: false
  },
  {
    slug: 'deschutes-river',
    name: 'Deschutes River Tour',
    duration: '2 hours',
    price: 100,
    description: 'Cruise along the beautiful Deschutes River, enjoy stunning scenery and wildlife while your guide shares historic stories.',
    image: 'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=800&h=600&fit=crop',
    icon: Mountain,
    highlights: ['River views', 'Wildlife spotting', 'Scenic trails'],
    popular: true
  },
  {
    slug: 'taste-of-bend',
    name: 'Taste of Bend Tour',
    duration: '2 hours',
    price: 150,
    description: 'Experience Bend\'s famous craft beverage scene! Visit breweries, cider houses, and tasting rooms on this delicious adventure.',
    image: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&h=600&fit=crop',
    icon: Wine,
    highlights: ['Craft breweries', 'Local tastings', 'Food & drink'],
    popular: false
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

// Featured customer testimonials with photos
const testimonials = [
  {
    name: 'Sarah & Tom Johnson',
    location: 'Portland, OR',
    image: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=150&h=150&fit=crop&crop=face',
    quote: 'We bought our Pedego Interceptors from Let It Ride last summer and it completely changed how we explore Bend. The service team is incredible - they\'ve helped us with tune-ups and even installed custom accessories. Best purchase we\'ve ever made!',
    purchaseType: 'Pedego Interceptor (x2)',
    featured: true
  },
  {
    name: 'David Chen',
    location: 'San Francisco, CA',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    quote: 'The Deschutes River Tour was the highlight of our Bend vacation. Our guide Vance was knowledgeable and fun. We\'re already planning our next trip back!',
    purchaseType: 'Deschutes River Tour',
    featured: true
  },
  {
    name: 'The Martinez Family',
    location: 'Bend, OR',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=150&h=150&fit=crop&crop=face',
    quote: 'As locals, we recommend Let It Ride to everyone visiting Bend. The rental bikes are always in perfect condition, and the staff goes above and beyond to make sure you have an amazing experience.',
    purchaseType: 'Regular Rentals',
    featured: true
  },
  {
    name: 'Jennifer Williams',
    location: 'Seattle, WA',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    quote: 'I was nervous about trying an e-bike for the first time, but the team at Let It Ride made me feel completely comfortable. Now I\'m hooked! The Taste of Bend tour was absolutely delicious.',
    purchaseType: 'Taste of Bend Tour',
    featured: false
  },
  {
    name: 'Robert & Linda Thompson',
    location: 'Denver, CO',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    quote: 'We drove down from Denver specifically to buy our Pedego Boomerangs from Let It Ride. The expertise and customer service are unmatched. Worth every mile of the drive!',
    purchaseType: 'Pedego Boomerang (x2)',
    featured: false
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
      
      {/* Premium Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background with parallax effect */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop)'
            }}
          />
          {/* Premium gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-green-800/90 to-primary/85" />
          {/* Animated pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
        </div>
        
        <div className="container relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-white">
              {/* Premium badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6 stagger-item">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold tracking-wide">Bend, Oregon's Premier E-Bike Experience</span>
              </div>
              
              {/* Main headline */}
              <h1 className="heading-display text-5xl md:text-7xl mb-6 stagger-item">
                <span className="flex items-center gap-3 mb-2">
                  <Zap className="w-14 h-14 md:w-20 md:h-20 text-yellow-400 lightning-icon drop-shadow-lg" />
                  <span>Hello Fun!</span>
                </span>
                <span className="block">
                  <span className="text-yellow-400">Miles of Smiles</span>
                </span>
                <span className="block text-white/90">Await</span>
              </h1>
              
              {/* Subheadline */}
              <p className="text-xl md:text-2xl mb-8 text-white/80 leading-relaxed max-w-xl stagger-item">
                Experience the joy, freedom, and fun of electric bikes in beautiful Central Oregon. 
                Guided tours, rentals, and sales of premium Pedego e-bikes.
              </p>
              
              {/* CTA buttons */}
              <div className="flex flex-wrap gap-4 stagger-item">
                <Link href="/tours">
                  <Button size="lg" className="btn-lightning btn-premium text-lg px-8 py-6 group">
                    <Zap className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                    Book a Tour
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 text-lg px-8 py-6 transition-all duration-300"
                  >
                    <Bike className="mr-2 h-5 w-5" />
                    Shop E-Bikes
                  </Button>
                </Link>
              </div>
              
              {/* Trust indicators */}
              <div className="flex items-center gap-6 mt-10 pt-8 border-t border-white/20 stagger-item">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold">189+ Reviews</span>
                </div>
                <div className="h-8 w-px bg-white/30" />
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm font-semibold">#1 Rated in Bend</span>
                </div>
              </div>
            </div>
            
            {/* Right content - Featured tour card */}
            <div className="hidden lg:block stagger-item">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-br from-yellow-400/30 to-primary/30 rounded-3xl blur-2xl" />
                
                {/* Card */}
                <Card className="relative glass-card border-white/20 overflow-hidden hover-lift">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=800&h=600&fit=crop"
                      alt="Deschutes River Tour"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="badge-premium bg-yellow-400/90 text-yellow-900 border-yellow-500">
                        <Sparkles className="w-3 h-3" />
                        Most Popular
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white mb-1">Deschutes River Tour</h3>
                      <div className="flex items-center gap-3 text-white/80 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          2 hours
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          Scenic Trail
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-3xl font-black text-primary">$100</span>
                        <span className="text-muted-foreground ml-1">/person</span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <Link href="/tours/deschutes-river">
                      <Button className="w-full btn-lightning">
                        Book This Tour
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-10 h-14 rounded-full border-2 border-white/40 flex items-start justify-center p-2">
            <div className="w-1.5 h-4 bg-white/60 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Premium Features Bar */}
      <section className="relative py-8 bg-gradient-to-r from-background via-secondary/50 to-background border-y border-primary/10 overflow-hidden">
        <div className="container relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="flex items-center gap-4 p-4 rounded-xl bg-card/50 backdrop-blur hover:bg-card hover:shadow-premium transition-all duration-300 group stagger-item"
              >
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 group-hover:from-primary/30 group-hover:to-primary/10 transition-colors shadow-inner">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-sm flex items-center gap-1.5">
                    {feature.title}
                    {index === 0 && <Zap className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Tours Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl" />
        
        <div className="container relative">
          <div className="text-center mb-16">
            <span className="badge-premium mb-4">
              <Bike className="w-3 h-3" />
              Our Tours
            </span>
            <h2 className="heading-display text-4xl md:text-5xl mb-4">
              Explore Bend on <span className="text-electric-gradient">Two Wheels</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Choose from our curated e-bike tours designed to showcase the best of Bend. 
              No experience needed – just hop on and enjoy the ride!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {tours.map((tour, index) => (
              <Card 
                key={tour.slug} 
                className={`hover-lift overflow-hidden group relative ${tour.popular ? 'ring-2 ring-primary shadow-electric' : ''}`}
              >
                {tour.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="badge-premium bg-primary text-white border-primary">
                      <Sparkles className="w-3 h-3" />
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={tour.image} 
                    alt={tour.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur rounded-full text-primary font-bold shadow-lg">
                      <Zap className="w-4 h-4" />
                      ${tour.price}
                    </span>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Clock className="h-4 w-4" />
                    <span>{tour.duration}</span>
                  </div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <tour.icon className="h-5 w-5 text-primary" />
                    </div>
                    {tour.name}
                  </CardTitle>
                  <CardDescription className="text-base">{tour.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-2">
                    {tour.highlights.map((highlight, i) => (
                      <span key={i} className="text-xs px-3 py-1 bg-secondary rounded-full font-medium">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-4">
                  <Link href={`/tours/${tour.slug}`} className="w-full">
                    <Button className={`w-full ${tour.popular ? 'btn-lightning' : ''}`}>
                      Book Now
                      <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-2 hover:border-primary hover:bg-primary/5">
                <Sparkles className="mr-2 h-4 w-4" />
                Request a Custom Tour
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Green Energy Section */}
      <GreenEnergySection />

      {/* Premium About Section */}
      <section className="py-24 bg-gradient-to-br from-secondary/50 via-background to-secondary/30 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="badge-premium mb-4">
                <Heart className="w-3 h-3" />
                About Let It Ride
              </span>
              <h2 className="heading-display text-4xl md:text-5xl mb-6">
                Bend's Original <span className="text-electric-gradient">E-Bike</span> Tour Company
              </h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                Have you seen this place? We love Bend and so will you. This Central Oregon town 
                is rated as a must-see destination with some of the most beautiful landscapes in the world.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Combine that with Bend's small town feel, the Deschutes River, and a nice little downtown, 
                and there you go – a perfect place for a bike ride! Tour with us and experience the fun 
                and freedom of Pedego Electric Bikes.
              </p>
              
              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-6 bg-card rounded-2xl shadow-premium hover-lift">
                  <div className="text-4xl font-black text-primary mb-1">189+</div>
                  <div className="text-sm text-muted-foreground font-medium">5-Star Reviews</div>
                </div>
                <div className="p-6 bg-card rounded-2xl shadow-premium hover-lift">
                  <div className="text-4xl font-black text-primary mb-1">10+</div>
                  <div className="text-sm text-muted-foreground font-medium">Years in Business</div>
                </div>
              </div>
              
              <Link href="/about">
                <Button size="lg" className="btn-lightning">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="relative">
              {/* Image with decorative elements */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-yellow-400/20 rounded-3xl blur-2xl" />
                <img 
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
                  alt="E-bike tour in Bend"
                  className="relative rounded-3xl shadow-premium-xl w-full"
                />
                {/* Floating badge */}
                <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-primary to-green-600 text-white p-6 rounded-2xl shadow-premium-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-6 w-6" />
                    <div>
                      <div className="font-bold">Downtown Bend, OR</div>
                      <div className="text-sm text-white/80">25 NW Minnesota Ave</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-muted/50 via-background to-muted/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-2xl" />
        
        <div className="container relative">
          <div className="text-center mb-16">
            <span className="badge-premium mb-4">
              <Users className="w-3 h-3" />
              Customer Stories
            </span>
            <h2 className="heading-display text-4xl md:text-5xl mb-4">
              Real Stories from <span className="text-electric-gradient">Happy Riders</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it. Hear from customers who've experienced the joy of e-biking with Let It Ride.
            </p>
          </div>

          {/* Featured Testimonials */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {testimonials.filter(t => t.featured).map((testimonial, index) => (
              <Card key={index} className="relative overflow-hidden hover-lift border-2 border-transparent hover:border-primary/20 bg-card">
                <div className="absolute top-4 right-4 text-primary/10">
                  <Quote className="w-16 h-16" />
                </div>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                    />
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {testimonial.location}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-muted-foreground italic leading-relaxed mb-4">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-2">
                    <Bike className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">{testimonial.purchaseType}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Testimonials Row */}
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.filter(t => !t.featured).map((testimonial, index) => (
              <Card key={index} className="hover-lift border border-border/50 bg-card/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary/10 flex-shrink-0"
                    />
                    <div>
                      <p className="text-muted-foreground italic text-sm leading-relaxed mb-3">
                        "{testimonial.quote}"
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm">{testimonial.name}</p>
                          <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                        </div>
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                          {testimonial.purchaseType}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Reviews Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl" />
        
        <div className="container relative">
          <div className="text-center mb-16">
            <span className="badge-premium mb-4">
              <Star className="w-3 h-3" />
              TripAdvisor Reviews
            </span>
            <h2 className="heading-display text-4xl md:text-5xl mb-4">
              What Our <span className="text-electric-gradient">Riders</span> Say
            </h2>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex -space-x-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-7 w-7 fill-yellow-400 text-yellow-400 drop-shadow" />
                ))}
              </div>
              <span className="text-lg font-bold">189+ Reviews on TripAdvisor</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <Card key={index} className="hover-lift border-2 border-transparent hover:border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-foreground text-base italic leading-relaxed">
                    "{review.text}"
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <div className="font-bold">{review.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="10"/>
                      </svg>
                      {review.source}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <a 
              href="https://www.tripadvisor.com/Attraction_Review-g51766-d2069561-Reviews-Let_it_Ride_Electric_Bikes_Tours_Rentals-Bend_Central_Oregon_Oregon.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="border-2 hover:border-primary hover:bg-primary/5">
                Read All Reviews on TripAdvisor
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Eco Savings Calculator */}
      <EcoSavingsCalculator />

      {/* Premium CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary via-green-600 to-primary relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        
        <div className="container relative text-center text-white">
          <Zap className="w-16 h-16 mx-auto mb-6 text-yellow-400 lightning-icon" />
          <h2 className="heading-display text-4xl md:text-6xl mb-6">
            Ready for Miles of Smiles?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-white/80 max-w-2xl mx-auto">
            Book your e-bike adventure today and discover why Bend is the perfect place for a ride!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/tours">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-10 py-6 font-bold shadow-premium-lg hover:shadow-premium-xl transition-all duration-300">
                <Zap className="mr-2 h-5 w-5" />
                Book a Tour
              </Button>
            </Link>
            <a href="tel:5416472331">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-10 py-6 font-bold">
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
