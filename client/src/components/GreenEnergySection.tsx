import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Leaf, Globe, TrendingDown, Sparkles, ArrowRight, Battery, Bike, Sun, Wind } from 'lucide-react';
import { Link } from 'wouter';

// Live updating global impact stats (simulated real-time data)
function LiveImpactCounter() {
  const [stats, setStats] = useState({
    co2Saved: 2847593,
    milesRidden: 15847293,
    treesPlanted: 59324,
    gallonsSaved: 1284739,
  });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        co2Saved: prev.co2Saved + Math.floor(Math.random() * 5),
        milesRidden: prev.milesRidden + Math.floor(Math.random() * 10),
        treesPlanted: prev.treesPlanted + (Math.random() > 0.9 ? 1 : 0),
        gallonsSaved: prev.gallonsSaved + Math.floor(Math.random() * 3),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { icon: Leaf, value: stats.co2Saved, label: 'lbs CO2 Saved', color: 'text-green-500' },
        { icon: Bike, value: stats.milesRidden, label: 'Miles Ridden', color: 'text-blue-500' },
        { icon: Sun, value: stats.treesPlanted, label: 'Trees Equivalent', color: 'text-emerald-500' },
        { icon: TrendingDown, value: stats.gallonsSaved, label: 'Gallons Saved', color: 'text-orange-500' },
      ].map((stat, i) => (
        <div key={i} className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-electric/20 rounded-xl blur-xl group-hover:blur-2xl transition-all opacity-50" />
          <Card className="relative bg-card/80 backdrop-blur border-primary/20 overflow-hidden">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-xl md:text-2xl font-bold text-foreground tabular-nums">
                {stat.value.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
              <div className="absolute top-2 right-2">
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}

// Animated benefit cards
function BenefitCard({ icon: Icon, title, description, stat, delay }: {
  icon: any;
  title: string;
  description: string;
  stat: string;
  delay: number;
}) {
  return (
    <div 
      className="group relative"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-electric/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <Card className="relative h-full bg-card hover:bg-card/90 border-primary/10 hover:border-primary/30 transition-all duration-300 overflow-hidden group-hover:shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Icon className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{description}</p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-semibold text-primary">{stat}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function GreenEnergySection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-electric/10 rounded-full blur-3xl" />
      
      <div className="container relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-electric/20 rounded-full mb-6 electric-glow">
            <Zap className="w-5 h-5 text-yellow-500 lightning-icon" />
            <span className="text-sm font-bold text-primary uppercase tracking-wider">Powered by Clean Energy</span>
            <Zap className="w-5 h-5 text-yellow-500 lightning-icon" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Go Green with </span>
            <span className="text-electric-gradient">Electric Power</span>
            <span className="inline-block ml-2">⚡</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every ride on an e-bike is a step toward a cleaner planet. Join thousands of eco-conscious 
            riders making a real difference in Bend, Oregon and beyond.
          </p>
        </div>
        
        {/* Live Impact Counter */}
        <div className="mb-16">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="w-4 h-4 text-primary" />
              <span>Global E-Bike Impact</span>
              <span className="flex items-center gap-1 text-green-500">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live
              </span>
            </div>
          </div>
          <LiveImpactCounter />
        </div>
        
        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <BenefitCard
            icon={Battery}
            title="Zero Emissions"
            description="E-bikes produce absolutely no direct emissions, making every ride 100% clean and green."
            stat="0 lbs CO2/mile"
            delay={0}
          />
          <BenefitCard
            icon={TrendingDown}
            title="Massive Savings"
            description="Save thousands annually on gas, parking, and maintenance compared to driving."
            stat="$1,200+/year"
            delay={100}
          />
          <BenefitCard
            icon={Sparkles}
            title="Health Benefits"
            description="Get exercise while commuting with pedal-assist that adapts to your fitness level."
            stat="150 cal/hour"
            delay={200}
          />
          <BenefitCard
            icon={Wind}
            title="Beat Traffic"
            description="Zip past gridlock on bike lanes and trails, arriving faster and stress-free."
            stat="2x faster"
            delay={300}
          />
          <BenefitCard
            icon={Sun}
            title="Renewable Ready"
            description="Charge with solar power for a completely carbon-neutral transportation solution."
            stat="100% clean"
            delay={400}
          />
          <BenefitCard
            icon={Leaf}
            title="Planet Positive"
            description="Each mile ridden instead of driven saves nearly 1 lb of CO2 from entering the atmosphere."
            stat="0.89 lbs saved"
            delay={500}
          />
        </div>
        
        {/* CTA Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-3xl" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-30 rounded-3xl" />
          <div className="relative p-8 md:p-12 text-center text-primary-foreground">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-6">
              <Zap className="w-5 h-5 text-yellow-300 lightning-icon" />
              <span className="text-sm font-semibold">Start Your Green Journey Today</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Make a Difference?
            </h3>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Book a tour, rent an e-bike, or purchase your own Pedego and join the electric revolution. 
              Every pedal stroke counts toward a cleaner future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tours">
                <Button size="lg" className="btn-lightning bg-white text-primary hover:bg-white/90 text-lg px-8">
                  <Zap className="w-5 h-5 mr-2" />
                  Book an E-Bike Tour
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/shop">
                <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 text-lg px-8">
                  <Bike className="w-5 h-5 mr-2" />
                  Shop E-Bikes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GreenEnergySection;
