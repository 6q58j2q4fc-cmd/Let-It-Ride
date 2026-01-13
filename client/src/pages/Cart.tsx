import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal, couponCode, setCouponCode, discount, setDiscount } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = getTotal();

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    
    setApplyingCoupon(true);
    // Simulate coupon validation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const code = couponInput.toUpperCase();
    if (code === 'WELCOME5') {
      const discountAmount = subtotal * 0.05;
      setDiscount(discountAmount);
      setCouponCode(code);
      toast.success('Coupon applied! 5% off your order.');
    } else if (code === 'RIDE10') {
      const discountAmount = subtotal * 0.10;
      setDiscount(discountAmount);
      setCouponCode(code);
      toast.success('Coupon applied! 10% off your order.');
    } else {
      toast.error('Invalid coupon code');
    }
    
    setApplyingCoupon(false);
  };

  const removeCoupon = () => {
    setCouponCode(null);
    setDiscount(0);
    setCouponInput('');
    toast.info('Coupon removed');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/tours">
                <Button>Book a Tour</Button>
              </Link>
              <Link href="/shop">
                <Button variant="outline">Shop E-Bikes</Button>
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
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={`${item.type}-${item.id}`}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            {item.type === 'tour' && (
                              <p className="text-sm text-muted-foreground">
                                {item.tourDate} at {item.tourTime} • {item.guests} {item.guests === 1 ? 'guest' : 'guests'}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground capitalize">
                              {item.type === 'tour' ? 'Tour Booking' : 'Product'}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeItem(item.id, item.type)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          {item.type === 'product' ? (
                            <div className="flex items-center border rounded-lg">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm">{item.quantity}</span>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              Qty: {item.quantity}
                            </span>
                          )}
                          <span className="font-semibold">
                            ${(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Coupon */}
                  {!couponCode ? (
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Coupon code"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                      />
                      <Button 
                        variant="outline"
                        onClick={handleApplyCoupon}
                        disabled={applyingCoupon}
                      >
                        Apply
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-primary" />
                        <span className="font-medium">{couponCode}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={removeCoupon}>
                        Remove
                      </Button>
                    </div>
                  )}

                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-primary">
                        <span>Discount</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total</span>
                      <span>${total.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-3">
                  <Link href="/checkout" className="w-full">
                    <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground btn-glow" size="lg">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/shop" className="w-full">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
