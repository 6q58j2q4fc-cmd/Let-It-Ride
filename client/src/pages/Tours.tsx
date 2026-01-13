import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { trpc } from '@/lib/trpc';
import { Clock, Users, MapPin, Bike, Mountain, Wine, ChevronRight, Star, Check } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const defaultTours = [
  {
    id: 1,
    slug: 'short-and-sweet',
    name: 'Short & Sweet Tour',
    duration: '1.5 hours',
    price: '75.00',
    shortDescription: 'Perfect introduction to Bend! Best bang for the buck.',
    description: 'Do you want to have lots of fun without taking up your whole day? This is the best bang for the buck in Bend! With our top of the line electric bikes, you can breeze along on our guided tour without breaking a sweat. Your guide will share the history of Bend while showing you great local spots with plenty of picture opportunities.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop',
    highlights: ['Local history & stories', 'Photo opportunities', 'Downtown Bend exploration', 'Comfortable pace'],
    included: ['Premium Pedego e-bike', 'Helmet', 'Expert guide', 'Water bottle'],
    maxGuests: 10
  },
  {
    id: 2,
    slug: 'deschutes-river',
    name: 'Deschutes River Tour',
    duration: '2 hours',
    price: '100.00',
    shortDescription: 'Cruise along the beautiful Deschutes River with stunning scenery.',
    description: 'Take a tour of the Deschutes River as it winds through and around the city of Bend, while riding our premium electric bikes. You will find yourself cruising along the river with our guide, enjoying the sights and sounds without breaking a sweat. Enjoy awesome scenery and wildlife, while your guide shares historic stories of Bend and the local area with plenty of opportunities to take pictures and ask questions.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=500&fit=crop',
    highlights: ['Scenic river views', 'Wildlife spotting', 'Historic stories', 'Nature trails'],
    included: ['Premium Pedego e-bike', 'Helmet', 'Expert guide', 'Water bottle', 'Trail snacks'],
    maxGuests: 8
  },
  {
    id: 3,
    slug: 'taste-of-bend',
    name: 'Taste of Bend Tour',
    duration: '2 hours',
    price: '150.00',
    shortDescription: 'Experience Bend\'s famous craft beverage scene!',
    description: 'Are you here to enjoy the best food and drink in the west? We can help. The Taste of Bend Tour offers a guided tasting experience, visiting some of Bend\'s breweries and pubs rooms. For our friends who might not love beer as much as the rest of your tour group, we are happy to mix it up and visit some of Bend\'s cider houses, wine tasting rooms or even a kombucha brewery – there\'s something for everyone!',
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&h=500&fit=crop',
    highlights: ['Craft brewery visits', 'Local tastings included', 'Flexible beverage options', 'Food pairings'],
    included: ['Premium Pedego e-bike', 'Helmet', 'Expert guide', '3 tasting stops', 'Light snacks'],
    maxGuests: 6
  }
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'short-and-sweet': Bike,
  'deschutes-river': Mountain,
  'taste-of-bend': Wine
};

export default function Tours() {
  // In a real app, this would fetch from the API
  const tours = defaultTours;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero */}
      <section className="relative py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium mb-4">
              Guided E-Bike Tours
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore Bend on Two Wheels
            </h1>
            <p className="text-xl opacity-90">
              Experience the best of Bend, Oregon with our expert-guided electric bike tours. 
              No experience needed – just hop on and enjoy the ride!
            </p>
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="py-16">
        <div className="container">
          <div className="space-y-12">
            {tours.map((tour, index) => {
              const Icon = iconMap[tour.slug] || Bike;
              return (
                <Card key={tour.id} className={`overflow-hidden ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className="grid lg:grid-cols-2 gap-0">
                    <div className={`relative h-64 lg:h-auto ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                      <img 
                        src={tour.image} 
                        alt={tour.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="price-tag text-lg">${parseFloat(tour.price).toFixed(0)}/person</span>
                      </div>
                    </div>
                    <div className={`p-8 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-full bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {tour.duration}
                            <span className="mx-2">•</span>
                            <Users className="h-4 w-4" />
                            Max {tour.maxGuests} guests
                          </div>
                        </div>
                      </div>
                      
                      <h2 className="text-2xl font-bold mb-3">{tour.name}</h2>
                      <p className="text-muted-foreground mb-6">{tour.description}</p>
                      
                      <div className="grid sm:grid-cols-2 gap-4 mb-6">
                        <div>
                          <h4 className="font-semibold mb-2">Highlights</h4>
                          <ul className="space-y-1">
                            {(tour.highlights as string[])?.map((item, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-primary" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">What's Included</h4>
                          <ul className="space-y-1">
                            {(tour.included as string[])?.map((item, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-primary" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4">
                        <Link href={`/tours/${tour.slug}`}>
                          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                            Book This Tour
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/tours/${tour.slug}`}>
                          <Button size="lg" variant="outline">
                            Learn More
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Custom Tours CTA */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Looking for Something Special?</h2>
            <p className="text-muted-foreground mb-6">
              We offer custom tours for groups, special occasions, and unique experiences. 
              Contact us to create your perfect Bend adventure!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button size="lg">
                  Request Custom Tour
                </Button>
              </Link>
              <a href="tel:5416472331">
                <Button size="lg" variant="outline">
                  Call (541) 647-2331
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do I need experience riding an e-bike?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No experience needed! Our guides will teach you everything you need to know. 
                  E-bikes are easy to ride and suitable for all skill levels.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What should I wear?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Comfortable clothing and closed-toe shoes are recommended. We provide helmets. 
                  Dress for the weather – layers work great in Bend!
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can children join the tours?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! Children under 16 can ride on tandems, cargo bikes, or in trailers. 
                  Riders must be 16+ to operate an e-bike independently.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What's your cancellation policy?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Full refund for cancellations 24+ hours before your tour. 
                  Weather-related cancellations are always fully refunded.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
