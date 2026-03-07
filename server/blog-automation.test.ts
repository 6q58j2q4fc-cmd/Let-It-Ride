import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock external dependencies
vi.mock('./_core/llm', () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{
      message: {
        content: JSON.stringify({
          title: 'Test: Best E-Bike Trails in Bend Oregon',
          excerpt: 'Discover the most scenic e-bike trails in Central Oregon.',
          content: '## Introduction\n\nBend Oregon has amazing trails...\n\n## Best Trails\n\nThe Deschutes River Trail is perfect.',
          metaTitle: 'Best E-Bike Trails Bend Oregon | Let It Ride',
          metaDescription: 'Explore the top e-bike trails in Bend, Oregon with Let It Ride Electric Bikes.',
          category: 'trails',
          tags: ['e-bike', 'trails', 'bend', 'oregon', 'cycling'],
          keywords: 'e-bike trails bend oregon, electric bike trails central oregon'
        })
      }
    }]
  })
}));

vi.mock('./_core/imageGeneration', () => ({
  generateImage: vi.fn().mockResolvedValue({
    url: 'https://example.com/generated-image.png'
  })
}));

vi.mock('./db', () => ({
  createBlogPost: vi.fn().mockResolvedValue({ id: 42, slug: 'test-slug' }),
  createSocialPost: vi.fn().mockResolvedValue({ id: 1 }),
  getPublishedBlogPosts: vi.fn().mockResolvedValue([])
}));

vi.mock('./emailNotification', () => ({
  sendBlogNotificationEmail: vi.fn().mockResolvedValue(true),
  BLOG_NOTIFICATION_EMAIL: 'kevin@reacohomes.com',
  SITE_BASE_URL: 'https://letitrides-jajqfnxb.manus.space'
}));

vi.mock('./_core/notification', () => ({
  notifyOwner: vi.fn().mockResolvedValue(true)
}));

import { generateDailyBlogPost, BLOG_TOPICS } from './automation';
import { sendBlogNotificationEmail } from './emailNotification';
import { createBlogPost } from './db';
import { generateImage } from './_core/imageGeneration';

describe('Blog Automation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have at least 20 blog topics defined', () => {
    expect(BLOG_TOPICS.length).toBeGreaterThanOrEqual(20);
  });

  it('should generate a blog post successfully', async () => {
    const result = await generateDailyBlogPost();
    expect(result.success).toBe(true);
    expect(result.title).toBeTruthy();
    expect(result.slug).toBeTruthy();
  });

  it('should call createBlogPost with required fields', async () => {
    await generateDailyBlogPost();
    expect(createBlogPost).toHaveBeenCalledOnce();
    const callArgs = vi.mocked(createBlogPost).mock.calls[0][0];
    expect(callArgs.title).toBeTruthy();
    expect(callArgs.slug).toBeTruthy();
    expect(callArgs.content).toBeTruthy();
    expect(callArgs.status).toBe('published');
    expect(callArgs.isAiGenerated).toBe(true);
  });

  it('should attempt AI image generation for each post', async () => {
    await generateDailyBlogPost();
    expect(generateImage).toHaveBeenCalledOnce();
    const prompt = vi.mocked(generateImage).mock.calls[0][0].prompt;
    expect(prompt).toContain('Bend Oregon');
  });

  it('should send email notification to kevin@reacohomes.com after publishing', async () => {
    await generateDailyBlogPost();
    expect(sendBlogNotificationEmail).toHaveBeenCalledOnce();
    const emailArgs = vi.mocked(sendBlogNotificationEmail).mock.calls[0][0];
    expect(emailArgs.title).toBeTruthy();
    expect(emailArgs.slug).toBeTruthy();
    expect(emailArgs.excerpt).toBeTruthy();
  });

  it('should use a fallback image if AI image generation fails', async () => {
    vi.mocked(generateImage).mockRejectedValueOnce(new Error('Image generation failed'));
    const result = await generateDailyBlogPost();
    expect(result.success).toBe(true);
    // Should still succeed with fallback image
    expect(result.featuredImage).toBeTruthy();
  });

  it('should include the article slug in the email notification', async () => {
    await generateDailyBlogPost();
    const emailArgs = vi.mocked(sendBlogNotificationEmail).mock.calls[0][0];
    // Slug should be URL-safe (nanoid suffix may include uppercase)
    expect(emailArgs.slug).toMatch(/^[a-zA-Z0-9-]+$/);
  });
});

describe('Email Notification Helper', () => {
  it('should export the correct notification email address', async () => {
    const { BLOG_NOTIFICATION_EMAIL } = await import('./emailNotification');
    expect(BLOG_NOTIFICATION_EMAIL).toBe('kevin@reacohomes.com');
  });

  it('should export the site base URL', async () => {
    const { SITE_BASE_URL } = await import('./emailNotification');
    expect(SITE_BASE_URL).toBeTruthy();
    expect(SITE_BASE_URL).toContain('manus.space');
  });
});
