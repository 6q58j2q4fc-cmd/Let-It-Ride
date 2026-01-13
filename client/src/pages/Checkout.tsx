import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { CreditCard, Lock, ArrowLeft, CheckCircle } from 'lucide-react';

export default function Checkout() {
  const [, navigate] = useLocation();
  const { items, getTotal, couponCode, discount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'OR',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    notes: ''
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = getTotal();
  const hasTours = items.some(item => item.type === 'tour');
  const hasProducts = items.some(item => item.type === 'product');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setOrderComplete(true);
    clearCart();
    toast.success('Order placed successfully!');
    
    setLoading(false);
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-6">Add items to your cart to checkout.</p>
            <Link href="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <CheckCircle className="h-16 w-16 mx-auto text-primary mb-4" />
            <h1 className="text-3xl font-bold mb-2">Thank You!</h1>
            <p className="text-muted-foreground mb-6">
              Your order has been placed successfully. You'll receive a confirmation email shortly.
            </p>
            {hasTours && (
              <p className="text-sm text-muted-foreground mb-6">
                For tour bookings, please arrive 15 minutes before your scheduled time at our location.
              </p>
            )}
            <div className="flex gap-4 justify-center">
              <Link href="/">
                <Button>Return Home</Button>
              </Link>
              <Link href="/tours">
                <Button variant="outline">Book Another Tour</Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <section className="py-12">
        <div className="container">
          <Link href="/cart" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Link>

          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input 
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input 
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address (only for products) */}
                {hasProducts && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Shipping Address</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input 
                          id="address"
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                        />
                      </div>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input 
                            id="city"
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input 
                            id="state"
                            value={formData.state}
                            onChange={(e) => setFormData({...formData, state: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zip">ZIP Code</Label>
                          <Input 
                            id="zip"
                            value={formData.zip}
                            onChange={(e) => setFormData({...formData, zip: e.target.value})}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Payment */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input 
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input 
                          id="expiry"
                          placeholder="MM/YY"
                          value={formData.expiry}
                          onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input 
                          id="cvc"
                          placeholder="123"
                          value={formData.cvc}
                          onChange={(e) => setFormData({...formData, cvc: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Lock className="h-4 w-4" />
                      Your payment information is secure and encrypted
                    </div>
                  </CardContent>
                </Card>

                {/* Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Special Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      placeholder="Any special requests or notes for your order..."
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      rows={3}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((item) => (
                      <div key={`${item.type}-${item.id}`} className="flex justify-between text-sm">
                        <div>
                          <span>{item.name}</span>
                          {item.quantity > 1 && <span className="text-muted-foreground"> × {item.quantity}</span>}
                        </div>
                        <span>${(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${subtotal.toLocaleString()}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-primary">
                          <span>Discount ({couponCode})</span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-bold pt-2 border-t">
                        <span>Total</span>
                        <span>${total.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit"
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground btn-glow" 
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : `Pay $${total.toLocaleString()}`}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
