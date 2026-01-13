import { describe, expect, it, vi } from "vitest";

// Mock the LLM and DB functions
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{
      message: {
        content: JSON.stringify({
          title: "Best E-Bike Trails in Bend Oregon",
          excerpt: "Discover the most scenic e-bike trails in Bend, Oregon.",
          content: "# Best E-Bike Trails\\n\\nBend, Oregon offers amazing trails...",
          metaTitle: "Best E-Bike Trails in Bend | Let It Ride",
          metaDescription: "Explore the top e-bike trails in Bend, Oregon with our guide.",
          tags: ["e-bike", "trails", "bend-oregon"]
        })
      }
    }]
  })
}));

vi.mock("./db", () => ({
  createBlogPost: vi.fn().mockResolvedValue({ id: 1 }),
  createSocialPost: vi.fn().mockResolvedValue({ id: 1 }),
  getPublishedBlogPosts: vi.fn().mockResolvedValue([
    { id: 1, title: "Test Post", slug: "test-post" }
  ])
}));

describe("Automation Module", () => {
  describe("Blog Post Generation", () => {
    it("should have blog topics defined", async () => {
      const { BLOG_TOPICS } = await import("./automation");
      expect(BLOG_TOPICS).toBeDefined();
      expect(Array.isArray(BLOG_TOPICS)).toBe(true);
      expect(BLOG_TOPICS.length).toBeGreaterThan(0);
    });

    it("should have social templates defined", async () => {
      const { SOCIAL_TEMPLATES } = await import("./automation");
      expect(SOCIAL_TEMPLATES).toBeDefined();
      expect(Array.isArray(SOCIAL_TEMPLATES)).toBe(true);
      expect(SOCIAL_TEMPLATES.length).toBeGreaterThan(0);
    });

    it("should export generateDailyBlogPost function", async () => {
      const { generateDailyBlogPost } = await import("./automation");
      expect(typeof generateDailyBlogPost).toBe("function");
    });

    it("should export generateDailySocialPost function", async () => {
      const { generateDailySocialPost } = await import("./automation");
      expect(typeof generateDailySocialPost).toBe("function");
    });

    it("should export runDailyAutomation function", async () => {
      const { runDailyAutomation } = await import("./automation");
      expect(typeof runDailyAutomation).toBe("function");
    });
  });

  describe("Blog Topics", () => {
    it("should contain Bend Oregon related topics", async () => {
      const { BLOG_TOPICS } = await import("./automation");
      const bendTopics = BLOG_TOPICS.filter(topic => 
        topic.toLowerCase().includes("bend") || 
        topic.toLowerCase().includes("oregon") ||
        topic.toLowerCase().includes("deschutes")
      );
      expect(bendTopics.length).toBeGreaterThan(0);
    });

    it("should contain e-bike related topics", async () => {
      const { BLOG_TOPICS } = await import("./automation");
      const ebikeTopics = BLOG_TOPICS.filter(topic => 
        topic.toLowerCase().includes("e-bike") || 
        topic.toLowerCase().includes("electric")
      );
      expect(ebikeTopics.length).toBeGreaterThan(0);
    });
  });

  describe("Social Templates", () => {
    it("should contain hashtags", async () => {
      const { SOCIAL_TEMPLATES } = await import("./automation");
      const templatesWithHashtags = SOCIAL_TEMPLATES.filter(template => 
        template.includes("#")
      );
      expect(templatesWithHashtags.length).toBeGreaterThan(0);
    });

    it("should contain emojis for engagement", async () => {
      const { SOCIAL_TEMPLATES } = await import("./automation");
      const templatesWithEmojis = SOCIAL_TEMPLATES.filter(template => 
        /[\u{1F300}-\u{1F9FF}]/u.test(template)
      );
      expect(templatesWithEmojis.length).toBeGreaterThan(0);
    });
  });
});
