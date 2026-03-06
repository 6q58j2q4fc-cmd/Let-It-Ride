import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEOHead, PAGE_SEO } from '@/components/SEOHead';
import { Clock, Users, MapPin, Bike, Mountain, Wine, ChevronRight, Star, Check, Zap, Phone, Sparkles } from 'lucide-react';

const defaultTours = [
  {
    id: 1,
    slug: 'short-and-sweet',
    name: 'Short & Sweet Tour',
    duration: '1.5 hours',
    price: '75.00',
    shortDescription: 'Perfect introduction to Bend! Best bang for the buck.',
    description: 'Do you want to have lots of fun without taking up your whole day? This is the best bang for the buck in Bend! With our top of the line electric bikes, you can breeze along on our guided tour without breaking a sweat. Your guide will share the history of Bend while showing you great local spots with plenty of picture opportunities.',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663234433834/JAjQFNXBbA5Quy72adLon7/tour-rental-center_ff692e69.webp',
    highlights: ['Local history & stories', 'Photo opportunities', 'Downtown Bend exploration', 'Comfortable pace'],
    included: ['Premium Pedego e-bike', 'Helmet', 'Expert guide', 'Water bottle'],
    maxGuests: 10,
    badge: null,
    accentColor: 'bg-emerald-50 border-emerald-200',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700'
  },
  {
    id: 2,
    slug: 'deschutes-river',
    name: 'Deschutes River Tour',
    duration: '2 hours',
    price: '100.00',
    shortDescription: 'Cruise along the beautiful Deschutes River with stunning scenery.',
    description: 'Take a tour of the Deschutes River as it winds through and around the city of Bend, while riding our premium electric bikes. You will find yourself cruising along the river with our guide, enjoying the sights and sounds without breaking a sweat. Enjoy awesome scenery and wildlife, while your guide shares historic stories of Bend and the local area with plenty of opportunities to take pictures and ask questions.',
    image: '/ebike-tours-scenic.webp',
    highlights: ['Scenic river views', 'Wildlife spotting', 'Historic stories', 'Nature trails'],
    included: ['Premium Pedego e-bike', 'Helmet', 'Expert guide', 'Water bottle', 'Trail snacks'],
    maxGuests: 8,
    badge: 'Most Popular',
    accentColor: 'bg-blue-50 border-blue-200',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-700'
  },
  {
    id: 3,
    slug: 'taste-of-bend',
    name: 'Taste of Bend Tour',
    duration: '2 hours',
    price: '150.00',
    shortDescription: 'Experience Bend\'s famous craft beverage scene!',
    description: 'Are you here to enjoy the best food and drink in the west? We can help. The Taste of Bend Tour offers a guided tasting experience, visiting some of Bend\'s breweries and pubs. For our friends who might not love beer, we are happy to mix it up and visit cider houses, wine tasting rooms or even a kombucha brewery — there\'s something for everyone!',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663234433834/JAjQFNXBbA5Quy72adLon7/showroom-rentals_fe018efd.webp',
    highlights: ['Craft brewery visits', 'Local tastings included', 'Flexible beverage options', 'Food pairings'],
    included: ['Premium Pedego e-bike', 'Helmet', 'Expert guide', '3 tasting stops', 'Light snacks'],
    maxGuests: 6,
    badge: 'Fan Favorite',
    accentColor: 'bg-amber-50 border-amber-200',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700'
  }
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'short-and-sweet': Bike,
  'deschutes-river': Mountain,
  'taste-of-bend': Wine
};

const faqs = [
  {
    q: 'Do I need experience riding an e-bike?',
    a: 'No experience needed! Our guides will teach you everything. E-bikes are easy to ride and suitable for all skill levels.'
  },
  {
    q: 'What should I wear?',
    a: 'Comfortable clothing and closed-toe shoes are recommended. We provide helmets. Dress for the weather — layers work great in Bend!'
  },
  {
    q: 'Can children join the tours?',
    a: 'Yes! Children under 16 can ride on tandems, cargo bikes, or in trailers. Riders must be 16+ to operate an e-bike independently.'
  },
  {
    q: 'What\'s your cancellation policy?',
    a: 'Full refund for cancellations 24+ hours before your tour. Weather-related cancellations are always fully refunded.'
  },
];

export default function Tours() {
  const tours = defaultTours;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title={PAGE_SEO.tours.title}
        description={PAGE_SEO.tours.description}
        keywords={PAGE_SEO.tours.keywords}
        canonicalUrl="https://letitridebend.com/tours"
        structuredData={PAGE_SEO.tours.structuredData}
      />
      <Header />

      {/* Hero */}
      <section className="relative py-20 bg-[oklch(0.14_0.03_148)] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '28px 28px'
        }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="container relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-sm font-medium mb-5">
              <Bike className="w-3.5 h-3.5 text-amber-400" />
              Guided E-Bike Tours
            </div>
            <h1 className="heading-display text-4xl md:text-5xl text-white mb-4">
              Explore Bend on<br />
              <span className="text-gradient-amber">Two Wheels</span>
            </h1>
            <p className="text-lg text-white/65 leading-relaxed max-w-xl">
              Experience the best of Bend, Oregon with our expert-guided electric bike tours.
              No experience needed — just hop on and enjoy the ride!
            </p>
          </div>
        </div>
      </section>

      {/* Tours list */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="space-y-14">
            {tours.map((tour, index) => {
              const Icon = iconMap[tour.slug] || Bike;
              const isReversed = index % 2 === 1;
              return (
                <div
                  key={tour.id}
                  className="grid lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-border shadow-[0_4px_24px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.11)] transition-shadow duration-300"
                >
                  {/* Image */}
                  <div className={`relative h-72 lg:h-auto min-h-[320px] ${isReversed ? 'lg:order-2' : ''}`}>
                    <img
                      src={tour.image}
                      alt={tour.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    {/* Price */}
                    <div className="absolute bottom-5 left-5">
                      <span className="price-tag">
                        <Zap className="w-3.5 h-3.5" />
                        ${parseFloat(tour.price).toFixed(0)}/person
                      </span>
                    </div>
                    {/* Badge */}
                    {tour.badge && (
                      <div className="absolute top-5 right-5">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 text-amber-950 text-xs font-bold rounded-full shadow-md">
                          <Sparkles className="w-3 h-3" />
                          {tour.badge}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className={`p-8 lg:p-10 bg-white flex flex-col justify-center ${isReversed ? 'lg:order-1' : ''}`}>
                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {tour.duration}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        Max {tour.maxGuests} guests
                      </span>
                    </div>

                    <h2 className="heading-section text-2xl md:text-3xl text-foreground mb-3">
                      {tour.name}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
                      {tour.description}
                    </p>

                    {/* Highlights & Included */}
                    <div className="grid sm:grid-cols-2 gap-5 mb-7">
                      <div>
                        <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground mb-3">Highlights</h4>
                        <ul className="space-y-2">
                          {(tour.highlights as string[])?.map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                              <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Check className="h-2.5 w-2.5 text-primary" />
                              </div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground mb-3">What's Included</h4>
                        <ul className="space-y-2">
                          {(tour.included as string[])?.map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                              <div className="w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                <Check className="h-2.5 w-2.5 text-amber-700" />
                              </div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link href={`/tours/${tour.slug}`}>
                        <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5" style={{ fontFamily: 'Sora, sans-serif' }}>
                          Book This Tour
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </Link>
                      <Link href={`/tours/${tour.slug}`}>
                        <button className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-border hover:border-primary hover:bg-primary/5 text-foreground font-semibold text-sm transition-all duration-200">
                          Learn More
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Custom Tours CTA */}
      <section className="py-16 section-subtle border-y border-border">
        <div className="container">
          <div className="text-center max-w-xl mx-auto">
            <div className="badge-premium mb-4">
              <Sparkles className="w-3 h-3" />
              Custom Experiences
            </div>
            <h2 className="heading-section text-3xl text-foreground mb-4">
              Looking for Something Special?
            </h2>
            <p className="text-muted-foreground mb-7 leading-relaxed">
              We offer custom tours for groups, special occasions, and unique experiences.
              Contact us to create your perfect Bend adventure!
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/contact">
                <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all duration-200 shadow-md hover:-translate-y-0.5" style={{ fontFamily: 'Sora, sans-serif' }}>
                  Request Custom Tour
                </button>
              </Link>
              <a href="tel:5416472331">
                <button className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-border hover:border-primary hover:bg-primary/5 text-foreground font-semibold text-sm transition-all duration-200">
                  <Phone className="w-4 h-4" />
                  Call (541) 647-2331
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="heading-section text-3xl text-foreground mb-2">
              Frequently Asked Questions
            </h2>
            <div className="section-divider" />
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {faqs.map((faq, i) => (
              <div key={i} className="p-6 bg-secondary rounded-2xl border border-border">
                <h3 className="font-bold text-foreground mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {faq.q}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
