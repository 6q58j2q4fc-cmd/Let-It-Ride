import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Star, Award, Users, MapPin, Heart, Bike, ChevronRight } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero */}
      <section className="relative py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium mb-4">
              About Let It Ride
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Hello Fun! Miles of Smiles
            </h1>
            <p className="text-xl opacity-90">
              Bend's original e-bike tour company, sharing the joy of electric bikes since 2011.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                Have you seen this place? We love Bend and so will you. This Central Oregon town 
                is rated as a must-see destination with some of the most beautiful landscapes in the world.
              </p>
              <p className="text-muted-foreground mb-4">
                Combine that with Bend's small town feel, the Deschutes River, and a nice little downtown, 
                and there you go – a perfect place for a bike ride!
              </p>
              <p className="text-muted-foreground mb-4">
                At Let It Ride, we believe everyone deserves to experience the joy and freedom of cycling, 
                regardless of fitness level or experience. That's why we fell in love with electric bikes – 
                they make cycling accessible and fun for everyone.
              </p>
              <p className="text-muted-foreground">
                As Bend's premier Pedego dealer, we offer the highest quality electric bikes along with 
                expert-guided tours that showcase the best of our beautiful region.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=500&fit=crop"
                alt="Let It Ride team"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold">10+</div>
                <div className="text-sm">Years in Business</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Star, value: '189+', label: '5-Star Reviews' },
              { icon: Users, value: '10,000+', label: 'Happy Riders' },
              { icon: Bike, value: '50+', label: 'E-Bikes in Fleet' },
              { icon: Award, value: '#1', label: 'Pedego Dealer' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="h-8 w-8 mx-auto text-primary mb-2" />
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Pedego */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why We Choose Pedego</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're proud to be an official Pedego dealer, offering America's #1 electric bike brand.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Premium Quality',
                description: 'Pedego bikes are built with the highest quality components for reliability and comfort.'
              },
              {
                title: '5-Year Warranty',
                description: 'Industry-leading warranty coverage gives you peace of mind with your purchase.'
              },
              {
                title: 'Made for Comfort',
                description: 'Ergonomic design and premium components ensure a comfortable ride every time.'
              }
            ].map((item, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Visit Us</h2>
              <p className="text-muted-foreground mb-6">
                Our shop is located in the heart of downtown Bend, just steps away from the 
                Deschutes River and all the action. Stop by to browse our selection of Pedego 
                e-bikes, book a tour, or just say hello!
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Let It Ride Electric Bikes</p>
                    <p className="text-muted-foreground">25 NW Minnesota Avenue #6</p>
                    <p className="text-muted-foreground">Bend, OR 97701</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-primary" />
                  <p className="text-muted-foreground">Open 7 days a week, 9am - 5pm</p>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <Link href="/contact">
                  <Button>Contact Us</Button>
                </Link>
                <a href="tel:5416472331">
                  <Button variant="outline">Call (541) 647-2331</Button>
                </a>
              </div>
            </div>
            <div className="h-[400px] rounded-xl overflow-hidden bg-muted">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2867.8!2d-121.3134!3d44.0582!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDAzJzI5LjUiTiAxMjHCsDE4JzQ4LjIiVw!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TripAdvisor */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <h2 className="text-3xl font-bold mb-4">189+ 5-Star Reviews</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it – see what our customers have to say on TripAdvisor.
            </p>
          </div>
          <div className="text-center">
            <a 
              href="https://www.tripadvisor.com/Attraction_Review-g51766-d2069561-Reviews-Let_it_Ride_Electric_Bikes_Tours_Rentals-Bend_Central_Oregon_Oregon.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg">
                Read Our Reviews
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-4">Ready for Miles of Smiles?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Book your e-bike adventure today and discover why Bend is the perfect place for a ride!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/tours">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground btn-glow text-lg px-8">
                Book a Tour
              </Button>
            </Link>
            <Link href="/shop">
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8">
                Shop E-Bikes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
