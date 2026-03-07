/**
 * Email notification helper for Let It Ride Electric Bikes
 * Sends email notifications for new blog posts and other events
 * Uses Nodemailer with SMTP (Gmail/SendGrid compatible)
 */
import nodemailer from 'nodemailer';

// Notification recipient for blog posts
export const BLOG_NOTIFICATION_EMAIL = 'kevin@reacohomes.com';

// Site base URL for generating article links
export const SITE_BASE_URL = process.env.VITE_SITE_URL || 'https://letitrides-jajqfnxb.manus.space';

/**
 * Create a transporter using available SMTP credentials.
 * Falls back to Ethereal (test) if no SMTP env vars are set.
 */
async function createTransporter() {
  // Use configured SMTP if available
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  // Fallback: use Ethereal test account (logs preview URL to console)
  const testAccount = await nodemailer.createTestAccount();
  console.log('[Email] No SMTP configured — using Ethereal test account');
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

export interface BlogNotificationOptions {
  title: string;
  slug: string;
  excerpt: string;
  category?: string;
  featuredImage?: string;
}

/**
 * Send a "new blog post published" notification email to kevin@reacohomes.com
 */
export async function sendBlogNotificationEmail(post: BlogNotificationOptions): Promise<boolean> {
  try {
    const transporter = await createTransporter();

    const articleUrl = `${SITE_BASE_URL}/blog/${post.slug}`;
    const imageHtml = post.featuredImage
      ? `<img src="${post.featuredImage}" alt="${post.title}" style="width:100%;max-width:600px;height:240px;object-fit:cover;border-radius:8px;margin-bottom:16px;" />`
      : '';

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Blog Post Published</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:#1a4731;padding:24px 32px;">
              <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.5px;">
                ⚡ Let It Ride Electric Bikes
              </h1>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.65);font-size:13px;">Bend, Oregon's Premier E-Bike Shop &amp; Tours</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 8px;color:#6b7280;font-size:13px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">New Blog Post Published</p>
              ${imageHtml}
              ${post.category ? `<span style="display:inline-block;padding:4px 12px;background:#e8f5ee;color:#1a4731;border-radius:20px;font-size:12px;font-weight:600;margin-bottom:12px;">${post.category}</span>` : ''}
              <h2 style="margin:0 0 12px;color:#111827;font-size:22px;font-weight:700;line-height:1.3;">${post.title}</h2>
              <p style="margin:0 0 24px;color:#4b5563;font-size:15px;line-height:1.6;">${post.excerpt}</p>
              <a href="${articleUrl}" style="display:inline-block;padding:14px 28px;background:#f59e0b;color:#1a1a1a;text-decoration:none;border-radius:50px;font-weight:700;font-size:15px;">
                Read the Full Article →
              </a>
              <p style="margin:24px 0 0;color:#9ca3af;font-size:12px;">
                Article URL: <a href="${articleUrl}" style="color:#1a4731;">${articleUrl}</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 32px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">
                This is an automated notification from Let It Ride Electric Bikes blog automation system.<br />
                25 NW Minnesota Ave #6, Bend, OR 97703 · (541) 647-2331
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const info = await transporter.sendMail({
      from: '"Let It Ride Electric Bikes" <noreply@letitridebend.com>',
      to: BLOG_NOTIFICATION_EMAIL,
      subject: `📝 New Blog Post: ${post.title}`,
      text: `New blog post published!\n\n${post.title}\n\n${post.excerpt}\n\nRead it here: ${articleUrl}`,
      html,
    });

    // Log preview URL for Ethereal test accounts
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[Email] Preview URL (Ethereal test): ${previewUrl}`);
    }

    console.log(`[Email] Blog notification sent to ${BLOG_NOTIFICATION_EMAIL} — Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send blog notification:', error);
    return false;
  }
}
