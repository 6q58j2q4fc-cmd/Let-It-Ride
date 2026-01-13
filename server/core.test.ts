import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

// Mock database functions
vi.mock('./db', () => ({
  createBooking: vi.fn().mockResolvedValue({ id: 1 }),
  getBookingsByUser: vi.fn().mockResolvedValue([]),
  getAllBookings: vi.fn().mockResolvedValue([
    { id: 1, totalPrice: '100', status: 'pending', createdAt: new Date() }
  ]),
  updateBookingStatus: vi.fn().mockResolvedValue(true),
  createOrder: vi.fn().mockResolvedValue({ id: 1 }),
  getOrdersByUser: vi.fn().mockResolvedValue([]),
  getAllOrders: vi.fn().mockResolvedValue([
    { id: 1, total: '500', createdAt: new Date() }
  ]),
  createBlogPost: vi.fn().mockResolvedValue({ id: 1 }),
  getAllBlogPosts: vi.fn().mockResolvedValue([]),
  getPublishedBlogPosts: vi.fn().mockResolvedValue([
    { id: 1, title: 'Test Post', slug: 'test-post', status: 'published' }
  ]),
  getBlogPostBySlug: vi.fn().mockResolvedValue({ id: 1, title: 'Test', slug: 'test' }),
  updateBlogPost: vi.fn().mockResolvedValue(true),
  createCoupon: vi.fn().mockResolvedValue({ id: 1 }),
  getCouponByCode: vi.fn().mockImplementation((code: string) => {
    if (code === 'VALID10') {
      return Promise.resolve({
        id: 1,
        code: 'VALID10',
        discountType: 'percentage',
        discountValue: '10',
        isActive: true,
        usageLimit: 100,
        usedCount: 0
      });
    }
    if (code === 'EXPIRED') {
      return Promise.resolve({
        id: 2,
        code: 'EXPIRED',
        discountType: 'percentage',
        discountValue: '10',
        isActive: true,
        expiresAt: new Date('2020-01-01')
      });
    }
    return Promise.resolve(null);
  }),
  getAllCoupons: vi.fn().mockResolvedValue([]),
  createEmailSubscriber: vi.fn().mockResolvedValue({ id: 1 }),
  getAllEmailSubscribers: vi.fn().mockResolvedValue([{ id: 1, email: 'test@test.com' }]),
  createAffiliate: vi.fn().mockResolvedValue({ id: 1 }),
  getAffiliateByUserId: vi.fn().mockResolvedValue(null),
  getAllAffiliates: vi.fn().mockResolvedValue([]),
  updateAffiliateEarnings: vi.fn().mockResolvedValue(true),
  createAffiliateSale: vi.fn().mockResolvedValue({ id: 1 }),
  getAffiliateSales: vi.fn().mockResolvedValue([]),
  createSocialPost: vi.fn().mockResolvedValue({ id: 1 }),
  getPendingSocialPosts: vi.fn().mockResolvedValue([]),
  getAllSocialPosts: vi.fn().mockResolvedValue([]),
  createReviewRequest: vi.fn().mockResolvedValue({ id: 1 }),
  getPendingReviewRequests: vi.fn().mockResolvedValue([]),
  createGamePlay: vi.fn().mockResolvedValue({ id: 1 }),
  getGamePlaysByUser: vi.fn().mockResolvedValue([])
}));

// Mock LLM
vi.mock('./_core/llm', () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{
      message: {
        content: JSON.stringify({
          title: 'Test Blog Post',
          slug: 'test-blog-post',
          excerpt: 'Test excerpt',
          content: 'Test content',
          category: 'Travel Tips'
        })
      }
    }]
  })
}));

// Mock Stripe
vi.mock('stripe', () => ({
  default: vi.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue({
          url: 'https://checkout.stripe.com/test'
        })
      }
    }
  }))
}));

type CookieCall = {
  name: string;
  options: Record<string, unknown>;
};

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: { origin: 'https://example.com' },
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAuthContext(role: 'user' | 'admin' = 'user'): { ctx: TrpcContext; clearedCookies: CookieCall[] } {
  const clearedCookies: CookieCall[] = [];

  const user: AuthenticatedUser = {
    id: 1,
    openId: "sample-user",
    email: "sample@example.com",
    name: "Sample User",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: { origin: 'https://example.com' },
    } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };

  return { ctx, clearedCookies };
}

describe("auth.logout", () => {
  it("clears the session cookie and reports success", async () => {
    const { ctx, clearedCookies } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.logout();

    expect(result).toEqual({ success: true });
    expect(clearedCookies).toHaveLength(1);
    expect(clearedCookies[0]?.name).toBe(COOKIE_NAME);
  });
});

describe("auth.me", () => {
  it("returns null for unauthenticated users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();

    expect(result).toBeNull();
  });

  it("returns user for authenticated users", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();

    expect(result).not.toBeNull();
    expect(result?.email).toBe("sample@example.com");
  });
});

describe("coupons.validate", () => {
  it("returns valid for a valid coupon", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.coupons.validate({ code: 'VALID10' });

    expect(result.valid).toBe(true);
    expect(result.discount).toBe('10');
    expect(result.type).toBe('percentage');
  });

  it("returns invalid for non-existent coupon", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.coupons.validate({ code: 'INVALID' });

    expect(result.valid).toBe(false);
    expect(result.message).toBe('Invalid coupon code');
  });

  it("returns invalid for expired coupon", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.coupons.validate({ code: 'EXPIRED' });

    expect(result.valid).toBe(false);
    expect(result.message).toBe('Coupon has expired');
  });
});

describe("blog.getAll", () => {
  it("returns published blog posts", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.blog.getAll();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].status).toBe('published');
  });
});

describe("emails.subscribe", () => {
  it("creates a new email subscriber", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.emails.subscribe({ 
      email: 'newuser@test.com',
      source: 'popup'
    });

    expect(result).toHaveProperty('id');
  });
});

describe("admin.getStats", () => {
  it("returns stats for admin users", async () => {
    const { ctx } = createAuthContext('admin');
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.getStats();

    expect(result).toHaveProperty('todayRevenue');
    expect(result).toHaveProperty('todayBookings');
    expect(result).toHaveProperty('totalBookings');
    expect(result).toHaveProperty('emailSubscribers');
  });

  it("throws error for non-admin users", async () => {
    const { ctx } = createAuthContext('user');
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.getStats()).rejects.toThrow('Unauthorized');
  });
});

describe("game.play", () => {
  it("records a game play", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.game.play({
      sessionId: 'test-session-123',
      result: 'win',
      prizeType: 'discount_10',
      couponCode: 'GAME10-ABC123'
    });

    expect(result).toHaveProperty('id');
  });
});

describe("affiliates.register", () => {
  it("creates affiliate for authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.affiliates.register({
      paypalEmail: 'affiliate@paypal.com'
    });

    expect(result).toHaveProperty('id');
  });
});
