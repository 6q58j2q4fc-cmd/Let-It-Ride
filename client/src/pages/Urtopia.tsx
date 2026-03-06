import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { 
  Zap, 
  Battery, 
  Smartphone, 
  MapPin, 
  Shield, 
  Feather, 
  Wifi, 
  Mic, 
  Navigation,
  Award,
  ChevronRight,
  Star,
  Check
} from 'lucide-react';

const urtopiaModels = [
  {
    name: 'Carbon 1 Pro',
    image: '/urtopia-carbon-1-pro.webp',
    price: 2799,
    weight: '37 lbs',
    range: '80 miles',
    motor: '350W',
    description: 'The ultimate lightweight gravel e-bike with premium Toray carbon fiber frame. Perfect for commuting and weekend adventures.',
    features: ['Toray® Carbon Fiber Frame', 'Torque Sensor', 'GPS Navigation', 'Voice Control', 'Theft Alert'],
    colors: ['Midnight Grey', 'Lyra White'],
    popular: true
  },
  {
    name: 'Carbon 1 Step-Thru',
    image: '/urtopia-carbon-step-thru.jpg',
    price: 2499,
    weight: '36 lbs',
    range: '75 miles',
    motor: '350W',
    description: 'Easy step-through design meets cutting-edge technology. The perfect blend of accessibility and performance.',
    features: ['Step-Through Frame', 'Smart Display', 'Integrated Lights', 'App Connected', 'Anti-Theft GPS'],
    colors: ['Sky Blue', 'Sirius Grey'],
    popular: false
  },
  {
    name: 'Carbon Classic',
    image: '/urtopia-carbon-classic.jpg',
    price: 1999,
    weight: '38 lbs',
    range: '75 miles',
    motor: '350W',
    description: 'Timeless design with modern technology. The Carbon Classic delivers style and substance in equal measure.',
    features: ['Classic Frame Design', 'Tap-to-Go Throttle', 'Samsung Battery', 'Hydraulic Brakes', 'Puncture-Resistant Tires'],
    colors: ['Matte Black', 'Pearl White'],
    popular: false
  }
];

const smartFeatures = [
  {
    icon: Mic,
    title: 'Voice Control',
    description: 'Control your bike hands-free with built-in voice commands for navigation, calls, and music.'
  },
  {
    icon: Navigation,
    title: 'GPS Navigation',
    description: 'Turn-by-turn navigation displayed right on your handlebars. Never get lost on your ride.'
  },
  {
    icon: Wifi,
    title: '4G Connected',
    description: 'Stay connected with built-in 4G, Bluetooth, and WiFi for real-time updates and tracking.'
  },
  {
    icon: Shield,
    title: 'Theft Protection',
    description: 'GPS tracking and instant alerts if your bike is moved. Peace of mind wherever you park.'
  },
  {
    icon: Smartphone,
    title: 'Smart App',
    description: 'Track rides, customize settings, and monitor your bike\'s health from the Urtopia app.'
  },
  {
    icon: Feather,
    title: 'Ultra-Lightweight',
    description: 'Full carbon fiber construction keeps weight under 40 lbs without sacrificing durability.'
  }
];

export default function Urtopia() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
                Now Available at Let It Ride
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-blue-400">Urtopia</span> E-Bikes
              </h1>
              <p className="text-xl text-slate-300 mb-6 leading-relaxed">
                The world's smartest electric bikes. Featuring full carbon fiber construction, 
                built-in GPS, voice control, and cutting-edge technology that redefines urban mobility.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-slate-300">
                  <Feather className="w-5 h-5 text-blue-400" />
                  <span>Ultra-Lightweight</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Battery className="w-5 h-5 text-blue-400" />
                  <span>80+ Mile Range</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Smartphone className="w-5 h-5 text-blue-400" />
                  <span>Smart Connected</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/shop">
                  <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">
                    <Zap className="mr-2 h-5 w-5" />
                    Shop Urtopia Bikes
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-slate-500 text-white hover:bg-slate-800">
                    Schedule Test Ride
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl" />
              <img 
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663234433834/JAjQFNXBbA5Quy72adLon7/urtopia-lifestyle_b7149a18.jpg" 
                alt="Urtopia Carbon E-Bike"
                className="relative rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Smart Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4">Smart Technology</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Future of E-Bikes</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Urtopia bikes come equipped with AI-powered features that make every ride smarter, safer, and more enjoyable.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {smartFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Models Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4">Our Selection</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Urtopia Models</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our selection of Urtopia carbon fiber e-bikes. Each model combines 
              lightweight design with powerful performance.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {urtopiaModels.map((model, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <img 
                    src={model.image} 
                    alt={model.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {model.popular && (
                    <Badge className="absolute top-4 left-4 bg-blue-500">Most Popular</Badge>
                  )}
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">{model.name}</CardTitle>
                    <span className="text-2xl font-bold text-blue-600">${model.price.toLocaleString()}</span>
                  </div>
                  <CardDescription className="text-base">{model.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
                    <div className="text-center">
                      <Feather className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                      <span className="text-sm font-medium">{model.weight}</span>
                    </div>
                    <div className="text-center">
                      <Battery className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                      <span className="text-sm font-medium">{model.range}</span>
                    </div>
                    <div className="text-center">
                      <Zap className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                      <span className="text-sm font-medium">{model.motor}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    {model.features.slice(0, 4).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {model.colors.map((color, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {color}
                      </Badge>
                    ))}
                  </div>
                  
                  <Link href="/contact">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Inquire About This Model
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Urtopia Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
                Why Choose Urtopia
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Carbon Fiber Excellence
              </h2>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Urtopia uses premium Toray® carbon fiber - the same material used in aerospace 
                and Formula 1 racing. The result is an incredibly light, strong, and responsive 
                e-bike that feels like nothing else on the road.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Award-Winning Design</h3>
                    <p className="text-slate-400 text-sm">Winner of multiple design awards including Red Dot and iF Design Award.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">2-Year Warranty</h3>
                    <p className="text-slate-400 text-sm">Comprehensive warranty coverage with local service support at Let It Ride.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Expert Support</h3>
                    <p className="text-slate-400 text-sm">Our trained technicians provide full service and support for all Urtopia models.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/urtopia-carbon-classic.jpg" 
                alt="Urtopia Carbon Fiber Detail"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience Urtopia?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Visit our showroom in Bend to see and test ride Urtopia e-bikes. 
            Our team will help you find the perfect model for your needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Schedule a Test Ride
              </Button>
            </Link>
            <Link href="/shop">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View All E-Bikes
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-blue-100">
            <MapPin className="w-5 h-5" />
            <span>25 NW Minnesota Avenue #6, Bend, OR 97701</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
