import { Link } from 'wouter';
import {
  Bike,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  Zap,
  ArrowRight
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[oklch(0.14_0.03_148)] text-white">
      {/* TripAdvisor trust bar */}
      <div className="border-b border-white/10 bg-white/5">
        <div className="container py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div>
                <span className="font-bold text-white">189+ Reviews</span>
                <span className="text-white/60 text-sm ml-2">on TripAdvisor</span>
              </div>
            </div>
            <a
              href="https://www.tripadvisor.com/Attraction_Review-g51766-d2069561-Reviews-Let_it_Ride_Electric_Bikes_Tours_Rentals-Bend_Central_Oregon_Oregon.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 font-semibold transition-colors group"
            >
              Read Our Reviews
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Bike className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-black text-lg text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
                  Let It Ride
                </div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-amber-400">
                  Electric Bikes
                </div>
              </div>
            </div>
            <p className="text-sm text-white/55 leading-relaxed mb-6">
              Experience the joy, freedom, and fun of electric bikes in beautiful Bend, Oregon.
              Tours, rentals, and sales since 2011.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/letitridebend"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/letitridebend"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-white/40 mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: 'eBike Tours', href: '/tours' },
                { label: 'Shop eBikes', href: '/shop' },
                { label: 'Rentals', href: '/rentals' },
                { label: 'Blog', href: '/blog' },
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Affiliate Program', href: '/affiliate' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/55 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tours */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-white/40 mb-5">Our Tours</h3>
            <ul className="space-y-3">
              {[
                { label: 'Short & Sweet Tour', price: '$75', href: '/tours/short-and-sweet' },
                { label: 'Deschutes River Tour', price: '$100', href: '/tours/deschutes-river' },
                { label: 'Taste of Bend Tour', price: '$150', href: '/tours/taste-of-bend' },
                { label: 'Custom Tours', price: 'Contact Us', href: '/contact' },
              ].map((tour) => (
                <li key={tour.href}>
                  <Link href={tour.href} className="text-sm text-white/55 hover:text-white transition-colors flex items-center justify-between group">
                    <span>{tour.label}</span>
                    <span className="text-amber-400/70 group-hover:text-amber-400 font-semibold text-xs transition-colors">{tour.price}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-white/40 mb-5">Visit Us</h3>
            <ul className="space-y-3 text-sm text-white/55">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary/70" />
                <span>25 NW Minnesota Avenue #6<br />Bend, OR 97701</span>
              </li>
              <li>
                <a href="tel:5413063177" className="flex items-center gap-2.5 hover:text-white transition-colors">
                  <Phone className="h-4 w-4 flex-shrink-0 text-primary/70" />
                  <span>Rentals: (541) 306-3177</span>
                </a>
              </li>
              <li>
                <a href="tel:5416472331" className="flex items-center gap-2.5 hover:text-white transition-colors">
                  <Phone className="h-4 w-4 flex-shrink-0 text-primary/70" />
                  <span>Tours: (541) 647-2331</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@pedegobend.com" className="flex items-center gap-2.5 hover:text-white transition-colors">
                  <Mail className="h-4 w-4 flex-shrink-0 text-primary/70" />
                  <span>info@pedegobend.com</span>
                </a>
              </li>
            </ul>

            <div className="mt-5 pt-5 border-t border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-3.5 w-3.5 text-primary/70" />
                <span className="text-xs font-bold tracking-widest uppercase text-white/40">Hours</span>
              </div>
              <div className="text-sm text-white/55 space-y-1">
                <div className="flex justify-between">
                  <span>Tue / Wed / Fri</span>
                  <span className="text-white/70">11AM – 5PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="text-white/70">10AM – 4PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-white/70">11AM – 4PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Mon / Thu</span>
                  <span className="text-red-400/70">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/35">
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-amber-400/60" />
              <span>© {new Date().getFullYear()} Let It Ride Electric Bikes. All rights reserved.</span>
            </div>
            <div className="flex gap-5">
              <Link href="/privacy-policy" className="hover:text-white/70 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-and-conditions" className="hover:text-white/70 transition-colors">
                Terms &amp; Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
