import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/_core/hooks/useAuth';
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
  Sparkles,
  Wrench,
  Camera,
  X
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
  { name: 'Rentals', href: '/rentals', icon: Bike },
  { name: 'Service', href: '/service', icon: Wrench },
  { name: 'Blog', href: '/blog', icon: BookOpen },
  { name: 'About', href: '/about', icon: Users },
  { name: 'Contact', href: '/contact', icon: Mail },
];

function Logo() {
  return (
    <div className="flex items-center gap-3 group">
      {/* Logo icon */}
      <div className="relative w-11 h-11 flex-shrink-0">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-green-700 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="5" cy="17" r="3" />
            <circle cx="19" cy="17" r="3" />
            <path d="M5 17h6l3-8h4" />
            <path d="M11 17l2-5" />
            <path d="M15 4l-2 3h3l-2 3" strokeWidth="2.2" stroke="currentColor" className="text-yellow-300" />
          </svg>
        </div>
        {/* Amber dot accent */}
        <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center">
          <Zap className="w-2 h-2 text-amber-900 fill-amber-900" />
        </div>
      </div>

      {/* Logo text */}
      <div className="flex flex-col leading-none">
        <span className="text-xl font-black tracking-tight text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
          Let It <span className="text-primary">Ride</span>
        </span>
        <span className="text-[11px] font-bold tracking-widest uppercase electric-text-visible mt-0.5">
          Electric Bikes
        </span>
        <span className="text-[9px] text-muted-foreground tracking-wide mt-0.5">
          Bend, Oregon
        </span>
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
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
        ? 'bg-white/97 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.08)] border-b border-border'
        : 'bg-white/90 backdrop-blur-md'
    }`}>
      {/* Slim top bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container flex items-center justify-between py-2 text-xs font-medium">
          <div className="flex items-center gap-5">
            <a href="tel:5416472331" className="flex items-center gap-1.5 hover:text-amber-300 transition-colors">
              <Phone className="h-3 w-3" />
              <span>(541) 647-2331</span>
            </a>
            <span className="hidden md:flex items-center gap-1.5 opacity-80">
              <MapPin className="h-3 w-3" />
              <span>25 NW Minnesota Ave #6, Bend, OR</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.facebook.com/letitridebend"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-amber-300 transition-colors opacity-90"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="hidden sm:inline">Facebook</span>
            </a>
            <a
              href="https://www.instagram.com/letitridebend"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-amber-300 transition-colors opacity-90"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span className="hidden sm:inline">Instagram</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="container flex items-center justify-between py-3">
        {/* Logo */}
        <Link href="/">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <div className="hidden xl:flex items-center gap-0.5">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href}>
              <button
                className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-primary bg-primary/8'
                    : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                }`}
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                {item.name}
              </button>
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Book Tour CTA */}
          <Link href="/tours" className="hidden sm:block">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-amber-400/30 hover:-translate-y-0.5" style={{ fontFamily: 'Sora, sans-serif' }}>
              <Zap className="w-4 h-4" />
              Book a Tour
            </button>
          </Link>

          {/* Cart */}
          <Link href="/cart">
            <button className="relative p-2.5 rounded-lg hover:bg-muted transition-colors">
              <ShoppingCart className="h-5 w-5 text-foreground/70" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </Link>

          {/* User menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/admin-panel">Admin Panel</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}

          {/* Mobile menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="xl:hidden p-2.5 rounded-lg hover:bg-muted transition-colors">
                <Menu className="h-5 w-5 text-foreground/70" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <div className="flex flex-col h-full">
                {/* Mobile header */}
                <div className="flex items-center justify-between p-5 border-b">
                  <Logo />
                  <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-muted">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Mobile nav links */}
                <nav className="flex-1 p-4 space-y-1">
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        isActive(item.href)
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                      }`}>
                        <item.icon className="h-4.5 w-4.5" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </Link>
                  ))}
                </nav>

                {/* Mobile CTA */}
                <div className="p-4 border-t space-y-3">
                  <Link href="/tours" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold transition-colors" style={{ fontFamily: 'Sora, sans-serif' }}>
                      <Zap className="w-4 h-4" />
                      Book a Tour
                    </button>
                  </Link>
                  <div className="text-center text-sm text-muted-foreground">
                    <a href="tel:5416472331" className="hover:text-primary transition-colors font-medium">
                      (541) 647-2331
                    </a>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
