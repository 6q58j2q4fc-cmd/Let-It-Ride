import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { 
  createBooking, getBookingsByUser, getAllBookings, updateBookingStatus,
  createOrder, getOrdersByUser, getAllOrders,
  createBlogPost, getAllBlogPosts, getPublishedBlogPosts, getBlogPostBySlug, updateBlogPost,
  createCoupon, getCouponByCode, getAllCoupons,
  createEmailSubscriber, getAllEmailSubscribers,
  createAffiliate, getAffiliateByUserId, getAllAffiliates, updateAffiliateEarnings,
  createAffiliateSale, getAffiliateSales,
  createSocialPost, getPendingSocialPosts, getAllSocialPosts,
  createReviewRequest, getPendingReviewRequests,
  createGamePlay, getGamePlaysByUser,
  createServiceAppointment, getAllServiceAppointments, getServiceAppointmentById, updateServiceAppointment,
  createAdminCredential, verifyAdminCredentials, getAdminByUsername, getAdminById, getAllAdmins, updateAdminPassword,
  createSiteImage, getAllSiteImages, getSiteImagesByCategory, getSiteImageById, updateSiteImage, deleteSiteImage, searchSiteImages
} from "./db";
import { invokeLLM } from "./_core/llm";
import Stripe from "stripe";
import { ENV } from "./_core/env";
import { generateDailyBlogPost, generateDailySocialPost, runDailyAutomation } from "./automation";
import { notifyOwner } from "./_core/notification";
import jwt from 'jsonwebtoken';

const stripe = new Stripe(ENV.stripeSecretKey || "", { apiVersion: "2025-12-15.clover" });

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Tours & Bookings
  bookings: router({
    create: publicProcedure
      .input(z.object({
        tourId: z.number(),
        tourDate: z.string(),
        tourTime: z.string(),
        guests: z.number().min(1),
        customerName: z.string(),
        customerEmail: z.string().email(),
        customerPhone: z.string().optional(),
        totalPrice: z.string(),
        specialRequests: z.string().optional(),
        affiliateCode: z.string().optional()
      }))
      .mutation(async ({ input, ctx }) => {
        const booking = await createBooking({
          tourId: input.tourId,
          bookingDate: new Date(input.tourDate),
          bookingTime: input.tourTime,
          guests: input.guests,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          totalPrice: input.totalPrice,
          specialRequests: input.specialRequests,
          affiliateCode: input.affiliateCode,
          userId: ctx.user?.id,
          status: 'pending'
        });
        return booking;
      }),
    
    getMyBookings: protectedProcedure.query(async ({ ctx }) => {
      return getBookingsByUser(ctx.user.id);
    }),
    
    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') throw new Error('Unauthorized');
      return getAllBookings();
    }),
    
    updateStatus: protectedProcedure
      .input(z.object({ id: z.number(), status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']) }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new Error('Unauthorized');
        return updateBookingStatus(input.id, input.status);
      }),
    
    createCheckoutSession: publicProcedure
      .input(z.object({
        tourId: z.number(),
        tourName: z.string(),
        tourDate: z.string(),
        tourTime: z.string(),
        guests: z.number(),
        customerName: z.string(),
        customerEmail: z.string(),
        customerPhone: z.string().optional(),
        totalPrice: z.number(),
        specialRequests: z.string().optional(),
        affiliateCode: z.string().optional()
      }))
      .mutation(async ({ input, ctx }) => {
        const origin = ctx.req.headers.origin || 'http://localhost:3000';
        
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [{
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${input.tourName} Tour`,
                description: `${input.guests} guests on ${input.tourDate} at ${input.tourTime}`,
              },
              unit_amount: Math.round(input.totalPrice * 100),
            },
            quantity: 1,
          }],
          mode: 'payment',
          success_url: `${origin}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/tours`,
          customer_email: input.customerEmail,
          client_reference_id: ctx.user?.id?.toString(),
          allow_promotion_codes: true,
          metadata: {
            type: 'tour_booking',
            tourId: input.tourId.toString(),
            tourName: input.tourName,
            tourDate: input.tourDate,
            tourTime: input.tourTime,
            guests: input.guests.toString(),
            customerName: input.customerName,
            customerPhone: input.customerPhone || '',
            specialRequests: input.specialRequests || '',
            affiliateCode: input.affiliateCode || '',
            user_id: ctx.user?.id?.toString() || ''
          }
        });
        
        return { url: session.url };
      })
  }),

  // E-Commerce Orders
  orders: router({
    create: publicProcedure
      .input(z.object({
        items: z.array(z.object({
          productId: z.number(),
          productName: z.string(),
          quantity: z.number(),
          price: z.number()
        })),
        customerName: z.string(),
        customerEmail: z.string().email(),
        customerPhone: z.string().optional(),
        shippingAddress: z.string().optional(),
        subtotal: z.string(),
        total: z.string(),
        affiliateCode: z.string().optional()
      }))
      .mutation(async ({ input, ctx }) => {
        const order = await createOrder({
          ...input,
          userId: ctx.user?.id,
          status: 'pending'
        });
        return order;
      }),
    
    getMyOrders: protectedProcedure.query(async ({ ctx }) => {
      return getOrdersByUser(ctx.user.id);
    }),
    
    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') throw new Error('Unauthorized');
      return getAllOrders();
    }),
    
    createCheckoutSession: publicProcedure
      .input(z.object({
        items: z.array(z.object({
          productId: z.number(),
          productName: z.string(),
          quantity: z.number(),
          price: z.number()
        })),
        customerName: z.string(),
        customerEmail: z.string(),
        customerPhone: z.string().optional(),
        shippingAddress: z.string().optional(),
        subtotal: z.number(),
        total: z.number(),
        couponCode: z.string().optional(),
        affiliateCode: z.string().optional()
      }))
      .mutation(async ({ input, ctx }) => {
        const origin = ctx.req.headers.origin || 'http://localhost:3000';
        
        const lineItems = input.items.map(item => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.productName,
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        }));
        
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: lineItems,
          mode: 'payment',
          success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/cart`,
          customer_email: input.customerEmail,
          client_reference_id: ctx.user?.id?.toString(),
          allow_promotion_codes: true,
          metadata: {
            type: 'product_order',
            customerName: input.customerName,
            customerPhone: input.customerPhone || '',
            shippingAddress: input.shippingAddress || '',
            couponCode: input.couponCode || '',
            affiliateCode: input.affiliateCode || '',
            user_id: ctx.user?.id?.toString() || ''
          }
        });
        
        return { url: session.url };
      })
  }),

  // Blog
  blog: router({
    getAll: publicProcedure.query(async () => {
      return getPublishedBlogPosts();
    }),
    
    getAllAdmin: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') throw new Error('Unauthorized');
      return getAllBlogPosts(false);
    }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return getBlogPostBySlug(input.slug);
      }),
    
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string(),
        excerpt: z.string(),
        content: z.string(),
        category: z.string(),
        featuredImage: z.string().optional(),
        status: z.enum(['draft', 'published']).default('draft')
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new Error('Unauthorized');
        return createBlogPost({ ...input, authorId: ctx.user.id });
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        status: z.enum(['draft', 'published']).optional()
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new Error('Unauthorized');
        return updateBlogPost(input.id, input);
      }),
    
    generatePost: protectedProcedure
      .input(z.object({ topic: z.string().optional() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new Error('Unauthorized');
        
        const topics = [
          'Best e-bike trails in Bend Oregon',
          'Why electric bikes are perfect for exploring Bend',
          'Top 10 things to do in Bend on an e-bike',
          'Deschutes River Trail e-bike guide',
          'Family-friendly e-bike adventures in Central Oregon',
          'Bend brewery tour by e-bike',
          'Pedego electric bike maintenance tips',
          'Benefits of e-bike tours vs traditional bike tours'
        ];
        
        const topic = input.topic || topics[Math.floor(Math.random() * topics.length)];
        
        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: `You are an SEO content writer for Let It Ride Electric Bikes, a tour and e-bike shop in Bend, Oregon. Write engaging, SEO-optimized blog posts that help drive organic traffic and encourage tour bookings. Include relevant keywords naturally. The business offers guided e-bike tours (Short & Sweet $75, Deschutes River $100, Taste of Bend $150), e-bike rentals, and Pedego e-bike sales.`
            },
            {
              role: 'user',
              content: `Write a comprehensive, SEO-optimized blog post about: ${topic}

Return a JSON object with these fields:
- title: SEO-optimized title (60 chars max)
- slug: URL-friendly slug
- excerpt: Meta description (160 chars max)
- content: Full article in markdown (1000+ words)
- category: One of: Trails & Routes, Travel Tips, E-Bike Guide, Local Guide, Family Fun`
            }
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'blog_post',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  slug: { type: 'string' },
                  excerpt: { type: 'string' },
                  content: { type: 'string' },
                  category: { type: 'string' }
                },
                required: ['title', 'slug', 'excerpt', 'content', 'category'],
                additionalProperties: false
              }
            }
          }
        });
        
        const content = response.choices[0].message.content;
        const postData = JSON.parse(typeof content === 'string' ? content : '{}');
        
        const post = await createBlogPost({
          ...postData,
          authorId: ctx.user.id,
          status: 'draft',
          isAiGenerated: true
        });
        
        return post;
      })
  }),

  // Coupons
  coupons: router({
    validate: publicProcedure
      .input(z.object({ code: z.string() }))
      .query(async ({ input }) => {
        const coupon = await getCouponByCode(input.code);
        if (!coupon) return { valid: false, message: 'Invalid coupon code' };
        if (!coupon.isActive) return { valid: false, message: 'Coupon is no longer active' };
        if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
          return { valid: false, message: 'Coupon has expired' };
        }
        if (coupon.usageLimit && (coupon.usedCount || 0) >= coupon.usageLimit) {
          return { valid: false, message: 'Coupon usage limit reached' };
        }
        return { 
          valid: true, 
          discount: coupon.discountValue,
          type: coupon.discountType
        };
      }),
    
    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') throw new Error('Unauthorized');
      return getAllCoupons();
    }),
    
    create: protectedProcedure
      .input(z.object({
        code: z.string(),
        discountType: z.enum(['percentage', 'fixed', 'bogo']),
        discountValue: z.string(),
        usageLimit: z.number().optional(),
        expiresAt: z.date().optional()
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new Error('Unauthorized');
        return createCoupon(input);
      }),
    
    generateWelcome: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        const code = 'WELCOME5-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        await createCoupon({
          code,
          discountType: 'percentage',
          discountValue: '5',
          usageLimit: 1,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          source: 'email_signup'
        });
        await createEmailSubscriber({ email: input.email, source: 'popup', couponCode: code });
        return { code };
      })
  }),

  // Email Subscribers
  emails: router({
    subscribe: publicProcedure
      .input(z.object({ 
        email: z.string().email(),
        source: z.enum(['popup', 'footer', 'checkout', 'game']).optional()
      }))
      .mutation(async ({ input }) => {
        return createEmailSubscriber(input);
      }),
    
    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') throw new Error('Unauthorized');
      return getAllEmailSubscribers();
    })
  }),

  // Affiliates
  affiliates: router({
    register: protectedProcedure
      .input(z.object({ paypalEmail: z.string().email() }))
      .mutation(async ({ ctx, input }) => {
        const code = 'LETITRIDE-' + ctx.user.id;
        return createAffiliate({
          userId: ctx.user.id,
          code,
          paypalEmail: input.paypalEmail,
          status: 'pending'
        });
      }),
    
    getMyStats: protectedProcedure.query(async ({ ctx }) => {
      const affiliate = await getAffiliateByUserId(ctx.user.id);
      if (!affiliate) return null;
      const sales = await getAffiliateSales(affiliate.id);
      return { affiliate, sales };
    }),
    
    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') throw new Error('Unauthorized');
      return getAllAffiliates();
    }),
    
    recordSale: publicProcedure
      .input(z.object({
        affiliateCode: z.string(),
        saleType: z.enum(['click', 'booking', 'order']),
        saleAmount: z.number(),
        orderId: z.number()
      }))
      .mutation(async ({ input }) => {
        const affiliates = await getAllAffiliates();
        const affiliate = affiliates.find(a => a.code === input.affiliateCode);
        if (!affiliate) return { success: false };
        
        const commission = input.saleAmount * 0.10;
        await createAffiliateSale({
          affiliateId: affiliate.id,
          type: input.saleType,
          referenceId: input.orderId,
          amount: input.saleAmount.toFixed(2),
          commission: commission.toFixed(2)
        });
        await updateAffiliateEarnings(affiliate.id, commission);
        return { success: true, commission };
      })
  }),

  // Social Media
  social: router({
    getQueue: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') throw new Error('Unauthorized');
      return getPendingSocialPosts();
    }),
    
    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') throw new Error('Unauthorized');
      return getAllSocialPosts();
    }),
    
    create: protectedProcedure
      .input(z.object({
        platform: z.enum(['instagram', 'facebook', 'both']),
        content: z.string(),
        imageUrl: z.string().optional(),
        link: z.string().optional(),
        scheduledAt: z.date().optional()
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new Error('Unauthorized');
        return createSocialPost(input);
      }),
    
    generatePost: protectedProcedure.mutation(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') throw new Error('Unauthorized');
      
      const response = await invokeLLM({
        messages: [
          {
            role: 'system',
            content: 'You are a social media manager for Let It Ride Electric Bikes in Bend, Oregon. Create engaging social media posts that drive engagement and bookings.'
          },
          {
            role: 'user',
            content: `Create a social media post for Instagram/Facebook. Include:
- Engaging caption (under 200 chars)
- Relevant hashtags
- Call to action

Return JSON with: caption, hashtags (array), callToAction`
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'social_post',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                caption: { type: 'string' },
                hashtags: { type: 'array', items: { type: 'string' } },
                callToAction: { type: 'string' }
              },
              required: ['caption', 'hashtags', 'callToAction'],
              additionalProperties: false
            }
          }
        }
      });
      
      const msgContent = response.choices[0].message.content;
      const postData = JSON.parse(typeof msgContent === 'string' ? msgContent : '{}');
      const content = `${postData.caption}\n\n${postData.callToAction}\n\n${postData.hashtags.join(' ')}`;
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      
      return createSocialPost({
        platform: 'both',
        content,
        scheduledAt: tomorrow
      });
    })
  }),

  // Review Requests
  reviews: router({
    createRequest: publicProcedure
      .input(z.object({
        bookingId: z.number(),
        customerEmail: z.string().email(),
        customerName: z.string()
      }))
      .mutation(async ({ input }) => {
        return createReviewRequest(input);
      }),
    
    getPending: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') throw new Error('Unauthorized');
      return getPendingReviewRequests();
    })
  }),

  // Game
  game: router({
    play: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        result: z.enum(['win', 'lose']),
        prizeType: z.enum(['discount_10', 'discount_15', 'discount_20', 'discount_25', 'bogo', 'free_tour', 'none']).optional(),
        couponCode: z.string().optional(),
        handDetails: z.any().optional()
      }))
      .mutation(async ({ input, ctx }) => {
        const play = await createGamePlay({
          sessionId: input.sessionId,
          userId: ctx.user?.id,
          result: input.result,
          prizeType: input.prizeType,
          couponCode: input.couponCode,
          handDetails: input.handDetails
        });
        
        if (input.couponCode && input.prizeType && input.prizeType !== 'none') {
          const discountMap: Record<string, string> = {
            'discount_10': '10', 'discount_15': '15', 'discount_20': '20',
            'discount_25': '25', 'bogo': '50', 'free_tour': '100'
          };
          
          await createCoupon({
            code: input.couponCode,
            discountType: input.prizeType === 'bogo' ? 'bogo' : 'percentage',
            discountValue: discountMap[input.prizeType] || '5',
            usageLimit: 1,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            source: 'game_win'
          });
        }
        
        return play;
      }),
    
    getMyPlays: protectedProcedure.query(async ({ ctx }) => {
      return getGamePlaysByUser(ctx.user.id);
    })
  }),

  // Automation
  automation: router({
    generateBlogPost: protectedProcedure.mutation(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') throw new Error('Unauthorized');
      return generateDailyBlogPost();
    }),
    
    generateSocialPost: protectedProcedure.mutation(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') throw new Error('Unauthorized');
      return generateDailySocialPost();
    }),
    
    runDaily: protectedProcedure.mutation(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') throw new Error('Unauthorized');
      return runDailyAutomation();
    })
  }),

  // Service Appointments
  service: router({
    requestAppointment: publicProcedure
      .input(z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string(),
        bikeType: z.string(),
        bikeBrand: z.string().optional(),
        bikeModel: z.string().optional(),
        serviceType: z.string(),
        preferredDate: z.string(),
        preferredTime: z.string().optional(),
        issueDescription: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await createServiceAppointment({
          customerName: input.name,
          customerEmail: input.email,
          customerPhone: input.phone,
          bikeType: input.bikeType,
          bikeBrand: input.bikeBrand,
          bikeModel: input.bikeModel,
          serviceType: input.serviceType,
          preferredDate: new Date(input.preferredDate),
          preferredTime: input.preferredTime,
          issueDescription: input.issueDescription,
          status: 'pending'
        });

        // Send notification to owner about new service request
        const serviceTypeLabels: Record<string, string> = {
          'basic-tuneup': 'Basic Tune-Up',
          'standard-tuneup': 'Standard Tune-Up',
          'premium-tuneup': 'Premium Tune-Up',
          'ebike-build': 'E-Bike Build & Safety Check',
          'flat-repair': 'Flat Repair',
          'brake-adjustment': 'Brake Adjustment',
          'battery-diagnostic': 'Battery Diagnostic',
          'motor-diagnostic': 'Motor Diagnostic',
          'general-repair': 'General Repair',
        };

        const formattedDate = new Date(input.preferredDate).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        try {
          await notifyOwner({
            title: `🔧 New Service Request from ${input.name}`,
            content: `**New Service Appointment Request**\n\n` +
              `**Customer:** ${input.name}\n` +
              `**Email:** ${input.email}\n` +
              `**Phone:** ${input.phone}\n\n` +
              `**Service:** ${serviceTypeLabels[input.serviceType] || input.serviceType}\n` +
              `**Bike Type:** ${input.bikeType}\n` +
              `${input.bikeBrand ? `**Brand:** ${input.bikeBrand}\n` : ''}` +
              `${input.bikeModel ? `**Model:** ${input.bikeModel}\n` : ''}\n` +
              `**Preferred Date:** ${formattedDate}\n` +
              `${input.preferredTime ? `**Preferred Time:** ${input.preferredTime}\n` : ''}\n` +
              `${input.issueDescription ? `**Issue Description:**\n${input.issueDescription}\n\n` : ''}` +
              `---\n` +
              `Please review and confirm this appointment in the admin panel.`
          });
        } catch (e) {
          console.error('Failed to send service notification:', e);
        }

        return result;
      }),
    
    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') throw new Error('Unauthorized');
      return getAllServiceAppointments();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') throw new Error('Unauthorized');
        return getServiceAppointmentById(input.id);
      }),
    
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']),
        notes: z.string().optional(),
        estimatedCost: z.string().optional(),
        actualCost: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') throw new Error('Unauthorized');
        const updateData: Record<string, unknown> = { status: input.status };
        if (input.notes) updateData.notes = input.notes;
        if (input.estimatedCost) updateData.estimatedCost = input.estimatedCost;
        if (input.actualCost) updateData.actualCost = input.actualCost;
        if (input.status === 'completed') updateData.completedAt = new Date();
        return updateServiceAppointment(input.id, updateData);
      })
  }),

  // Customer Service Chatbot
  chat: router({
    send: publicProcedure
      .input(z.object({
        messages: z.array(z.object({
          role: z.enum(['system', 'user', 'assistant']),
          content: z.string()
        }))
      }))
      .mutation(async ({ input }) => {
        const systemPrompt = `You are a friendly and helpful customer service assistant for Let It Ride Electric Bikes in Bend, Oregon. You help customers with:

**About Us:**
- Let It Ride is Bend's premier e-bike shop offering tours, rentals, sales, and service
- Located at 25 NW Minnesota Ave #6, Bend, OR 97703
- Phone: (541) 647-2331
- Hours: Open daily 9am-6pm (seasonal variations)
- We are an authorized Pedego Electric Bikes dealer

**Tours (All include helmet & bike):**
- Short & Sweet Tour: 1.5 hours, $75/person - Perfect intro to Bend
- Deschutes River Tour: 2 hours, $100/person - Scenic river views, wildlife
- Taste of Bend Tour: 2 hours, $150/person - Brewery & food tasting
- Best of Bend Tour: 3 hours, $175/person - Comprehensive city tour
- Sunset Tour: 2 hours, $125/person - Evening ride with views

**Rentals:**
- 2-hour rental: $50
- Half-day (4 hours): $75
- Full-day (8 hours): $100
- Multi-day discounts available
- All rentals include helmet, lock, and brief orientation

**E-Bike Sales:**
- We sell Pedego Electric Bikes - America's #1 selling e-bike brand
- Models include: Cruiser, Interceptor, City Commuter, Boomerang, Element, Tandem, Cargo, Ridge Rider, Trail Tracker
- Prices range from $2,495 to $5,995+
- Financing available
- Test rides always welcome!

**Service:**
- Basic Tune-Up: $60 - Safety check, tire inflation, brake adjustment
- Standard Tune-Up: $90 - Includes drivetrain cleaning
- Premium Tune-Up: $120 - Complete overhaul
- E-Bike Build & Safety Check: $125-$250
- We service all e-bike brands, not just Pedego
- Online service booking available on our website

**Fun Feature:**
If someone wants to play a game or have fun, tell them they can type "play game" to play the Let It Ride card game right in the chat!

Be conversational, enthusiastic about e-bikes, and always try to help customers find the right tour, rental, or bike for their needs. If you don't know something specific, suggest they call us or visit the shop.`;

        // Ensure system prompt is first
        const messagesWithSystem = [
          { role: 'system' as const, content: systemPrompt },
          ...input.messages.filter(m => m.role !== 'system')
        ];

        const response = await invokeLLM({
          messages: messagesWithSystem
        });

        const messageContent = response.choices[0]?.message?.content;
        let content = "I'm sorry, I couldn't process that. Please try again or call us at (541) 647-2331.";
        
        if (typeof messageContent === 'string') {
          content = messageContent;
        } else if (Array.isArray(messageContent)) {
          // Extract text from content array
          const textPart = messageContent.find((part): part is { type: 'text'; text: string } => 
            typeof part === 'object' && 'type' in part && part.type === 'text'
          );
          if (textPart) {
            content = textPart.text;
          }
        }

        return { content };
      })
  }),

  // Admin Stats
  admin: router({
    getStats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') throw new Error('Unauthorized');
      
      const bookings = await getAllBookings();
      const orders = await getAllOrders();
      const subscribers = await getAllEmailSubscribers();
      const affiliates = await getAllAffiliates();
      
      const today = new Date().toDateString();
      const todayBookings = bookings.filter(b => new Date(b.createdAt).toDateString() === today);
      const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
      
      return {
        todayRevenue: todayBookings.reduce((sum, b) => sum + parseFloat(b.totalPrice), 0) + 
                      todayOrders.reduce((sum, o) => sum + parseFloat(o.total), 0),
        todayBookings: todayBookings.length,
        totalBookings: bookings.length,
        totalOrders: orders.length,
        emailSubscribers: subscribers.length,
        totalAffiliates: affiliates.length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length
      };
    })
  }),

  // Custom Admin Authentication (separate from Manus OAuth)
  adminAuth: router({
    login: publicProcedure
      .input(z.object({
        username: z.string().min(1),
        password: z.string().min(1)
      }))
      .mutation(async ({ input, ctx }) => {
        const admin = await verifyAdminCredentials(input.username, input.password);
        if (!admin) {
          throw new Error('Invalid username or password');
        }
        
        // Set admin session cookie
        const token = jwt.sign(
          { adminId: admin.id, username: admin.username, isAdmin: true },
          ENV.jwtSecret || 'admin-secret-key',
          { expiresIn: '24h' }
        );
        
        ctx.res.cookie('admin_session', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        
        return {
          success: true,
          admin: {
            id: admin.id,
            username: admin.username,
            displayName: admin.displayName,
            email: admin.email
          }
        };
      }),
    
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie('admin_session');
      return { success: true };
    }),
    
    me: publicProcedure.query(async ({ ctx }) => {
      const token = ctx.req.cookies?.admin_session;
      if (!token) return null;
      
      try {
        const decoded = jwt.verify(token, ENV.jwtSecret || 'admin-secret-key') as { adminId: number };
        const admin = await getAdminById(decoded.adminId);
        if (!admin || !admin.isActive) return null;
        
        return {
          id: admin.id,
          username: admin.username,
          displayName: admin.displayName,
          email: admin.email
        };
      } catch {
        return null;
      }
    }),
    
    createAdmin: publicProcedure
      .input(z.object({
        username: z.string().min(3),
        password: z.string().min(8),
        displayName: z.string().optional(),
        email: z.string().email().optional(),
        setupKey: z.string() // Required for first-time setup
      }))
      .mutation(async ({ input }) => {
        // Check setup key for security
        if (input.setupKey !== 'letitride-admin-setup-2024') {
          throw new Error('Invalid setup key');
        }
        
        // Check if username exists
        const existing = await getAdminByUsername(input.username);
        if (existing) {
          throw new Error('Username already exists');
        }
        
        await createAdminCredential({
          username: input.username,
          password: input.password,
          displayName: input.displayName,
          email: input.email
        });
        
        return { success: true };
      }),
    
    changePassword: publicProcedure
      .input(z.object({
        currentPassword: z.string(),
        newPassword: z.string().min(8)
      }))
      .mutation(async ({ input, ctx }) => {
        const token = ctx.req.cookies?.admin_session;
        if (!token) throw new Error('Not authenticated');
        
        const decoded = jwt.verify(token, ENV.jwtSecret || 'admin-secret-key') as { adminId: number; username: string };
        
        // Verify current password
        const admin = await verifyAdminCredentials(decoded.username, input.currentPassword);
        if (!admin) throw new Error('Current password is incorrect');
        
        await updateAdminPassword(decoded.adminId, input.newPassword);
        return { success: true };
      }),
    
    getAll: publicProcedure.query(async ({ ctx }) => {
      const token = ctx.req.cookies?.admin_session;
      if (!token) throw new Error('Not authenticated');
      
      return getAllAdmins();
    })
  }),

  // Site Images Management
  siteImages: router({
    getAll: publicProcedure.query(async ({ ctx }) => {
      const token = ctx.req.cookies?.admin_session;
      if (!token) throw new Error('Not authenticated');
      return getAllSiteImages();
    }),
    
    getByCategory: publicProcedure
      .input(z.object({
        category: z.enum(['tours', 'rentals', 'products', 'blog', 'gallery', 'hero', 'about', 'general'])
      }))
      .query(async ({ input, ctx }) => {
        const token = ctx.req.cookies?.admin_session;
        if (!token) throw new Error('Not authenticated');
        return getSiteImagesByCategory(input.category);
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const token = ctx.req.cookies?.admin_session;
        if (!token) throw new Error('Not authenticated');
        return getSiteImageById(input.id);
      }),
    
    create: publicProcedure
      .input(z.object({
        name: z.string(),
        category: z.enum(['tours', 'rentals', 'products', 'blog', 'gallery', 'hero', 'about', 'general']),
        url: z.string(),
        fileKey: z.string().optional(),
        altText: z.string().optional(),
        description: z.string().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
        fileSize: z.number().optional(),
        mimeType: z.string().optional(),
        usedIn: z.array(z.string()).optional()
      }))
      .mutation(async ({ input, ctx }) => {
        const token = ctx.req.cookies?.admin_session;
        if (!token) throw new Error('Not authenticated');
        
        const decoded = jwt.verify(token, ENV.jwtSecret || 'admin-secret-key') as { adminId: number };
        
        return createSiteImage({
          ...input,
          uploadedBy: decoded.adminId
        });
      }),
    
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        category: z.enum(['tours', 'rentals', 'products', 'blog', 'gallery', 'hero', 'about', 'general']).optional(),
        url: z.string().optional(),
        altText: z.string().optional(),
        description: z.string().optional(),
        usedIn: z.array(z.string()).optional()
      }))
      .mutation(async ({ input, ctx }) => {
        const token = ctx.req.cookies?.admin_session;
        if (!token) throw new Error('Not authenticated');
        
        const { id, ...data } = input;
        return updateSiteImage(id, data);
      }),
    
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const token = ctx.req.cookies?.admin_session;
        if (!token) throw new Error('Not authenticated');
        return deleteSiteImage(input.id);
      }),
    
    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input, ctx }) => {
        const token = ctx.req.cookies?.admin_session;
        if (!token) throw new Error('Not authenticated');
        return searchSiteImages(input.query);
      })
  })
});

export type AppRouter = typeof appRouter;
