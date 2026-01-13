import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import { toast } from 'sonner';
import { DollarSign, Users, Link2, TrendingUp, ChevronRight, Check, Gift } from 'lucide-react';

export default function Affiliate() {
  const { user, isAuthenticated } = useAuth();
  const [paypalEmail, setPaypalEmail] = useState('');
  const [applying, setApplying] = useState(false);

  const handleApply = async () => {
    if (!paypalEmail) {
      toast.error('Please enter your PayPal email');
      return;
    }
    
    setApplying(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Application submitted! We\'ll review and get back to you within 48 hours.');
    setApplying(false);
  };

  const benefits = [
    { icon: DollarSign, title: '10% Commission', desc: 'Earn 10% on every sale you refer' },
    { icon: Users, title: 'No Limits', desc: 'Unlimited earning potential' },
    { icon: Link2, title: 'Easy Tracking', desc: 'Real-time dashboard and analytics' },
    { icon: Gift, title: 'Bonus Rewards', desc: 'Extra bonuses for top performers' }
  ];

  const howItWorks = [
    { step: 1, title: 'Sign Up', desc: 'Create your free affiliate account' },
    { step: 2, title: 'Get Your Link', desc: 'Receive your unique referral link' },
    { step: 3, title: 'Share & Promote', desc: 'Share with your audience' },
    { step: 4, title: 'Earn Money', desc: 'Get paid for every sale' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero */}
      <section className="relative py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium mb-4">
              Affiliate Program
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Earn Money Sharing the Joy of E-Bikes
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Join our affiliate program and earn 10% commission on every tour booking and e-bike sale you refer.
            </p>
            {isAuthenticated ? (
              <Link href="/affiliate/dashboard">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Go to Dashboard
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Join Now - It's Free
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Join Our Affiliate Program?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Partner with Bend's premier e-bike company and earn generous commissions.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => (
              <Card key={i} className="text-center">
                <CardHeader>
                  <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit mb-2">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{benefit.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Getting started is easy. Follow these simple steps to start earning.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Generous Commission Structure</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">10% on Tour Bookings</p>
                    <p className="text-sm text-muted-foreground">Earn $7.50 - $15 per tour booking</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">10% on E-Bike Sales</p>
                    <p className="text-sm text-muted-foreground">Earn $270 - $550 per e-bike sale</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">30-Day Cookie Duration</p>
                    <p className="text-sm text-muted-foreground">Get credit for sales up to 30 days after click</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Monthly Payouts</p>
                    <p className="text-sm text-muted-foreground">Payments via PayPal on the 1st of each month</p>
                  </div>
                </div>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Earning Example</CardTitle>
                <CardDescription>See how much you could earn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span>5 Tour Bookings @ $100</span>
                  <span className="font-medium">$50</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>1 E-Bike Sale @ $2,995</span>
                  <span className="font-medium">$299.50</span>
                </div>
                <div className="flex justify-between py-2 text-lg font-bold">
                  <span>Monthly Earnings</span>
                  <span className="text-primary">$349.50</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sign Up */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <div className="max-w-xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Join Our Affiliate Program</CardTitle>
                <CardDescription>
                  Sign up now and start earning commissions today
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <p className="text-center text-muted-foreground">
                      You're signed in as {user?.email}. Apply to become an affiliate:
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="paypal">PayPal Email (for payments)</Label>
                      <Input 
                        id="paypal"
                        type="email"
                        placeholder="your@paypal.com"
                        value={paypalEmail}
                        onChange={(e) => setPaypalEmail(e.target.value)}
                      />
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handleApply}
                      disabled={applying}
                    >
                      {applying ? 'Submitting...' : 'Apply Now'}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-muted-foreground">
                      Sign in to apply for our affiliate program
                    </p>
                    <a href={getLoginUrl()}>
                      <Button size="lg" className="w-full">
                        Sign In to Apply
                      </Button>
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { q: 'How do I get paid?', a: 'We pay via PayPal on the 1st of each month for the previous month\'s earnings. Minimum payout is $50.' },
              { q: 'How long do cookies last?', a: 'Our tracking cookies last 30 days, so you\'ll get credit for any purchase made within 30 days of a click.' },
              { q: 'Can I promote on social media?', a: 'Yes! You can share your affiliate link on social media, blogs, YouTube, email newsletters, and more.' },
              { q: 'Is there a cost to join?', a: 'No, our affiliate program is completely free to join. There are no fees or minimum requirements.' }
            ].map((faq, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
