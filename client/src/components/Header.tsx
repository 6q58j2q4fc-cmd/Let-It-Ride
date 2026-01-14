import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import { 
  Menu, 
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
  LogOut,
  Zap,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const navigation = [
  { name: 'Tours', href: '/tours', icon: Mountain },
  { name: 'Shop', href: '/shop', icon: Store },
  { name: 'Rentals', href: '/rentals', icon: Bike },
  { name: 'Blog', href: '/blog', icon: BookOpen },
  { name: 'About', href: '/about', icon: Users },
  { name: 'Contact', href: '/contact', icon: Mail },
];

// Premium animated logo component
function AnimatedLogo({ size = 'default' }: { size?: 'default' | 'large' }) {
  const isLarge = size === 'large';
  
  return (
    <div className="flex items-center gap-3 group">
      {/* Logo Mark */}
      <div className={`relative ${isLarge ? 'w-16 h-16' : 'w-14 h-14'}`}>
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-green-500 to-primary opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-500" />
        
        {/* Main logo container */}
        <div className={`relative ${isLarge ? 'w-16 h-16' : 'w-14 h-14'} rounded-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300`}>
          {/* Inner circle */}
          <div className={`${isLarge ? 'w-12 h-12' : 'w-10 h-10'} rounded-full bg-white/10 backdrop-blur flex items-center justify-center`}>
            {/* Bike icon */}
            <svg 
              viewBox="0 0 24 24" 
              className={`${isLarge ? 'w-8 h-8' : 'w-7 h-7'} text-white drop-shadow-md`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              {/* Custom e-bike icon */}
              <circle cx="5" cy="17" r="3" />
              <circle cx="19" cy="17" r="3" />
              <path d="M5 17h6l3-8h4" />
              <path d="M11 17l2-5" />
              <path d="M14 9l-1 3" />
              {/* Electric bolt */}
              <path d="M15 4l-2 3h3l-2 3" strokeWidth="2" className="text-yellow-300" stroke="currentColor" />
            </svg>
          </div>
          
          {/* Lightning bolt accent */}
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg animate-pulse">
            <Zap className="w-3.5 h-3.5 text-white fill-white" />
          </div>
        </div>
      </div>
      
      {/* Logo Text */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className={`${isLarge ? 'text-3xl' : 'text-2xl'} font-black tracking-tight`}>
            <span className="text-primary">Let It</span>
            <span className="text-foreground"> Ride</span>
          </span>
          <Sparkles className={`${isLarge ? 'w-5 h-5' : 'w-4 h-4'} text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity`} />
        </div>
        <div className="flex items-center gap-2">
          <span className={`${isLarge ? 'text-sm' : 'text-xs'} font-semibold text-primary/80 tracking-wide uppercase`}>
            Electric Bikes
          </span>
          <span className="w-1 h-1 rounded-full bg-primary/40" />
          <span className={`${isLarge ? 'text-sm' : 'text-xs'} text-muted-foreground`}>
            Bend, OR
          </span>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { getItemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const itemCount = getItemCount();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled 
        ? 'bg-background/95 backdrop-blur-lg shadow-lg border-b border-primary/10' 
        : 'bg-background/80 backdrop-blur-md'
    }`}>
      {/* Premium Top Bar */}
      <div className="bg-gradient-to-r from-primary via-green-600 to-primary text-primary-foreground relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMEwyNSAxMEgyMEwyNSAyMEgyMEwyNSAzMEgyMEwyNSA0MEgxNUwyMCAzMEgxNUwyMCAyMEgxNUwyMCAxMEgxNUwyMCAwWiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=')] animate-pulse" />
        </div>
        
        <div className="container relative flex items-center justify-between py-2.5 text-sm">
          <div className="flex items-center gap-6">
            <a href="tel:5416472331" className="flex items-center gap-2 hover:text-yellow-300 transition-colors group">
              <div className="p-1 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                <Phone className="h-3.5 w-3.5" />
              </div>
              <span className="font-medium">(541) 647-2331</span>
            </a>
            <span className="hidden md:flex items-center gap-2">
              <div className="p-1 rounded-full bg-white/10">
                <MapPin className="h-3.5 w-3.5" />
              </div>
              <span>25 NW Minnesota Ave #6, Bend, OR</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://www.facebook.com/letitridebend" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-yellow-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="hidden sm:inline">Facebook</span>
            </a>
            <a 
              href="https://www.instagram.com/letitridebend" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-yellow-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span className="hidden sm:inline">Instagram</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="container flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/">
          <AnimatedLogo />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button 
                variant={isActive(item.href) ? "default" : "ghost"}
                className={`text-sm font-semibold px-4 transition-all duration-200 ${
                  isActive(item.href) 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'hover:bg-primary/10 hover:text-primary'
                }`}
              >
                <item.icon className="w-4 h-4 mr-1.5 opacity-70" />
                {item.name}
              </Button>
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Premium Book Tour CTA */}
          <Link href="/tours" className="hidden sm:block">
            <Button className="btn-lightning text-sm font-bold px-6 shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 group">
              <Zap className="w-4 h-4 mr-1.5 group-hover:animate-pulse" />
              Book a Tour
              <ChevronDown className="w-4 h-4 ml-1 opacity-50" />
            </Button>
          </Link>

          {/* Cart with badge */}
          <Link href="/cart">
            <Button 
              variant="outline" 
              size="icon" 
              className="relative border-2 hover:border-primary hover:bg-primary/5 transition-all duration-200"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white text-xs flex items-center justify-center font-bold shadow-lg animate-bounce">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>

          {/* User Menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="border-2 hover:border-primary hover:bg-primary/5 transition-all duration-200"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-2 border-b">
                  <p className="text-sm font-semibold">{user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                {user?.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer">
                      <Sparkles className="w-4 h-4 mr-2 text-primary" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                {user?.role === 'affiliate' && (
                  <DropdownMenuItem asChild>
                    <Link href="/affiliate/dashboard" className="cursor-pointer">
                      Affiliate Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => logout()}
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <a href={getLoginUrl()}>
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden sm:flex border-2 font-semibold hover:border-primary hover:bg-primary/5 transition-all duration-200"
              >
                <User className="w-4 h-4 mr-1.5" />
                Sign In
              </Button>
            </a>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon" className="border-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] p-0 bg-background">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="p-6 bg-gradient-to-br from-primary to-green-600">
                  {/* Custom mobile logo with white text */}
                  <div className="flex items-center gap-3">
                    {/* Logo Mark */}
                    <div className="relative w-14 h-14">
                      <div className="absolute inset-0 rounded-full bg-white/20 blur-md" />
                      <div className="relative w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                          <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="5" cy="17" r="3" />
                            <circle cx="19" cy="17" r="3" />
                            <path d="M5 17h6l3-8h4" />
                            <path d="M11 17l2-5" />
                            <path d="M14 9l-1 3" />
                            <path d="M15 4l-2 3h3l-2 3" strokeWidth="2" />
                          </svg>
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                          <Zap className="w-3.5 h-3.5 text-white fill-white" />
                        </div>
                      </div>
                    </div>
                    {/* Logo Text - White for visibility */}
                    <div className="flex flex-col">
                      <span className="text-2xl font-black tracking-tight text-white">
                        Let It Ride
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white/90 tracking-wide uppercase">
                          Electric Bikes
                        </span>
                        <span className="w-1 h-1 rounded-full bg-white/60" />
                        <span className="text-xs text-white/80">
                          Bend, OR
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Mobile Navigation */}
                <div className="flex-1 p-4 space-y-2 overflow-auto">
                  <Link href="/tours" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full btn-lightning justify-center text-base font-bold py-6 mb-4">
                      <Zap className="w-5 h-5 mr-2" />
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
                        variant={isActive(item.href) ? "default" : "ghost"}
                        className={`w-full justify-start text-base py-6 ${
                          isActive(item.href) ? 'bg-primary text-white' : ''
                        }`}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.name}
                      </Button>
                    </Link>
                  ))}
                </div>

                {/* Mobile Footer */}
                <div className="p-4 border-t bg-muted/30">
                  {isAuthenticated ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{user?.name || 'User'}</p>
                          <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                      </div>
                      {user?.role === 'admin' && (
                        <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Admin Panel
                          </Button>
                        </Link>
                      )}
                      <Button 
                        variant="outline" 
                        className="w-full text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <a href={getLoginUrl()}>
                      <Button variant="outline" className="w-full">
                        <User className="w-4 h-4 mr-2" />
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
