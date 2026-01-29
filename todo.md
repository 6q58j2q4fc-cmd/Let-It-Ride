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


## Scheduled Tasks Automation
- [x] Create API endpoint for automated blog generation
- [x] Create API endpoint for automated social media posting
- [x] Add scheduler configuration UI in admin panel
- [x] Set up daily cron job for blog post generation (9 AM)
- [x] Set up daily cron job for social media posting (10 AM)
- [x] Add scheduler status display in admin dashboard


## Product Image Fixes
- [x] Fix Pedego Interceptor (Cruiser) image
- [x] Fix Pedego Tandem image
- [x] Fix Pedego Stretch (Cargo) image
- [x] Fix Pedego Ridge Rider (Mountain) image
- [x] Fix Pedego Trail Tracker (Fat-Tire) image
- [x] Fix accessory images (helmet, lock, basket)


## Electric Theme & Green Energy Enhancements
- [x] Add electric lightning bolt accents to CSS theme
- [x] Create green energy color palette with electric highlights
- [x] Build interactive eco-savings calculator component
- [x] Add auto-updating environmental facts ticker
- [x] Create pollution savings statistics section
- [x] Add gas savings and ROI calculator
- [x] Build "How E-Bikes Pay for Themselves" section
- [x] Add modern animations and micro-interactions
- [x] Enhance buttons with lightning bolt hover effects
- [x] Create animated counter components for stats


## Premium Branding & Design Enhancements
- [x] Create larger, more impactful logo with electric bike icon
- [x] Add animated logo with lightning bolt effect
- [x] Enhance header with premium sticky navigation
- [x] Improve typography with premium font pairing
- [x] Refine spacing and visual hierarchy
- [x] Add smooth scroll and page transitions
- [x] Enhance CTA buttons with premium hover effects
- [x] Add parallax effects to hero section
- [x] Improve card designs with glassmorphism
- [x] Add loading animations and skeleton states


## SEO Fixes
- [x] Add meta description tag (50-160 characters)
- [x] Add meta keywords tag
- [x] Add Open Graph meta tags for social sharing
- [x] Add structured data (JSON-LD) for LocalBusiness


## Bug Fixes
- [x] Fix sidebar/mobile menu text visibility - Let It Ride text covered by colors
- [x] Reduce meta keywords from 10 to 6 focused keywords
- [x] Shorten meta description from 162 to 131 characters


## WordPress Integration & Page-Specific SEO
- [x] Set up WordPress REST API integration for automatic posting
- [x] Connect daily cron job to post SEO-optimized articles to WordPress
- [x] Add unique meta tags to /tours page
- [x] Add unique meta tags to /shop page
- [x] Add unique meta tags to /rentals page
- [x] Add unique meta tags to /blog page


## Customer Review Schema
- [x] Add AggregateRating JSON-LD structured data to homepage
- [x] Include 189+ reviews with 5-star rating from TripAdvisor
- [x] Add individual review samples for rich snippets


## XML Sitemap, RSS Feeds & Daily Automation
- [x] Create dynamic XML sitemap endpoint (/sitemap.xml)
- [x] Create RSS feed endpoint (/rss.xml) for blog posts
- [x] Create Atom feed endpoint (/atom.xml) for blog posts
- [x] Create robots.txt with sitemap reference
- [x] Set up daily cron job endpoint for automated blog generation
- [x] Set up daily cron job endpoint for social media posting
- [x] Add RSS/Atom feed links to HTML head
- [x] Create cron status and health check endpoints


## Full Site Audit - Match letitridebend.com
- [x] Research all tours on letitridebend.com (names, descriptions, pricing, duration)
- [x] Research all rental options (bikes, pricing, duration options)
- [x] Research all products for sale (e-bikes, accessories)
- [x] Document all images used on their site
- [x] Create comprehensive audit spreadsheet
- [x] Update Tours page to match exactly
- [x] Update Rentals page to match exactly
- [x] Update Shop page to match exactly
- [x] Update all product images to match
- [x] Verify all pricing matches
- [x] Final verification of all pages


## Service/Repair Page
- [x] Create Service.tsx page component with all service offerings
- [x] Add $100/hour labor rate and service pricing (updated from research)
- [x] Add tune-up packages ($60-$120) and repair services
- [x] Add route in App.tsx for /service
- [x] Add navigation link in Header
- [x] Add SEO meta tags for service page


## New Features - Service Booking, Accessories, Gallery
- [x] Create online service booking form with bike details and date selection
- [x] Add database table for service appointments
- [x] Create tRPC endpoint for service booking submissions
- [x] Add parts/accessories section to shop (helmets, locks, baskets, lights)
- [x] Create photo gallery page with images from letitridebend.com
- [x] Add gallery route and navigation link


## Admin Panel, Email Notifications & Testimonials
- [x] Create admin panel section for service appointments management
- [x] Add service appointments table view with status filters
- [x] Add ability to update appointment status (pending/confirmed/in_progress/completed/cancelled)
- [x] Add notes and cost fields for admin updates
- [x] Enable email notifications for service request submissions
- [x] Send confirmation email to customer when appointment is submitted
- [x] Add customer testimonials section to homepage
- [x] Display featured customer quotes with names and photos
- [x] Integrate testimonials with TripAdvisor reviews display


## SMS Notifications
- [ ] Integrate SMS service provider (Twilio)
- [ ] Create SMS notification helper function
- [ ] Send SMS confirmation when service appointment is confirmed
- [ ] Include appointment details in SMS (date, time, service type)
- [ ] Write tests for SMS notification functionality


## Customer Service Chatbot with Let It Ride Game
- [x] Create customer service chatbot component with LLM integration
- [x] Train chatbot on Let It Ride business info (tours, rentals, service, pricing)
- [x] Add chatbot floating button to all pages
- [x] Integrate Let It Ride card game as optional feature within chat window
- [x] Add game trigger command/button in chatbot interface
- [x] Create engaging game UI within chat context
- [x] Test chatbot responses and game functionality


## Image Audit and Urtopia Brand Page
- [x] Audit all website images against letitridebend.com
- [x] Download and replace any missing or incorrect images
- [x] Ensure all product images match original website
- [x] Create Urtopia e-bikes brand information page
- [x] Add Urtopia page to navigation and shop
- [x] Test all images display correctly


## Blog Auto-Publishing Fix
- [x] Investigate current blog automation system
- [x] Debug issues preventing automatic blog publishing
- [x] Fix scheduled task for daily blog posts
- [x] Test automation and publish most recent blog post
- [x] Verify blogs display correctly on public pages


## Daily Blog Automation Verification
- [x] Verify cron job is properly scheduled for daily execution
- [x] Test blog generation with SEO optimization
- [x] Ensure new posts display correctly on blog page
- [x] Confirm automation status endpoint is working


## Admin Panel Enhancement & Custom Authentication
- [x] Create admin_credentials table for custom admin login
- [x] Implement password hashing with bcrypt
- [x] Build custom admin login page (username/password)
- [x] Create admin session management without Manus OAuth
- [x] Add admin logout functionality
- [x] Create photo management section in admin panel
- [x] Build image gallery view showing all website images
- [x] Add image upload functionality with S3 storage
- [x] Add image edit/replace functionality
- [x] Add image delete functionality
- [x] Organize images by category (tours, rentals, products, blog, gallery)
- [x] Add image preview and metadata display
- [x] Write tests for admin authentication and photo management


## Admin Account & Image Management Enhancements
- [x] Create admin account seed script with initial credentials
- [x] Add npm script to run seed and create first admin
- [x] Add bulk image import functionality to admin panel
- [x] Create batch import UI for multiple images
- [x] Enable image replacement while keeping URL references
- [x] Add replace image button to existing images
- [x] Write tests for new functionality


## Advanced Image Management Features
- [x] Build in-browser image cropping and resizing editor
- [x] Add crop/resize button to upload dialog
- [x] Create image usage tracking system
- [x] Show which pages each image is used on
- [x] Add drag-and-drop reordering for images
- [x] Implement displayOrder field in database
- [x] Test all new features


## Admin Panel Stats & Full Control Audit
- [x] Audit all dashboard stats for real database queries (no simulated data)
- [x] Fix revenue/sales stats to pull from actual orders table
- [x] Fix booking stats to pull from actual bookings table
- [x] Fix visitor/traffic stats to use real analytics data
- [x] Ensure all CRUD operations work for tours, products, bookings
- [x] Verify blog post management with real database entries
- [x] Verify service appointment management with real data
- [x] Ensure affiliate tracking shows real clicks/sales
- [x] Verify coupon management with real usage stats
- [x] Add any missing admin control features
- [x] Test all admin functionality end-to-end


## Blog Article Enhancements & SEO
- [x] Fix social media share buttons on all articles (Facebook, Twitter, LinkedIn, Pinterest)
- [x] Improve article structure and theme to match website design
- [x] Add LLM-generated images for each article
- [x] Add area maps and fun facts sections to articles
- [x] Implement comprehensive SEO meta tags (Open Graph, Twitter Cards, JSON-LD)
- [x] Add relevant search terms and keywords to articles
- [x] Create BOGO tour coupon code for TripAdvisor reviews
- [x] Add TripAdvisor review CTA with coupon incentive
- [x] Add reading progress indicator to articles
- [x] Test all social share buttons work correctly


## Homepage Simplification & Design Refinement
- [x] Remove "AI generated" labels from blog article images
- [x] Fix duplicate photos in blog and gallery sections
- [x] Remove "Go Green with Electric Power" section from homepage
- [x] Remove "E-Bikes Pay for Themselves" section from homepage
- [x] Simplify homepage with less text and more breathing room
- [x] Align design aesthetic with New Wheel and Visit Bend (calm, easy, approachable)
- [x] Create clear path from landing to booking/buying
- [x] Test all design changes


## Admin Login & Logo Updates
- [x] Fix admin login to use passwordless authentication (username only)
- [x] Allow manager to create unique username without password
- [x] Store and remember admin sessions to prevent lockouts
- [x] Update logo with bigger "ELECTRIC BIKES" text
- [x] Add tagline "Bend's Electric Bike Shop & E-Tours"
- [x] Use bright electric lettering for "Electric Bikes" part
- [x] Add Square API integration section to admin panel
- [x] Test all changes


## Hero Video Capability
- [x] Add video upload functionality to admin panel photo management
- [x] Support video file types (mp4, webm, mov)
- [x] Create hero video player component with autoplay, loop, muted
- [x] Add video/image toggle option for hero sections
- [x] Implement fallback to static image if video fails to load
- [x] Test video playback on homepage hero section

## Product Inventory Review
- [x] Research current Pedego Bend inventory and pricing from pedegobend.com
- [x] Research current Urtopia inventory and pricing from newurtopia.com
- [x] Update Pedego e-bike prices in database (11 products)
- [x] Update Urtopia e-bike prices in database (10 products)
- [x] Verify all product specs match source websites
- [x] Update any missing or incorrect product images
- [x] Test all product pages display correctly


## Product Image Upload
- [x] Download Pedego product images from official website (11 bikes)
- [x] Download Urtopia product images from official website (10 bikes)
- [x] Upload images to S3 storage (21 images uploaded)
- [x] Update product records with new image URLs
- [x] Test product pages display correctly with new images


## Square API Integration
- [x] Set up Square environment variables (sandbox and production)
- [x] Install Square SDK dependency
- [x] Create Square API helper functions on server
- [x] Add Square checkout for tour bookings
- [x] Add Square checkout for e-bike purchases
- [x] Add Square checkout for rentals
- [x] Update admin panel with Square connection status
- [x] Test sandbox payments (verified: Location ID LVY82Y46K6BJF)
- [x] Switch to production mode (Location: Let it Ride Electric, LLC, ID: L1J9R07CD0045)
- [x] Verify production credentials working


## Square Webhooks & Admin Signup
- [x] Create Square webhook endpoint at /api/square/webhook
- [x] Add webhook signature verification for security
- [x] Handle payment.completed event for order confirmations
- [x] Handle payment.updated event for status changes
- [x] Handle refund.created event for refund notifications
- [x] Handle order.created and order.updated events
- [x] Update order/booking status in database on payment events
- [x] Verify admin signup page has working shareable link (/admin-signup)
- [x] Test admin signup flow for new managers
- [x] Document webhook URL: /api/square/webhook


## Domain Link Issues Fix
- [x] Audit all routes in App.tsx for correct paths
- [x] Check all navigation links in Header component
- [x] Verify all internal links use relative paths (no hardcoded domains found)
- [x] Fix any hardcoded domain references (none found)
- [x] Test admin-login and admin-signup pages are accessible (/admin-login, /admin-signup work)
- [x] Test all tour detail pages work (/tours/short-and-sweet, /tours/deschutes-river, /tours/taste-of-bend)
- [x] Test all product detail pages work (/shop/pedego-interceptor, etc.)
- [x] Test all blog post pages work (/blog/best-ebike-trails-bend-oregon, etc.)
- [x] Verify 404 page handles unknown routes correctly
- [x] All pages working - site needs to be PUBLISHED for public shareable links


## Neon Hero Text
- [x] Add neon "BEND'S ELECTRIC BIKE SHOP AND TOURS" text to homepage hero
- [x] Create glowing neon effect with CSS animations (green glow with flicker)
- [x] Center text prominently across hero section
- [x] Test neon effect displays correctly


## Neon Text Design Refinement
- [x] Remove dark background container from neon text
- [x] Make text float transparently over hero image
- [x] Enhance neon glow effect for better visibility without background
- [x] Create top-notch aesthetic design (multi-layer glow, dark outline, smooth pulse animation)
