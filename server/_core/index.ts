import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { handleStripeWebhook } from "../stripe-webhook";
import { handleSquareWebhook } from "../square-webhook";
import { generateSitemap, generateRSSFeed, generateAtomFeed, generateRobotsTxt } from "../seo-feeds";
import { handleDailyCron, getAutomationStatus, healthCheck } from "../cron-handler";
import { storagePut } from "../storage";
import multer from "multer";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  
  // Stripe webhook must be before body parser for signature verification
  app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);
  
  // Square webhook must be before body parser for signature verification
  app.post('/api/square/webhook', express.raw({ type: 'application/json' }), handleSquareWebhook);
  
  // SEO feeds - sitemap, RSS, Atom, robots.txt
  app.get('/sitemap.xml', generateSitemap);
  app.get('/rss.xml', generateRSSFeed);
  app.get('/atom.xml', generateAtomFeed);
  app.get('/robots.txt', generateRobotsTxt);
  
  // Cron job endpoints for daily automation
  app.post('/api/cron/daily', handleDailyCron);
  app.get('/api/cron/status', getAutomationStatus);
  app.get('/api/cron/health', healthCheck);
  
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(cookieParser());
  
  // File upload endpoint for admin panel
  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
  
  app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
      // Verify admin session
      const token = req.cookies?.admin_session;
      if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      try {
        jwt.verify(token, process.env.JWT_SECRET || 'admin-secret-key');
      } catch {
        return res.status(401).json({ error: 'Invalid session' });
      }
      
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }
      
      const file = req.file;
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const ext = file.originalname.split('.').pop() || 'jpg';
      const fileKey = `site-images/${timestamp}-${randomSuffix}.${ext}`;
      
      const { url } = await storagePut(fileKey, file.buffer, file.mimetype);
      
      res.json({ 
        success: true, 
        url, 
        fileKey,
        fileName: file.originalname,
        mimeType: file.mimetype,
        fileSize: file.size
      });
    } catch (error) {
      console.error('[Upload] Error:', error);
      res.status(500).json({ error: 'Upload failed' });
    }
  });
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
