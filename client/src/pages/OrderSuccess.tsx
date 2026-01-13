import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'wouter';
import { CheckCircle, Package, Truck, Mail, Phone, ShoppingBag } from 'lucide-react';

export default function OrderSuccess() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-16">
        <div className="container max-w-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for your purchase from Let It Ride Electric Bikes.
            </p>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
              <CardDescription>Here's what happens next</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="p-2 rounded-lg bg-primary/10 h-fit">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Confirmation Email</h3>
                  <p className="text-sm text-muted-foreground">
                    We've sent a confirmation email with your order details and receipt.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="p-2 rounded-lg bg-primary/10 h-fit">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Order Processing</h3>
                  <p className="text-sm text-muted-foreground">
                    We're preparing your order now. Most orders ship within 1-2 business days.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="p-2 rounded-lg bg-primary/10 h-fit">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Shipping Updates</h3>
                  <p className="text-sm text-muted-foreground">
                    You'll receive tracking information via email once your order ships.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="p-2 rounded-lg bg-primary/10 h-fit">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Need Help?</h3>
                  <p className="text-sm text-muted-foreground">
                    Call us at (541) 647-2331 or email info@letitridebend.com
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Local Pickup Option */}
          <Card className="bg-secondary">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">Local Pickup Available</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    If you're in the Bend area, you can pick up your order at our shop:
                  </p>
                  <p className="text-sm font-medium">
                    25 NW Minnesota Ave #6, Bend, OR 97703<br />
                    Open Daily: 9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <Button asChild>
              <Link href="/">Return Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
