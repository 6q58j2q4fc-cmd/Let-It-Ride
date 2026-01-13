import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database functions
vi.mock("./db", () => ({
  createBooking: vi.fn().mockResolvedValue({ insertId: 1 }),
  getBookingsByUser: vi.fn().mockResolvedValue([]),
  getAllBookings: vi.fn().mockResolvedValue([]),
  updateBookingStatus: vi.fn().mockResolvedValue({}),
  createOrder: vi.fn().mockResolvedValue({ insertId: 1 }),
  getOrdersByUser: vi.fn().mockResolvedValue([]),
  getAllOrders: vi.fn().mockResolvedValue([]),
  createBlogPost: vi.fn().mockResolvedValue({ insertId: 1 }),
  getAllBlogPosts: vi.fn().mockResolvedValue([]),
  getPublishedBlogPosts: vi.fn().mockResolvedValue([]),
  getBlogPostBySlug: vi.fn().mockResolvedValue(null),
  updateBlogPost: vi.fn().mockResolvedValue({}),
  createCoupon: vi.fn().mockResolvedValue({ insertId: 1 }),
  getCouponByCode: vi.fn().mockResolvedValue(null),
  getAllCoupons: vi.fn().mockResolvedValue([]),
  createEmailSubscriber: vi.fn().mockResolvedValue({ insertId: 1 }),
  getAllEmailSubscribers: vi.fn().mockResolvedValue([]),
  createAffiliate: vi.fn().mockResolvedValue({ insertId: 1 }),
  getAffiliateByUserId: vi.fn().mockResolvedValue(null),
  getAllAffiliates: vi.fn().mockResolvedValue([]),
  updateAffiliateEarnings: vi.fn().mockResolvedValue({}),
  createAffiliateSale: vi.fn().mockResolvedValue({ insertId: 1 }),
  getAffiliateSales: vi.fn().mockResolvedValue([]),
  createSocialPost: vi.fn().mockResolvedValue({ insertId: 1 }),
  getPendingSocialPosts: vi.fn().mockResolvedValue([]),
  getAllSocialPosts: vi.fn().mockResolvedValue([]),
  createReviewRequest: vi.fn().mockResolvedValue({ insertId: 1 }),
  getPendingReviewRequests: vi.fn().mockResolvedValue([]),
  createGamePlay: vi.fn().mockResolvedValue({ insertId: 1 }),
  getGamePlaysByUser: vi.fn().mockResolvedValue([]),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: { origin: "http://localhost:3000" },
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAuthContext(role: "user" | "admin" = "user"): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    phone: null,
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: { origin: "http://localhost:3000" },
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("Bookings Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a booking with valid input", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.bookings.create({
      tourId: 1,
      tourDate: "2026-02-15",
      tourTime: "10:00 AM",
      guests: 2,
      customerName: "John Doe",
      customerEmail: "john@example.com",
      customerPhone: "555-1234",
      totalPrice: "150.00",
      specialRequests: "No special requests",
    });

    expect(result).toBeDefined();
  });

  it("returns empty array for user with no bookings", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.bookings.getMyBookings();
    expect(result).toEqual([]);
  });

  it("admin can get all bookings", async () => {
    const ctx = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.bookings.getAll();
    expect(result).toEqual([]);
  });

  it("non-admin cannot get all bookings", async () => {
    const ctx = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);

    await expect(caller.bookings.getAll()).rejects.toThrow("Unauthorized");
  });
});

describe("Coupons Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("validates non-existent coupon", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.coupons.validate({ code: "INVALID" });
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Invalid coupon code");
  });

  it("generates welcome coupon with email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.coupons.generateWelcome({
      email: "newuser@example.com",
    });

    expect(result.code).toMatch(/^WELCOME5-/);
  });
});

describe("Email Subscribers Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("subscribes email with popup source", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.emails.subscribe({
      email: "subscriber@example.com",
      source: "popup",
    });

    expect(result).toBeDefined();
  });

  it("admin can get all subscribers", async () => {
    const ctx = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.emails.getAll();
    expect(result).toEqual([]);
  });
});

describe("Blog Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns published blog posts", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.blog.getAll();
    expect(result).toEqual([]);
  });

  it("returns null for non-existent blog post", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.blog.getBySlug({ slug: "non-existent" });
    expect(result).toBeNull();
  });
});

describe("Game Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("records a game play with win result", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.game.play({
      sessionId: "test-session-123",
      result: "win",
      prizeType: "discount_10",
      couponCode: "WIN10-ABC123",
    });

    expect(result).toBeDefined();
  });

  it("records a game play with lose result", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.game.play({
      sessionId: "test-session-456",
      result: "lose",
    });

    expect(result).toBeDefined();
  });
});

describe("Admin Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("admin can get stats", async () => {
    const ctx = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.getStats();
    expect(result).toHaveProperty("todayRevenue");
    expect(result).toHaveProperty("totalBookings");
    expect(result).toHaveProperty("emailSubscribers");
  });

  it("non-admin cannot get stats", async () => {
    const ctx = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.getStats()).rejects.toThrow("Unauthorized");
  });
});
