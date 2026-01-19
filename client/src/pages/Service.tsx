import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';
import { 
  Wrench, 
  Phone, 
  Clock, 
  CheckCircle, 
  Zap, 
  Shield, 
  Settings, 
  Bike,
  Battery,
  Cog,
  CircleDot,
  Cable,
  Gauge,
  Gift
} from 'lucide-react';

const services = [
  {
    icon: Cog,
    name: 'Basic Tune-Up',
    price: '$60',
    description: 'Essential maintenance to keep your bike running smoothly',
    includes: [
      'Safety inspection',
      'Brake adjustment',
      'Derailleur adjustment',
      'Tire inflation check',
      'Chain lubrication',
      'Bolt tightening'
    ]
  },
  {
    icon: Settings,
    name: 'Standard Tune-Up',
    price: '$90',
    description: 'Comprehensive service for regular riders',
    includes: [
      'Everything in Basic Tune-Up',
      'Wheel truing',
      'Cable adjustment',
      'Headset adjustment',
      'Bottom bracket check',
      'Detailed cleaning'
    ]
  },
  {
    icon: Wrench,
    name: 'Premium Tune-Up',
    price: '$120',
    description: 'Complete overhaul for peak performance',
    includes: [
      'Everything in Standard Tune-Up',
      'Full drivetrain cleaning',
      'Bearing inspection',
      'Cable replacement (if needed)',
      'Brake pad inspection',
      'Complete safety check'
    ]
  },
  {
    icon: Zap,
    name: 'E-Bike Build & Safety Check',
    price: '$125 - $250',
    description: 'Professional assembly and inspection for electric bikes',
    includes: [
      'Complete bike assembly',
      'Electrical system check',
      'Battery connection test',
      'Motor calibration',
      'Display programming',
      'Test ride & adjustment'
    ]
  }
];

const repairs = [
  { name: 'Hourly Labor Rate', price: '$100/hour', note: '+ parts' },
  { name: 'Tire/Tube Replacement', price: '$25 - $45', note: 'per wheel' },
  { name: 'Wheel Truing', price: '$20 - $40', note: 'per wheel' },
  { name: 'Brake Cable Replacement', price: '$25 - $35', note: 'per cable' },
  { name: 'Brake Bleed & Adjustment', price: '$25 - $50', note: 'per side (hydraulic)' },
  { name: 'Derailleur Adjustment', price: '$15 - $25', note: 'front or rear' },
  { name: 'Chain Replacement', price: '$20 - $35', note: 'includes chain' },
  { name: 'Cassette Replacement', price: '$25 - $40', note: '+ parts' },
  { name: 'Bottom Bracket Service', price: '$40 - $60', note: '+ parts if needed' },
  { name: 'Headset Service', price: '$30 - $50', note: '+ parts if needed' },
  { name: 'Flat Repair', price: '$15 - $20', note: 'tube patch or replacement' },
  { name: 'Spoke Replacement', price: '$10 - $20', note: 'per spoke + truing' }
];

const ebikeServices = [
  { name: 'Battery Diagnostic', price: '$50', note: 'health check & report' },
  { name: 'Motor Diagnostic', price: '$75', note: 'performance analysis' },
  { name: 'Controller Replacement', price: '$100+', note: '+ parts' },
  { name: 'Display Replacement/Setup', price: '$50 - $75', note: '+ parts' },
  { name: 'Wiring Repair', price: '$50 - $100', note: 'depends on complexity' },
  { name: 'Firmware Update', price: '$25 - $50', note: 'if available for model' }
];

const serviceSEO = {
  title: "E-Bike Service & Repair | Let It Ride Bend",
  description: "Professional e-bike and bicycle service in Bend, Oregon. Tune-ups from $60, $100/hour labor rate. Free estimates. Central Oregon's only Pedego dealer.",
  keywords: "e-bike repair Bend, electric bike service Oregon, Pedego service, bicycle tune-up Bend, e-bike maintenance",
  structuredData: {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "name": "Let It Ride Electric Bikes - Service Center",
    "description": "Professional e-bike and bicycle service and repair in Bend, Oregon",
    "telephone": "(541) 306-3177",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "25 NW Minnesota Ave #6",
      "addressLocality": "Bend",
      "addressRegion": "OR",
      "postalCode": "97703",
      "addressCountry": "US"
    },
    "priceRange": "$60-$250",
    "openingHours": "Mo-Sa 10:00-18:00"
  }
};

export default function Service() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={serviceSEO.title}
        description={serviceSEO.description}
        keywords={serviceSEO.keywords}
        canonicalUrl="https://letitridebend.com/service"
        structuredData={serviceSEO.structuredData}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary via-primary to-green-700 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full animate-pulse" />
          <div className="absolute bottom-10 right-10 w-24 h-24 border-4 border-yellow-400 rounded-full animate-bounce" />
          <Wrench className="absolute top-20 right-20 w-16 h-16 text-yellow-400 animate-pulse" />
        </div>
        <div className="container relative">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium mb-4">
              <Wrench className="w-4 h-4 text-yellow-400" />
              Central Oregon's Only Pedego Service Center
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              E-Bike Service & Repair
            </h1>
            <p className="text-xl opacity-90 mb-6">
              Expert service for electric and traditional bicycles. Free estimates, 
              professional technicians, and genuine Pedego parts. We want to see you 
              out there on your bike!
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:5413063177">
                <Button size="lg" variant="secondary" className="gap-2">
                  <Phone className="w-4 h-4" />
                  Call (541) 306-3177
                </Button>
              </a>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="gap-2 bg-transparent border-white text-white hover:bg-white/10">
                  <Clock className="w-4 h-4" />
                  Schedule Service
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Banner */}
      <section className="py-6 bg-yellow-400 text-black">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Free Estimates</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Certified Technicians</span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5" />
              <span className="font-medium">2 Free Check-ups with Purchase</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span className="font-medium">Pedego Authorized</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tune-Up Packages */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary">Tune-Up Packages</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Keep Your Bike Running Smoothly
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Regular maintenance extends the life of your bike and ensures safe, enjoyable rides. 
              Choose the package that fits your riding style.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className={`relative overflow-hidden ${index === 2 ? 'border-primary border-2' : ''}`}>
                {index === 2 && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary">{service.price}</div>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Repair Services */}
      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Standard Repairs */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bike className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Bicycle Repairs</h2>
                  <p className="text-muted-foreground">Standard repair services</p>
                </div>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {repairs.map((repair, index) => (
                      <div key={index} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                        <div>
                          <p className="font-medium">{repair.name}</p>
                          {repair.note && (
                            <p className="text-sm text-muted-foreground">{repair.note}</p>
                          )}
                        </div>
                        <span className="font-semibold text-primary">{repair.price}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* E-Bike Specific */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center">
                  <Battery className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">E-Bike Services</h2>
                  <p className="text-muted-foreground">Electric bike specific repairs</p>
                </div>
              </div>
              
              <Card className="border-yellow-400/50">
                <CardContent className="p-0">
                  <div className="divide-y">
                    {ebikeServices.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                        <div>
                          <p className="font-medium">{service.name}</p>
                          {service.note && (
                            <p className="text-sm text-muted-foreground">{service.note}</p>
                          )}
                        </div>
                        <span className="font-semibold text-yellow-600">{service.price}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Labor Rate Card */}
              <Card className="mt-6 bg-gradient-to-br from-primary to-green-700 text-primary-foreground">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Hourly Labor Rate</h3>
                      <p className="opacity-90 text-sm">For repairs not listed above</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">$100</div>
                      <div className="text-sm opacity-90">per hour + parts</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Purchase Benefit */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-yellow-50 dark:from-green-950/20 dark:to-yellow-950/20">
        <div className="container">
          <Card className="max-w-3xl mx-auto border-2 border-primary/20 overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8 flex flex-col justify-center">
                <Badge className="w-fit mb-4 bg-primary text-primary-foreground">Exclusive Benefit</Badge>
                <h3 className="text-2xl font-bold mb-3">
                  Buy a Bike, Get 2 Free Service Check-ups
                </h3>
                <p className="text-muted-foreground mb-6">
                  Every bike purchased from Let It Ride includes two complimentary service 
                  check-ups. We're committed to keeping you riding safely and happily.
                </p>
                <Link href="/shop">
                  <Button className="w-fit gap-2">
                    <Bike className="w-4 h-4" />
                    Shop E-Bikes
                  </Button>
                </Link>
              </div>
              <div className="bg-gradient-to-br from-primary to-green-700 p-8 flex items-center justify-center">
                <div className="text-center text-white">
                  <Gift className="w-16 h-16 mx-auto mb-4 opacity-90" />
                  <div className="text-5xl font-bold mb-2">2</div>
                  <div className="text-lg">Free Check-ups</div>
                  <div className="text-sm opacity-80">with every purchase</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Schedule Service?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Give us a call or stop by the shop. We offer free estimates and 
            fast turnaround times to get you back on the road.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:5413063177">
              <Button size="lg" className="gap-2">
                <Phone className="w-4 h-4" />
                Call (541) 306-3177
              </Button>
            </a>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="gap-2">
                <Clock className="w-4 h-4" />
                Visit Our Shop
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            <strong>Hours:</strong> Monday - Saturday: 10am - 6pm | Sunday: Closed
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
