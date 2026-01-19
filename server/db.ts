import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  tours, Tour, InsertTour,
  bookings, Booking, InsertBooking,
  products, Product, InsertProduct,
  orders, Order, InsertOrder,
  blogPosts, BlogPost, InsertBlogPost,
  coupons, Coupon, InsertCoupon,
  affiliates, Affiliate, InsertAffiliate,
  affiliateTracking, AffiliateTracking, InsertAffiliateTracking,
  emailSubscribers, EmailSubscriber, InsertEmailSubscriber,
  socialPosts, SocialPost, InsertSocialPost,
  gamePlays, GamePlay, InsertGamePlay,
  reviewRequests, ReviewRequest, InsertReviewRequest,
  siteSettings, SiteSetting, InsertSiteSetting,
  serviceAppointments, ServiceAppointment, InsertServiceAppointment
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// User functions
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "phone", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Tours functions
export async function getAllTours(activeOnly = true) {
  const db = await getDb();
  if (!db) return [];
  if (activeOnly) {
    return db.select().from(tours).where(eq(tours.isActive, true));
  }
  return db.select().from(tours);
}

export async function getTourBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(tours).where(eq(tours.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getTourById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(tours).where(eq(tours.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createTour(tour: InsertTour) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(tours).values(tour);
  return result;
}

export async function updateTour(id: number, tour: Partial<InsertTour>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(tours).set(tour).where(eq(tours.id, id));
}

// Bookings functions
export async function createBooking(booking: InsertBooking) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(bookings).values(booking);
  return result;
}

export async function getBookingById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllBookings() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookings).orderBy(desc(bookings.createdAt));
}

export async function updateBookingStatus(id: number, status: Booking["status"]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(bookings).set({ status }).where(eq(bookings.id, id));
}

// Products functions
export async function getAllProducts(activeOnly = true) {
  const db = await getDb();
  if (!db) return [];
  if (activeOnly) {
    return db.select().from(products).where(eq(products.isActive, true));
  }
  return db.select().from(products);
}

export async function getProductsByCategory(category: Product["category"]) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(and(eq(products.category, category), eq(products.isActive, true)));
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createProduct(product: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(products).values(product);
}

export async function updateProduct(id: number, product: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(products).set(product).where(eq(products.id, id));
}

// Orders functions
export async function createOrder(order: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(orders).values(order);
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllOrders() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function updateOrderStatus(id: number, status: Order["status"]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(orders).set({ status }).where(eq(orders.id, id));
}

// Blog posts functions
export async function getAllBlogPosts(publishedOnly = true) {
  const db = await getDb();
  if (!db) return [];
  if (publishedOnly) {
    return db.select().from(blogPosts).where(eq(blogPosts.status, "published")).orderBy(desc(blogPosts.publishedAt));
  }
  return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createBlogPost(post: InsertBlogPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(blogPosts).values(post);
}

export async function updateBlogPost(id: number, post: Partial<InsertBlogPost>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(blogPosts).set(post).where(eq(blogPosts.id, id));
}

export async function incrementBlogViews(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(blogPosts).set({ views: sql`${blogPosts.views} + 1` }).where(eq(blogPosts.id, id));
}

// Coupons functions
export async function getCouponByCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(coupons).where(eq(coupons.code, code.toUpperCase())).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCoupon(coupon: InsertCoupon) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(coupons).values({ ...coupon, code: coupon.code.toUpperCase() });
}

export async function incrementCouponUsage(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(coupons).set({ usedCount: sql`${coupons.usedCount} + 1` }).where(eq(coupons.id, id));
}

export async function getAllCoupons() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(coupons).orderBy(desc(coupons.createdAt));
}

// Affiliates functions
export async function getAffiliateByCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(affiliates).where(eq(affiliates.code, code)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAffiliateByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(affiliates).where(eq(affiliates.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createAffiliate(affiliate: InsertAffiliate) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(affiliates).values(affiliate);
}

export async function updateAffiliateStats(id: number, stats: Partial<InsertAffiliate>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(affiliates).set(stats).where(eq(affiliates.id, id));
}

export async function getAllAffiliates() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(affiliates).orderBy(desc(affiliates.createdAt));
}

// Affiliate tracking functions
export async function trackAffiliateAction(tracking: InsertAffiliateTracking) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(affiliateTracking).values(tracking);
}

export async function getAffiliateTrackingByAffiliateId(affiliateId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(affiliateTracking).where(eq(affiliateTracking.affiliateId, affiliateId)).orderBy(desc(affiliateTracking.createdAt));
}

// Email subscribers functions
export async function createEmailSubscriber(subscriber: InsertEmailSubscriber) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(emailSubscribers).values(subscriber);
}

export async function getEmailSubscriberByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(emailSubscribers).where(eq(emailSubscribers.email, email.toLowerCase())).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllEmailSubscribers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(emailSubscribers).orderBy(desc(emailSubscribers.createdAt));
}

export async function updateEmailSubscriber(id: number, data: Partial<InsertEmailSubscriber>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(emailSubscribers).set(data).where(eq(emailSubscribers.id, id));
}

// Social posts functions
export async function createSocialPost(post: InsertSocialPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(socialPosts).values(post);
}

export async function getQueuedSocialPosts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(socialPosts).where(eq(socialPosts.status, "queued")).orderBy(socialPosts.scheduledAt);
}

export async function getAllSocialPosts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(socialPosts).orderBy(desc(socialPosts.createdAt));
}

export async function updateSocialPostStatus(id: number, status: SocialPost["status"], postedAt?: Date, errorMessage?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(socialPosts).set({ status, postedAt, errorMessage }).where(eq(socialPosts.id, id));
}

// Game plays functions
export async function createGamePlay(play: InsertGamePlay) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(gamePlays).values(play);
}

export async function getGamePlaysBySession(sessionId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(gamePlays).where(eq(gamePlays.sessionId, sessionId));
}

export async function getGamePlaysByEmail(email: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(gamePlays).where(eq(gamePlays.email, email));
}

export async function getTodayGamePlayCount(sessionId: string) {
  const db = await getDb();
  if (!db) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const result = await db.select({ count: sql<number>`count(*)` })
    .from(gamePlays)
    .where(and(eq(gamePlays.sessionId, sessionId), gte(gamePlays.createdAt, today)));
  return result[0]?.count || 0;
}

// Review requests functions
export async function createReviewRequest(request: InsertReviewRequest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(reviewRequests).values(request);
}

export async function getReviewRequestByBookingId(bookingId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(reviewRequests).where(eq(reviewRequests.bookingId, bookingId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateReviewRequest(id: number, data: Partial<InsertReviewRequest>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(reviewRequests).set(data).where(eq(reviewRequests.id, id));
}

export async function getPendingReviewRequests() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reviewRequests).where(eq(reviewRequests.status, "pending"));
}

// Site settings functions
export async function getSetting(key: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
  return result.length > 0 ? result[0]?.value : undefined;
}

export async function setSetting(key: string, value: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(siteSettings).values({ key, value }).onDuplicateKeyUpdate({ set: { value } });
}

// Analytics helpers
export async function getBookingStats() {
  const db = await getDb();
  if (!db) return { total: 0, confirmed: 0, revenue: 0 };
  const result = await db.select({
    total: sql<number>`count(*)`,
    confirmed: sql<number>`sum(case when status = 'confirmed' or status = 'completed' then 1 else 0 end)`,
    revenue: sql<number>`sum(case when status = 'confirmed' or status = 'completed' then totalPrice else 0 end)`
  }).from(bookings);
  return result[0] || { total: 0, confirmed: 0, revenue: 0 };
}

export async function getOrderStats() {
  const db = await getDb();
  if (!db) return { total: 0, paid: 0, revenue: 0 };
  const result = await db.select({
    total: sql<number>`count(*)`,
    paid: sql<number>`sum(case when status in ('paid', 'processing', 'shipped', 'delivered') then 1 else 0 end)`,
    revenue: sql<number>`sum(case when status in ('paid', 'processing', 'shipped', 'delivered') then total else 0 end)`
  }).from(orders);
  return result[0] || { total: 0, paid: 0, revenue: 0 };
}

export async function getSubscriberCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`count(*)` }).from(emailSubscribers).where(eq(emailSubscribers.isActive, true));
  return result[0]?.count || 0;
}

// Additional helper functions for routers
export async function getBookingsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookings).where(eq(bookings.userId, userId)).orderBy(desc(bookings.createdAt));
}

export async function getOrdersByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
}

export async function getPublishedBlogPosts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogPosts).where(eq(blogPosts.status, "published")).orderBy(desc(blogPosts.publishedAt));
}

export async function updateAffiliateEarnings(id: number, commission: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(affiliates).set({ 
    totalEarnings: sql`${affiliates.totalEarnings} + ${commission}`,
    totalSales: sql`${affiliates.totalSales} + 1`
  }).where(eq(affiliates.id, id));
}

export async function createAffiliateSale(sale: {
  affiliateId: number;
  type: 'click' | 'booking' | 'order';
  referenceId: number;
  amount: string;
  commission: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(affiliateTracking).values({
    affiliateId: sale.affiliateId,
    type: sale.type,
    referenceId: sale.referenceId,
    amount: sale.amount,
    commission: sale.commission
  });
}

export async function getAffiliateSales(affiliateId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(affiliateTracking).where(
    eq(affiliateTracking.affiliateId, affiliateId)
  ).orderBy(desc(affiliateTracking.createdAt));
}

export async function getPendingSocialPosts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(socialPosts).where(eq(socialPosts.status, "queued")).orderBy(socialPosts.scheduledAt);
}

export async function getGamePlaysByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(gamePlays).where(eq(gamePlays.userId, userId)).orderBy(desc(gamePlays.createdAt));
}


// Service appointment functions

export async function createServiceAppointment(appointment: InsertServiceAppointment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(serviceAppointments).values(appointment);
}

export async function getAllServiceAppointments() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(serviceAppointments).orderBy(desc(serviceAppointments.createdAt));
}

export async function getServiceAppointmentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(serviceAppointments).where(eq(serviceAppointments.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateServiceAppointment(id: number, data: Partial<InsertServiceAppointment>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(serviceAppointments).set(data).where(eq(serviceAppointments.id, id));
}

export async function getServiceAppointmentsByStatus(status: ServiceAppointment["status"]) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(serviceAppointments).where(eq(serviceAppointments.status, status)).orderBy(desc(serviceAppointments.createdAt));
}

export async function getServiceAppointmentsByEmail(email: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(serviceAppointments).where(eq(serviceAppointments.customerEmail, email)).orderBy(desc(serviceAppointments.createdAt));
}
