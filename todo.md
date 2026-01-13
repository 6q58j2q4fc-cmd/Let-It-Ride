# Let It Ride Bend - Project TODO

## Database & Schema
- [x] Tours table (id, name, description, duration, price, image)
- [x] Bookings table (id, tour_id, user_id, date, time, guests, status, payment_id)
- [x] Products table (id, name, description, price, category, image, stock)
- [x] Orders table (id, user_id, items, total, status, payment_id)
- [x] Blog posts table (id, title, slug, content, seo_meta, published_at)
- [x] Coupons table (id, code, discount_type, discount_value, usage_limit, expires_at)
- [x] Affiliates table (id, user_id, code, commission_rate, earnings)
- [x] Affiliate clicks/sales tracking tables
- [x] Email subscribers table
- [x] Social media posts queue table
- [x] Game plays/wins tracking table

## Homepage & Core UI
- [x] Modern outdoor adventure design theme
- [x] Hero section with Bend scenic imagery
- [x] Tour offerings showcase (Short & Sweet $75, Deschutes River $100, Taste of Bend $150)
- [x] E-bike rentals section
- [x] TripAdvisor reviews widget
- [x] Responsive navigation
- [x] Footer with contact info and social links

## Tour Booking System
- [x] Tour listing page with all three tours
- [x] Individual tour detail pages
- [x] Booking form with date/time/guests selection
- [x] Stripe payment integration for tour bookings
- [x] Custom tour request form
- [ ] Booking confirmation emails (via Square integration - pending API setup)
- [x] Booking management dashboard

## E-Bike Shop
- [x] Product catalog page
- [x] Product categories (Cruisers, Tandems, Cargo, Mountain)
- [x] Individual product detail pages
- [x] Shopping cart functionality
- [x] Stripe checkout integration
- [x] Order confirmation and tracking

## TripAdvisor Integration
- [x] Review widget embedding
- [x] Display 189+ reviews count
- [ ] Automated review request emails via Square (pending Square API setup)
- [x] CJ affiliate tracking (API key: WV-6g7SMyviMM2xoQMRk867IcA)

## Automated SEO Blog Engine
- [x] Blog listing page
- [x] Individual blog post pages
- [x] AI-powered content generation using LLM
- [ ] Daily automated posting system (scheduled task setup pending)
- [x] SEO meta tags and structured data
- [x] Categories and tags

## Social Media Automation
- [x] Social media post queue management
- [ ] Instagram posting integration (@letitridebend) - requires API credentials
- [ ] Facebook posting integration (@letitridebend) - requires API credentials
- [ ] TinyURL link shortening
- [x] Affiliate link embedding
- [ ] Daily automated posting (scheduled task setup pending)

## Email Capture & Coupons
- [x] Email capture popup modal
- [x] 5% off coupon code generation
- [x] One-time use coupon validation
- [x] TripAdvisor review giveaway entry
- [x] Free e-bike giveaway tracking
- [x] Email list management

## Custom Affiliate Program
- [x] Affiliate registration system
- [x] Unique referral link generation
- [x] Click and sale tracking
- [x] Commission calculations
- [x] Affiliate dashboard
- [x] Payout tracking

## Let It Ride Card Game Chatbot
- [x] Interactive card game UI
- [x] Let It Ride poker mechanics
- [x] Prize tiers (10-25% off, BOGO, free tours)
- [x] Coupon code generation for winners
- [x] Play limit tracking
- [x] Game statistics

## Admin Panel
- [x] Dashboard with key metrics
- [x] Tour management CRUD
- [x] Booking management
- [x] Product/inventory management
- [x] Blog post management
- [x] Social media queue management
- [x] Affiliate tracking and management
- [x] Coupon code management
- [x] Email subscriber list
- [x] Analytics and reporting

## Additional Pages
- [x] About page
- [x] Contact page
- [x] Rentals page
- [x] Booking success page
- [x] Order success page

## Technical
- [x] Stripe webhook handler
- [x] Unit tests for core functionality


## Image Updates
- [x] Update hero section with Bend, Oregon mountain scenery
- [x] Update tour images with Deschutes River, local trails, brewery scenes
- [x] Update e-bike product images with Pedego bikes
- [x] Update blog images with Central Oregon landscapes
- [x] Update about page with local Bend imagery
- [x] Update rentals page with e-bike rental scenes
