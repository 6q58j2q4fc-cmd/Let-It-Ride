import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'wouter';
import { CheckCircle, Calendar, MapPin, Phone, Mail, Star, Gift } from 'lucide-react';

export default function BookingSuccess() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-16">
        <div className="container max-w-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for booking with Let It Ride Electric Bikes. We can't wait to show you Bend!
            </p>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
              <CardDescription>Here's what you need to know before your tour</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="p-2 rounded-lg bg-primary/10 h-fit">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Check Your Email</h3>
                  <p className="text-sm text-muted-foreground">
                    We've sent a confirmation email with your booking details and receipt.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="p-2 rounded-lg bg-primary/10 h-fit">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Meet Us Here</h3>
                  <p className="text-sm text-muted-foreground">
                    25 NW Minnesota Ave #6, Bend, OR 97703<br />
                    Please arrive 15 minutes before your tour time.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="p-2 rounded-lg bg-primary/10 h-fit">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">What to Bring</h3>
                  <p className="text-sm text-muted-foreground">
                    Comfortable clothes, closed-toe shoes, sunglasses, and sunscreen. 
                    We provide helmets and water bottles.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="p-2 rounded-lg bg-primary/10 h-fit">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Questions?</h3>
                  <p className="text-sm text-muted-foreground">
                    Call us at (541) 647-2331 or email info@letitridebend.com
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* TripAdvisor Review CTA */}
          <Card className="bg-accent/10 border-accent">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-accent/20">
                  <Star className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">Win a FREE E-Bike!</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    After your tour, leave us a review on TripAdvisor and you'll be automatically 
                    entered to win a Pedego e-bike worth $2,995! We'll send you a reminder email 
                    after your tour.
                  </p>
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium">Monthly drawing for all reviewers</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <Button asChild>
              <Link href="/">Return Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/tours">Browse More Tours</Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
