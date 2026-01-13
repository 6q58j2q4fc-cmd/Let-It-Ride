import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { X, Gift, Star, Bike, CheckCircle } from 'lucide-react';

export function EmailPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPopup = localStorage.getItem('letitride_popup_seen');
    if (hasSeenPopup) return;

    // Show popup after 5 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate unique coupon code
    const code = 'WELCOME5-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setCouponCode(code);
    setSubmitted(true);
    
    // Mark popup as seen
    localStorage.setItem('letitride_popup_seen', 'true');
    localStorage.setItem('letitride_coupon', code);
    
    toast.success('Welcome! Your coupon code has been generated.');
    setLoading(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('letitride_popup_seen', 'true');
  };

  const copyCode = () => {
    navigator.clipboard.writeText(couponCode);
    toast.success('Coupon code copied!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <button 
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
        
        {!submitted ? (
          <>
            <DialogHeader className="text-center">
              <div className="mx-auto p-3 rounded-full bg-accent/20 w-fit mb-4">
                <Gift className="h-8 w-8 text-accent" />
              </div>
              <DialogTitle className="text-2xl">Get 5% Off Your First E-Bike!</DialogTitle>
              <DialogDescription className="text-base">
                Sign up for our newsletter and receive an exclusive 5% discount on your first e-bike purchase.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <Input 
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-center"
              />
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={loading}>
                {loading ? 'Processing...' : 'Get My 5% Off Coupon'}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-secondary rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-sm">Plus, Win a FREE E-Bike!</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Leave a review on TripAdvisor after your tour and be entered to win a free Pedego e-bike worth $2,995!
              </p>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-4">
              By signing up, you agree to receive marketing emails. Unsubscribe anytime.
            </p>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="mx-auto p-3 rounded-full bg-green-100 w-fit mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-2xl mb-2">You're In!</DialogTitle>
            <DialogDescription className="text-base mb-6">
              Here's your exclusive 5% off coupon code:
            </DialogDescription>
            
            <div 
              onClick={copyCode}
              className="bg-secondary p-4 rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors mb-4"
            >
              <p className="text-2xl font-bold font-mono tracking-wider">{couponCode}</p>
              <p className="text-xs text-muted-foreground mt-1">Click to copy</p>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Use this code at checkout to save 5% on your e-bike purchase!
            </p>

            <div className="p-4 bg-accent/10 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Bike className="h-5 w-5 text-accent" />
                <span className="font-medium">Win a FREE E-Bike!</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Book a tour and leave a TripAdvisor review for a chance to win a Pedego e-bike worth $2,995!
              </p>
            </div>

            <Button onClick={handleClose} className="mt-6 w-full">
              Start Shopping
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
