import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

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
  Sparkles,
  Users,
  Phone
} from 'lucide-react';

const tours = [
  {
    slug: 'short-and-sweet',
    name: 'Short & Sweet Tour',
    duration: '1.5 hours',
    price: 75,
    description: 'Perfect introduction to Bend! Breeze through town on our guided tour, learn local history, and discover great photo spots.',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663234433834/JAjQFNXBbA5Quy72adLon7/tour-rental-center_ff692e69.webp',
    icon: Bike,
    highlights: ['Local history', 'Photo ops', 'Downtown Bend'],
    popular: false,
    color: 'from-emerald-500 to-green-600'
  },
  {
    slug: 'deschutes-river',
    name: 'Deschutes River Tour',
    duration: '2 hours',
    price: 100,
    description: 'Cruise along the beautiful Deschutes River, enjoy stunning scenery and wildlife while your guide shares historic stories.',
    image: '/ebike-tours-scenic.webp',
    icon: Mountain,
    highlights: ['River views', 'Wildlife', 'Scenic trails'],
    popular: true,
    color: 'from-blue-500 to-cyan-600'
  },
  {
    slug: 'taste-of-bend',
    name: 'Taste of Bend Tour',
    duration: '2 hours',
    price: 150,
    description: 'Experience Bend\'s famous craft beverage scene! Visit breweries, cider houses, and tasting rooms on this delicious adventure.',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663234433834/JAjQFNXBbA5Quy72adLon7/showroom-rentals_fe018efd.webp',
    icon: Wine,
    highlights: ['Craft breweries', 'Local tastings', 'Food & drink'],
    popular: false,
    color: 'from-amber-500 to-orange-600'
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
    text: 'Relaxing, Scenic and Thoroughly Enjoyable! Our group took the best of bend tour with Vance as our guide. It was an amazing 2 hours — felt like a real vacation!',
    source: 'TripAdvisor'
  },
  {
    name: 'Michael G',
    rating: 5,
    text: 'Elec. Bike Brewery Tour Can\'t Be Missed! My wife and I spent our anniversary in Bend and had an absolute blast the entire time!',
    source: 'TripAdvisor'
  }
];

const testimonials = [
  {
    name: 'Sarah & Tom Johnson',
    location: 'Portland, OR',
    image: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=150&h=150&fit=crop&crop=face',
    quote: 'We bought our Pedego Interceptors from Let It Ride last summer and it completely changed how we explore Bend. The service team is incredible — best purchase we\'ve ever made!',
    tag: 'Pedego Interceptor (x2)',
  },
  {
    name: 'David Chen',
    location: 'San Francisco, CA',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    quote: 'The Deschutes River Tour was the highlight of our Bend vacation. Our guide Vance was knowledgeable and fun. We\'re already planning our next trip back!',
    tag: 'Deschutes River Tour',
  },
  {
    name: 'The Martinez Family',
    location: 'Bend, OR',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=150&h=150&fit=crop&crop=face',
    quote: 'As locals, we recommend Let It Ride to everyone visiting Bend. The rental bikes are always in perfect condition, and the staff goes above and beyond.',
    tag: 'Regular Rentals',
  },
];

const features = [
  { icon: Award, title: '#1 Pedego Dealer', desc: "Official dealer of America's #1 electric bike brand" },
  { icon: Shield, title: 'Safe & Easy', desc: 'Comfortable bikes suitable for all skill levels' },
  { icon: Heart, title: 'Family Friendly', desc: 'Tandems, trailers, and options for everyone' },
  { icon: Star, title: '189+ 5-Star Reviews', desc: 'Consistently rated excellent on TripAdvisor' },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* ============ HERO ============ */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663234433834/JAjQFNXBbA5Quy72adLon7/hero-group-bikes_e0dc8d68.webp"
            alt="E-bike adventures in Bend, Oregon"
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          {/* Layered gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
        </div>

        <div className="container relative z-10 py-24">
          {/* Neon headline */}
          <div className="flex justify-center mb-6">
            <h1 className="hero-headline-premium">
              BEND'S ELECTRIC BIKE<br />SHOP AND TOURS
            </h1>
          </div>

          <div className="max-w-2xl mx-auto text-center">
            <p className="text-lg md:text-xl text-white/75 mb-10 leading-relaxed font-light tracking-wide" style={{ fontFamily: 'Sora, sans-serif' }}>
              Premium guided tours, rentals & sales in the heart of Central Oregon
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/tours">
                <button className="premium-btn-primary group">
                  <span className="flex items-center gap-2">
                    Book a Tour
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              </Link>
              <Link href="/rentals">
                <button className="premium-btn-outline">Rent a Bike</button>
              </Link>
              <Link href="/shop">
                <button className="premium-btn-outline">Shop E-Bikes</button>
              </Link>
            </div>

            {/* Trust bar */}
            <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-white/55 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-medium text-white/80">189+ Reviews</span>
              </div>
              <div className="w-px h-4 bg-white/20 hidden sm:block" />
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>TripAdvisor Excellence</span>
              </div>
              <div className="w-px h-4 bg-white/20 hidden sm:block" />
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-green-400" />
                <span>#1 Pedego Dealer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-scroll-down" />
          </div>
        </div>
      </section>

      {/* ============ FEATURES BAR ============ */}
      <section className="py-10 bg-white border-y border-border">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <div key={i} className="feature-card group">
                <div className="w-10 h-10 rounded-xl bg-primary/8 group-hover:bg-primary/12 flex items-center justify-center mb-3 transition-colors">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="font-bold text-sm text-foreground mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>{f.title}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TOURS ============ */}
      <section className="py-24 section-subtle">
        <div className="container">
          {/* Section header */}
          <div className="text-center mb-14">
            <div className="badge-premium mb-4">
              <Bike className="w-3 h-3" />
              Our Tours
            </div>
            <h2 className="heading-display text-4xl md:text-5xl text-foreground mb-4">
              Explore Bend on <span className="text-gradient-green">Two Wheels</span>
            </h2>
            <div className="section-divider" />
            <p className="text-muted-foreground max-w-xl mx-auto text-base mt-4 leading-relaxed">
              Curated e-bike tours showcasing the best of Bend. No experience needed — just hop on and enjoy the ride.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-7">
            {tours.map((tour) => (
              <div
                key={tour.slug}
                className={`group bg-white rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] ${
                  tour.popular
                    ? 'border-primary shadow-[0_4px_20px_rgba(0,0,0,0.08),0_0_0_2px_oklch(0.42_0.14_148)]'
                    : 'border-border shadow-[0_2px_12px_rgba(0,0,0,0.06)]'
                }`}
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 tour-card-image-overlay" />

                  {/* Price tag */}
                  <div className="absolute bottom-4 left-4">
                    <span className="price-tag">
                      <Zap className="w-3.5 h-3.5" />
                      ${tour.price}
                    </span>
                  </div>

                  {/* Popular badge */}
                  {tour.popular && (
                    <div className="absolute top-4 right-4">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 text-amber-950 text-xs font-bold rounded-full shadow-md">
                        <Sparkles className="w-3 h-3" />
                        Most Popular
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{tour.duration}</span>
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
                    {tour.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{tour.description}</p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {tour.highlights.map((h, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 bg-secondary rounded-full font-medium text-secondary-foreground">
                        {h}
                      </span>
                    ))}
                  </div>

                  <Link href={`/tours/${tour.slug}`}>
                    <button className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                      tour.popular
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md'
                        : 'bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground'
                    }`} style={{ fontFamily: 'Sora, sans-serif' }}>
                      Book Now
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/contact">
              <button className="flex items-center gap-2 mx-auto px-6 py-3 rounded-full border-2 border-border hover:border-primary hover:bg-primary/5 text-sm font-semibold transition-all duration-200">
                <Sparkles className="w-4 h-4 text-primary" />
                Request a Custom Tour
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <div className="badge-premium mb-5">
                <Heart className="w-3 h-3" />
                About Let It Ride
              </div>
              <h2 className="heading-display text-4xl md:text-5xl text-foreground mb-6">
                Bend's Original <span className="text-gradient-green">E-Bike</span> Tour Company
              </h2>
              <p className="text-base text-muted-foreground mb-4 leading-relaxed">
                Have you seen this place? We love Bend and so will you. This Central Oregon town
                is rated as a must-see destination with some of the most beautiful landscapes in the world.
              </p>
              <p className="text-base text-muted-foreground mb-8 leading-relaxed">
                Combine that with Bend's small town feel, the Deschutes River, and a nice little downtown,
                and there you go — a perfect place for a bike ride! Tour with us and experience the fun
                and freedom of Pedego Electric Bikes.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-5 bg-secondary rounded-2xl border border-border">
                  <div className="stat-number">189+</div>
                  <div className="text-sm text-muted-foreground font-medium mt-1">5-Star Reviews</div>
                </div>
                <div className="p-5 bg-secondary rounded-2xl border border-border">
                  <div className="stat-number">10+</div>
                  <div className="text-sm text-muted-foreground font-medium mt-1">Years in Business</div>
                </div>
              </div>

              <Link href="/about">
                <button className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5" style={{ fontFamily: 'Sora, sans-serif' }}>
                  Learn More About Us
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-br from-primary/10 to-amber-400/10 rounded-3xl blur-2xl" />
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
                alt="E-bike tour in Bend"
                className="relative rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] w-full"
              />
              {/* Location badge */}
              <div className="absolute -bottom-5 -left-5 bg-primary text-primary-foreground px-5 py-4 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-sm">Downtown Bend, OR</div>
                    <div className="text-xs text-primary-foreground/70">25 NW Minnesota Ave</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="py-24 section-subtle">
        <div className="container">
          <div className="text-center mb-14">
            <div className="badge-premium mb-4">
              <Users className="w-3 h-3" />
              Customer Stories
            </div>
            <h2 className="heading-display text-4xl md:text-5xl text-foreground mb-4">
              Real Stories from <span className="text-gradient-amber">Happy Riders</span>
            </h2>
            <div className="section-divider" />
          </div>

          <div className="grid lg:grid-cols-3 gap-7">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic">
                  "{t.quote}"
                </p>
                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-border"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>{t.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {t.location}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-primary bg-primary/8 px-2.5 py-1 rounded-full flex-shrink-0">
                    {t.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TRIPADVISOR REVIEWS ============ */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <div className="badge-premium mb-4">
              <Star className="w-3 h-3" />
              TripAdvisor Reviews
            </div>
            <h2 className="heading-display text-4xl md:text-5xl text-foreground mb-4">
              What Our <span className="text-gradient-green">Riders</span> Say
            </h2>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold text-foreground">189+ Reviews on TripAdvisor</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-7">
            {reviews.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border p-6 hover-lift shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(r.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic leading-relaxed mb-5">
                  "{r.text}"
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="font-bold text-sm text-foreground">{r.name}</span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    {r.source}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href="https://www.tripadvisor.com/Attraction_Review-g51766-d2069561-Reviews-Let_it_Ride_Electric_Bikes_Tours_Rentals-Bend_Central_Oregon_Oregon.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="flex items-center gap-2 mx-auto px-6 py-3 rounded-full border-2 border-border hover:border-primary hover:bg-primary/5 text-sm font-semibold transition-all duration-200">
                Read All Reviews on TripAdvisor
                <ChevronRight className="w-4 h-4" />
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="py-24 relative overflow-hidden bg-[oklch(0.14_0.03_148)]">
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
        {/* Glow blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-400/15 rounded-full blur-3xl" />

        <div className="container relative text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 border border-white/15 text-sm font-medium mb-8">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-white/80">Ready to ride?</span>
          </div>
          <h2 className="heading-display text-4xl md:text-6xl text-white mb-6">
            Miles of Smiles<br />Await You
          </h2>
          <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto leading-relaxed">
            Book your e-bike adventure today and discover why Bend is the perfect place for a ride.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/tours">
              <button className="flex items-center gap-2 px-8 py-4 rounded-full bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-base transition-all duration-200 shadow-lg hover:shadow-amber-400/30 hover:-translate-y-0.5" style={{ fontFamily: 'Sora, sans-serif' }}>
                <Zap className="w-5 h-5" />
                Book a Tour
              </button>
            </Link>
            <a href="tel:5416472331">
              <button className="flex items-center gap-2 px-8 py-4 rounded-full border-2 border-white/25 hover:border-white/50 text-white font-semibold text-base transition-all duration-200 hover:bg-white/8 backdrop-blur-sm" style={{ fontFamily: 'Sora, sans-serif' }}>
                <Phone className="w-5 h-5" />
                Call (541) 647-2331
              </button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
