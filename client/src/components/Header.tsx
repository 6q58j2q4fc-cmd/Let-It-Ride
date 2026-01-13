import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import { 
  Menu, 
  X, 
  ShoppingCart, 
  Phone, 
  MapPin,
  Bike,
  Mountain,
  Store,
  BookOpen,
  Users,
  Mail,
  User,
  LogOut
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { name: 'Tours', href: '/tours', icon: Mountain },
  { name: 'Shop', href: '/shop', icon: Store },
  { name: 'Rentals', href: '/shop?category=rental', icon: Bike },
  { name: 'Blog', href: '/blog', icon: BookOpen },
  { name: 'About', href: '/about', icon: Users },
  { name: 'Contact', href: '/contact', icon: Mail },
];

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getItemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const itemCount = getItemCount();

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container flex items-center justify-between py-2 text-sm">
          <div className="flex items-center gap-4">
            <a href="tel:5416472331" className="flex items-center gap-1 hover:underline">
              <Phone className="h-3 w-3" />
              (541) 647-2331
            </a>
            <span className="hidden sm:flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              25 NW Minnesota Ave #6, Bend, OR
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://www.facebook.com/letitridebend" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Facebook
            </a>
            <a 
              href="https://www.instagram.com/letitridebend" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="container flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center">
            <div className="relative">
              <Bike className="h-10 w-10 text-primary" />
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-accent flex items-center justify-center">
                <span className="text-[8px] font-bold text-accent-foreground">E</span>
              </div>
            </div>
            <div className="ml-2">
              <span className="text-xl font-bold text-primary">Let It Ride</span>
              <span className="block text-xs text-muted-foreground">Electric Bikes • Bend, OR</span>
            </div>
          </div>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button 
                variant={isActive(item.href) ? "secondary" : "ghost"}
                className="text-sm font-medium"
              >
                {item.name}
              </Button>
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Book Tour CTA */}
          <Link href="/tours" className="hidden sm:block">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground btn-glow">
              Book a Tour
            </Button>
          </Link>

          {/* Cart */}
          <Link href="/cart">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>

          {/* User menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>
                  <span className="font-medium">{user?.name || user?.email}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {user?.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                {user?.role === 'affiliate' && (
                  <DropdownMenuItem asChild>
                    <Link href="/affiliate/dashboard">Affiliate Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <a href={getLoginUrl()}>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                Sign In
              </Button>
            </a>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col gap-4 mt-8">
                <Link href="/tours" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    Book a Tour
                  </Button>
                </Link>
                
                {navigation.map((item) => (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button 
                      variant={isActive(item.href) ? "secondary" : "ghost"}
                      className="w-full justify-start"
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Button>
                  </Link>
                ))}

                <div className="border-t pt-4 mt-4">
                  {isAuthenticated ? (
                    <>
                      <p className="text-sm text-muted-foreground mb-2">
                        Signed in as {user?.name || user?.email}
                      </p>
                      {user?.role === 'admin' && (
                        <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full mb-2">
                            Admin Panel
                          </Button>
                        </Link>
                      )}
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <a href={getLoginUrl()}>
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
