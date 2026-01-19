import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json } from "drizzle-orm/mysql-core";

// Core user table backing auth flow
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "affiliate"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Tours table
export const tours = mysqlTable("tours", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  shortDescription: text("shortDescription"),
  description: text("description"),
  duration: varchar("duration", { length: 50 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  image: text("image"),
  highlights: json("highlights"),
  included: json("included"),
  maxGuests: int("maxGuests").default(10),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Tour = typeof tours.$inferSelect;
export type InsertTour = typeof tours.$inferInsert;

// Tour bookings table
export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  tourId: int("tourId").notNull(),
  userId: int("userId"),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 20 }),
  bookingDate: timestamp("bookingDate").notNull(),
  bookingTime: varchar("bookingTime", { length: 10 }).notNull(),
  guests: int("guests").default(1).notNull(),
  totalPrice: decimal("totalPrice", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled"]).default("pending").notNull(),
  stripePaymentId: varchar("stripePaymentId", { length: 255 }),
  specialRequests: text("specialRequests"),
  affiliateCode: varchar("affiliateCode", { length: 50 }),
  reviewRequested: boolean("reviewRequested").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

// Products table for e-bike shop
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  shortDescription: text("shortDescription"),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  salePrice: decimal("salePrice", { precision: 10, scale: 2 }),
  category: mysqlEnum("category", ["cruiser", "tandem", "cargo", "mountain", "fat-tire", "accessory"]).notNull(),
  brand: varchar("brand", { length: 100 }).default("Pedego"),
  image: text("image"),
  gallery: json("gallery"),
  features: json("features"),
  specifications: json("specifications"),
  stock: int("stock").default(0),
  isActive: boolean("isActive").default(true),
  isFeatured: boolean("isFeatured").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// Orders table
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 20 }),
  shippingAddress: text("shippingAddress"),
  items: json("items").notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "paid", "processing", "shipped", "delivered", "cancelled"]).default("pending").notNull(),
  stripePaymentId: varchar("stripePaymentId", { length: 255 }),
  couponCode: varchar("couponCode", { length: 50 }),
  affiliateCode: varchar("affiliateCode", { length: 50 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

// Blog posts table
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  featuredImage: text("featuredImage"),
  category: varchar("category", { length: 100 }),
  tags: json("tags"),
  seoTitle: varchar("seoTitle", { length: 200 }),
  seoDescription: text("seoDescription"),
  seoKeywords: text("seoKeywords"),
  authorId: int("authorId"),
  status: mysqlEnum("status", ["draft", "published", "scheduled"]).default("draft").notNull(),
  publishedAt: timestamp("publishedAt"),
  views: int("views").default(0),
  isAiGenerated: boolean("isAiGenerated").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

// Coupons table
export const coupons = mysqlTable("coupons", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  description: text("description"),
  discountType: mysqlEnum("discountType", ["percentage", "fixed", "bogo"]).notNull(),
  discountValue: decimal("discountValue", { precision: 10, scale: 2 }).notNull(),
  minPurchase: decimal("minPurchase", { precision: 10, scale: 2 }),
  maxDiscount: decimal("maxDiscount", { precision: 10, scale: 2 }),
  usageLimit: int("usageLimit"),
  usedCount: int("usedCount").default(0),
  applicableTo: mysqlEnum("applicableTo", ["all", "tours", "products"]).default("all"),
  isActive: boolean("isActive").default(true),
  expiresAt: timestamp("expiresAt"),
  source: mysqlEnum("source", ["manual", "email_signup", "game_win", "review_reward"]).default("manual"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = typeof coupons.$inferInsert;

// Affiliates table
export const affiliates = mysqlTable("affiliates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  commissionRate: decimal("commissionRate", { precision: 5, scale: 2 }).default("10").notNull(),
  totalClicks: int("totalClicks").default(0),
  totalSales: int("totalSales").default(0),
  totalEarnings: decimal("totalEarnings", { precision: 10, scale: 2 }).default("0"),
  pendingEarnings: decimal("pendingEarnings", { precision: 10, scale: 2 }).default("0"),
  paidEarnings: decimal("paidEarnings", { precision: 10, scale: 2 }).default("0"),
  status: mysqlEnum("status", ["pending", "active", "suspended"]).default("pending").notNull(),
  paypalEmail: varchar("paypalEmail", { length: 320 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Affiliate = typeof affiliates.$inferSelect;
export type InsertAffiliate = typeof affiliates.$inferInsert;

// Affiliate tracking table
export const affiliateTracking = mysqlTable("affiliate_tracking", {
  id: int("id").autoincrement().primaryKey(),
  affiliateId: int("affiliateId").notNull(),
  type: mysqlEnum("type", ["click", "booking", "order"]).notNull(),
  referenceId: int("referenceId"),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  commission: decimal("commission", { precision: 10, scale: 2 }),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AffiliateTracking = typeof affiliateTracking.$inferSelect;
export type InsertAffiliateTracking = typeof affiliateTracking.$inferInsert;

// Email subscribers table
export const emailSubscribers = mysqlTable("email_subscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  source: mysqlEnum("source", ["popup", "footer", "checkout", "game"]).default("popup"),
  couponCode: varchar("couponCode", { length: 50 }),
  couponUsed: boolean("couponUsed").default(false),
  giveawayEntry: boolean("giveawayEntry").default(false),
  tripAdvisorReviewed: boolean("tripAdvisorReviewed").default(false),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailSubscriber = typeof emailSubscribers.$inferSelect;
export type InsertEmailSubscriber = typeof emailSubscribers.$inferInsert;

// Social media posts queue
export const socialPosts = mysqlTable("social_posts", {
  id: int("id").autoincrement().primaryKey(),
  platform: mysqlEnum("platform", ["instagram", "facebook", "both"]).notNull(),
  content: text("content").notNull(),
  imageUrl: text("imageUrl"),
  link: text("link"),
  tinyUrl: text("tinyUrl"),
  affiliateLink: text("affiliateLink"),
  hashtags: json("hashtags"),
  status: mysqlEnum("status", ["queued", "posted", "failed"]).default("queued").notNull(),
  scheduledAt: timestamp("scheduledAt"),
  postedAt: timestamp("postedAt"),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SocialPost = typeof socialPosts.$inferSelect;
export type InsertSocialPost = typeof socialPosts.$inferInsert;

// Game plays tracking
export const gamePlays = mysqlTable("game_plays", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }),
  userId: int("userId"),
  result: mysqlEnum("result", ["win", "lose"]).notNull(),
  prizeType: mysqlEnum("prizeType", ["discount_10", "discount_15", "discount_20", "discount_25", "bogo", "free_tour", "none"]),
  couponCode: varchar("couponCode", { length: 50 }),
  handDetails: json("handDetails"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GamePlay = typeof gamePlays.$inferSelect;
export type InsertGamePlay = typeof gamePlays.$inferInsert;

// Reviews tracking (for TripAdvisor review requests)
export const reviewRequests = mysqlTable("review_requests", {
  id: int("id").autoincrement().primaryKey(),
  bookingId: int("bookingId").notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerName: varchar("customerName", { length: 255 }),
  sentAt: timestamp("sentAt"),
  clickedAt: timestamp("clickedAt"),
  reviewedAt: timestamp("reviewedAt"),
  giveawayEntered: boolean("giveawayEntered").default(false),
  status: mysqlEnum("status", ["pending", "sent", "clicked", "reviewed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ReviewRequest = typeof reviewRequests.$inferSelect;
export type InsertReviewRequest = typeof reviewRequests.$inferInsert;

// Site settings table
export const siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;


// Service appointments table
export const serviceAppointments = mysqlTable("service_appointments", {
  id: int("id").autoincrement().primaryKey(),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 20 }).notNull(),
  bikeType: varchar("bikeType", { length: 100 }).notNull(),
  bikeBrand: varchar("bikeBrand", { length: 100 }),
  bikeModel: varchar("bikeModel", { length: 100 }),
  serviceType: varchar("serviceType", { length: 100 }).notNull(),
  preferredDate: timestamp("preferredDate").notNull(),
  preferredTime: varchar("preferredTime", { length: 20 }),
  issueDescription: text("issueDescription"),
  status: mysqlEnum("status", ["pending", "confirmed", "in_progress", "completed", "cancelled"]).default("pending").notNull(),
  notes: text("notes"),
  estimatedCost: decimal("estimatedCost", { precision: 10, scale: 2 }),
  actualCost: decimal("actualCost", { precision: 10, scale: 2 }),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ServiceAppointment = typeof serviceAppointments.$inferSelect;
export type InsertServiceAppointment = typeof serviceAppointments.$inferInsert;
