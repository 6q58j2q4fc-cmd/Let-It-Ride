import { Link } from 'wouter';
import { 
  Bike, 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* TripAdvisor banner */}
      <div className="bg-primary/90 border-b border-primary-foreground/20">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="font-semibold">189+ Reviews on TripAdvisor</span>
            </div>
            <a 
              href="https://www.tripadvisor.com/Attraction_Review-g51766-d2069561-Reviews-Let_it_Ride_Electric_Bikes_Tours_Rentals-Bend_Central_Oregon_Oregon.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline hover:no-underline"
            >
              Read Our Reviews →
            </a>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bike className="h-8 w-8" />
              <div>
                <span className="text-lg font-bold">Let It Ride</span>
                <span className="block text-xs opacity-80">Electric Bikes • Bend, OR</span>
              </div>
            </div>
            <p className="text-sm opacity-80 mb-4">
              Experience the joy, freedom, and fun of electric bikes in beautiful Bend, Oregon. 
              Tours, rentals, and sales since 2011.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://www.facebook.com/letitridebend" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/letitridebend" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com/letitridebend" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tours" className="opacity-80 hover:opacity-100 hover:underline">
                  eBike Tours
                </Link>
              </li>
              <li>
                <Link href="/shop" className="opacity-80 hover:opacity-100 hover:underline">
                  Shop eBikes
                </Link>
              </li>
              <li>
                <Link href="/shop?category=rental" className="opacity-80 hover:opacity-100 hover:underline">
                  Rentals
                </Link>
              </li>
              <li>
                <Link href="/blog" className="opacity-80 hover:opacity-100 hover:underline">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="opacity-80 hover:opacity-100 hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="opacity-80 hover:opacity-100 hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/affiliate" className="opacity-80 hover:opacity-100 hover:underline">
                  Affiliate Program
                </Link>
              </li>
            </ul>
          </div>

          {/* Tours */}
          <div>
            <h3 className="font-semibold mb-4">Our Tours</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tours/short-and-sweet" className="opacity-80 hover:opacity-100 hover:underline">
                  Short & Sweet Tour - $75
                </Link>
              </li>
              <li>
                <Link href="/tours/deschutes-river" className="opacity-80 hover:opacity-100 hover:underline">
                  Deschutes River Tour - $100
                </Link>
              </li>
              <li>
                <Link href="/tours/taste-of-bend" className="opacity-80 hover:opacity-100 hover:underline">
                  Taste of Bend Tour - $150
                </Link>
              </li>
              <li>
                <Link href="/contact" className="opacity-80 hover:opacity-100 hover:underline">
                  Custom Tours - Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="opacity-80">
                  25 NW Minnesota Avenue #6<br />
                  Bend, OR 97701
                </span>
              </li>
              <li>
                <a href="tel:5413063177" className="flex items-center gap-2 opacity-80 hover:opacity-100">
                  <Phone className="h-4 w-4" />
                  Rentals: (541) 306-3177
                </a>
              </li>
              <li>
                <a href="tel:5416472331" className="flex items-center gap-2 opacity-80 hover:opacity-100">
                  <Phone className="h-4 w-4" />
                  Tours: (541) 647-2331
                </a>
              </li>
              <li>
  <a href="mailto:info@pedegobend.com" className="flex items-center gap-2 opacity-80 hover:opacity-100">
                  <Mail className="h-4 w-4" />
                  info@pedegobend.com
                </a>
              </li>
            </ul>
            
<div className="mt-4">
              <h4 className="font-medium text-sm mb-2">Hours</h4>
              <p className="text-sm opacity-80">
                Tue/Wed/Fri: 11AM - 5PM<br />
                Sat: 10AM - 4PM<br />
                Sun: 11AM - 4PM<br />
                Mon/Thu: Closed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/20">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p className="opacity-80">
              © {new Date().getFullYear()} Let It Ride Electric Bikes. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="/privacy" className="opacity-80 hover:opacity-100 hover:underline">
                Privacy Policy
              </Link>
              <Link href="/terms" className="opacity-80 hover:opacity-100 hover:underline">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
