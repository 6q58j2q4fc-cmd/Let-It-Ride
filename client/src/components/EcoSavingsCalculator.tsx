import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Zap, Leaf, DollarSign, Car, TreePine, Droplets, Wind, Battery, TrendingUp, Calculator } from 'lucide-react';

// Auto-updating eco facts
const ecoFacts = [
  { icon: Leaf, fact: "E-bikes produce 21x less CO2 than cars per mile traveled", stat: "21x" },
  { icon: DollarSign, fact: "Average e-bike owner saves $1,200/year on gas and parking", stat: "$1,200" },
  { icon: Car, fact: "Replacing car trips with e-bike rides saves 500 lbs of CO2 annually", stat: "500 lbs" },
  { icon: TreePine, fact: "One e-bike commuter equals planting 15 trees per year", stat: "15 trees" },
  { icon: Droplets, fact: "E-bikes use 1/10th the energy of electric cars per mile", stat: "90% less" },
  { icon: Wind, fact: "E-bike batteries are 95% recyclable, reducing landfill waste", stat: "95%" },
  { icon: Battery, fact: "Charging an e-bike costs about $0.05 per full charge", stat: "$0.05" },
  { icon: Zap, fact: "E-bikes can replace 50% of car trips under 5 miles", stat: "50%" },
  { icon: TrendingUp, fact: "E-bike sales grew 240% in the last 3 years", stat: "240%" },
  { icon: Leaf, fact: "E-bikes reduce traffic congestion by 30% in urban areas", stat: "30%" },
];

// Animated counter component
function AnimatedCounter({ value, prefix = '', suffix = '', duration = 2000 }: { 
  value: number; 
  prefix?: string; 
  suffix?: string;
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(value * easeOut));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);
  
  return (
    <span className="counter-animate">
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}

// Live eco ticker
function EcoTicker() {
  const [currentFact, setCurrentFact] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % ecoFacts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const fact = ecoFacts[currentFact];
  const Icon = fact.icon;
  
  return (
    <div className="bg-gradient-to-r from-primary/10 via-electric/10 to-primary/10 border border-primary/20 rounded-xl p-4 overflow-hidden">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary lightning-icon" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Live Eco Fact</span>
          </div>
          <p className="text-sm md:text-base font-medium text-foreground truncate">
            {fact.fact}
          </p>
        </div>
        <div className="flex-shrink-0 text-2xl font-bold text-electric-gradient text-primary">
          {fact.stat}
        </div>
      </div>
    </div>
  );
}

export function EcoSavingsCalculator() {
  const [milesPerWeek, setMilesPerWeek] = useState(30);
  const [gasPrice, setGasPrice] = useState(4.50);
  const [carMpg, setCarMpg] = useState(25);
  const [showResults, setShowResults] = useState(false);
  
  // Calculations
  const milesPerYear = milesPerWeek * 52;
  const gallonsPerYear = milesPerYear / carMpg;
  const gasSavingsPerYear = gallonsPerYear * gasPrice;
  const co2SavedLbs = milesPerYear * 0.89; // Average car emits 0.89 lbs CO2 per mile
  const treesEquivalent = Math.round(co2SavedLbs / 48); // One tree absorbs ~48 lbs CO2/year
  const yearsToPayoff = 2995 / gasSavingsPerYear; // Average e-bike cost
  const electricityCost = milesPerYear * 0.01; // ~$0.01 per mile for e-bike
  const totalSavings = gasSavingsPerYear - electricityCost;
  
  return (
    <section className="py-16 bg-gradient-to-b from-background via-secondary/30 to-background">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Zap className="w-5 h-5 text-yellow-500 lightning-icon" />
            <span className="text-sm font-semibold text-primary">Green Energy Savings</span>
            <Zap className="w-5 h-5 text-yellow-500 lightning-icon" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-electric-gradient">E-Bikes Pay for Themselves</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how much you can save on gas, reduce your carbon footprint, and help the environment 
            by switching to electric bike transportation.
          </p>
        </div>
        
        {/* Live Eco Ticker */}
        <div className="mb-12">
          <EcoTicker />
        </div>
        
        {/* Calculator Card */}
        <Card className="electric-border max-w-4xl mx-auto overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Calculator className="w-7 h-7" />
              E-Bike Savings Calculator
              <Zap className="w-6 h-6 text-yellow-300 lightning-icon ml-auto" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-6">
                <div>
                  <label className="flex items-center justify-between mb-3">
                    <span className="font-medium">Miles you drive per week</span>
                    <span className="text-2xl font-bold text-primary">{milesPerWeek}</span>
                  </label>
                  <Slider
                    value={[milesPerWeek]}
                    onValueChange={(v) => setMilesPerWeek(v[0])}
                    min={5}
                    max={200}
                    step={5}
                    className="calc-slider"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>5 mi</span>
                    <span>200 mi</span>
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center justify-between mb-3">
                    <span className="font-medium">Gas price per gallon</span>
                    <span className="text-2xl font-bold text-primary">${gasPrice.toFixed(2)}</span>
                  </label>
                  <Slider
                    value={[gasPrice * 100]}
                    onValueChange={(v) => setGasPrice(v[0] / 100)}
                    min={250}
                    max={700}
                    step={10}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>$2.50</span>
                    <span>$7.00</span>
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center justify-between mb-3">
                    <span className="font-medium">Your car's MPG</span>
                    <span className="text-2xl font-bold text-primary">{carMpg}</span>
                  </label>
                  <Slider
                    value={[carMpg]}
                    onValueChange={(v) => setCarMpg(v[0])}
                    min={10}
                    max={50}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>10 mpg</span>
                    <span>50 mpg</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => setShowResults(true)}
                  className="w-full btn-lightning text-lg py-6"
                  size="lg"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Calculate My Savings
                  <Zap className="w-5 h-5 ml-2" />
                </Button>
              </div>
              
              {/* Results Section */}
              <div className={`space-y-4 transition-all duration-500 ${showResults ? 'opacity-100' : 'opacity-50'}`}>
                <div className="eco-stat-card">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-sm text-muted-foreground">Annual Gas Savings</span>
                  </div>
                  <div className="text-3xl font-bold text-green-600">
                    {showResults ? <AnimatedCounter value={Math.round(totalSavings)} prefix="$" /> : '$0'}
                  </div>
                </div>
                
                <div className="eco-stat-card">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Leaf className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-sm text-muted-foreground">CO2 Saved Per Year</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">
                    {showResults ? <AnimatedCounter value={Math.round(co2SavedLbs)} suffix=" lbs" /> : '0 lbs'}
                  </div>
                </div>
                
                <div className="eco-stat-card">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <TreePine className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-sm text-muted-foreground">Trees Equivalent</span>
                  </div>
                  <div className="text-3xl font-bold text-emerald-600">
                    {showResults ? <AnimatedCounter value={treesEquivalent} suffix=" trees" /> : '0 trees'}
                  </div>
                </div>
                
                <div className="eco-stat-card bg-gradient-to-r from-primary/5 to-yellow-500/5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-yellow-600" />
                    </div>
                    <span className="text-sm text-muted-foreground">E-Bike Pays for Itself In</span>
                  </div>
                  <div className="text-3xl font-bold text-yellow-600">
                    {showResults ? (
                      yearsToPayoff < 1 ? 
                        <><AnimatedCounter value={Math.round(yearsToPayoff * 12)} suffix=" months" /></> :
                        <><AnimatedCounter value={Math.round(yearsToPayoff * 10) / 10} suffix=" years" /></>
                    ) : '-- years'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Impact Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {[
            { icon: Zap, value: '0.05', label: 'Cost per charge', prefix: '$' },
            { icon: Battery, value: '40', label: 'Miles per charge', suffix: '+' },
            { icon: Leaf, value: '0', label: 'Emissions', suffix: ' CO2' },
            { icon: Wind, value: '20', label: 'MPH top speed', suffix: '+' },
          ].map((stat, i) => (
            <div key={i} className="eco-stat-card text-center">
              <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary lightning-icon" />
              <div className="text-2xl font-bold text-foreground">
                {stat.prefix}{stat.value}{stat.suffix}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default EcoSavingsCalculator;
