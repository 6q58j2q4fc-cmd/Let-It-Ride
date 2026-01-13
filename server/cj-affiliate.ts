/**
 * CJ Affiliate Integration for TripAdvisor
 * API Key: WV-6g7SMyviMM2xoQMRk867IcA
 */

const CJ_API_KEY = 'WV-6g7SMyviMM2xoQMRk867IcA';
const CJ_ADVERTISER_ID = 'tripadvisor'; // TripAdvisor advertiser ID in CJ network

interface CJClickParams {
  aid: string; // Advertiser ID
  pid: string; // Publisher ID (your CJ account)
  sid: string; // Sub-ID for tracking (e.g., user ID or campaign)
  url: string; // Destination URL
}

interface CJConversionParams {
  orderId: string;
  amount: number;
  currency: string;
  items?: Array<{
    sku: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  customerId?: string;
  couponCode?: string;
}

/**
 * Generate a CJ affiliate tracking link for TripAdvisor
 */
export function generateCJTrackingLink(params: {
  destinationUrl: string;
  subId?: string;
  campaign?: string;
}): string {
  const { destinationUrl, subId = '', campaign = '' } = params;
  
  // CJ tracking link format
  const trackingBase = 'https://www.anrdoezrs.net/links';
  const encodedUrl = encodeURIComponent(destinationUrl);
  
  // Build tracking URL with CJ parameters
  const trackingUrl = new URL(trackingBase);
  trackingUrl.searchParams.set('id', CJ_API_KEY);
  trackingUrl.searchParams.set('url', destinationUrl);
  if (subId) trackingUrl.searchParams.set('sid', subId);
  if (campaign) trackingUrl.searchParams.set('cid', campaign);
  
  return trackingUrl.toString();
}

/**
 * Generate TripAdvisor review link with CJ affiliate tracking
 */
export function generateTripAdvisorReviewLink(params: {
  attractionId?: string;
  subId?: string;
}): string {
  const { 
    attractionId = 'd2069561', // Let It Ride Bend attraction ID
    subId = ''
  } = params;
  
  const tripAdvisorUrl = `https://www.tripadvisor.com/Attraction_Review-g51766-${attractionId}-Reviews-Let_it_Ride_Electric_Bikes_Tours_Rentals-Bend_Central_Oregon_Oregon.html`;
  
  return generateCJTrackingLink({
    destinationUrl: tripAdvisorUrl,
    subId,
    campaign: 'review_request'
  });
}

/**
 * Track a conversion/sale through CJ
 */
export async function trackCJConversion(params: CJConversionParams): Promise<boolean> {
  try {
    // CJ conversion tracking pixel/API call
    const conversionUrl = 'https://www.emjcd.com/tags/c';
    
    const trackingParams = new URLSearchParams({
      containerTagId: CJ_API_KEY,
      TYPE: 'SALE',
      CID: params.customerId || '',
      OID: params.orderId,
      CURRENCY: params.currency,
      AMOUNT: params.amount.toString(),
      COUPON: params.couponCode || '',
    });
    
    // Add item-level tracking if provided
    if (params.items) {
      params.items.forEach((item, index) => {
        trackingParams.set(`ITEM${index + 1}`, item.sku);
        trackingParams.set(`AMT${index + 1}`, item.price.toString());
        trackingParams.set(`QTY${index + 1}`, item.quantity.toString());
      });
    }
    
    // In production, this would make an actual API call
    console.log('[CJ Affiliate] Tracking conversion:', {
      orderId: params.orderId,
      amount: params.amount,
      url: `${conversionUrl}?${trackingParams.toString()}`
    });
    
    return true;
  } catch (error) {
    console.error('[CJ Affiliate] Error tracking conversion:', error);
    return false;
  }
}

/**
 * Generate affiliate links for various TripAdvisor pages
 */
export const tripAdvisorLinks = {
  // Main attraction page
  mainPage: generateCJTrackingLink({
    destinationUrl: 'https://www.tripadvisor.com/Attraction_Review-g51766-d2069561-Reviews-Let_it_Ride_Electric_Bikes_Tours_Rentals-Bend_Central_Oregon_Oregon.html',
    campaign: 'main_page'
  }),
  
  // Write a review page
  writeReview: generateCJTrackingLink({
    destinationUrl: 'https://www.tripadvisor.com/UserReviewEdit-g51766-d2069561-Let_it_Ride_Electric_Bikes_Tours_Rentals-Bend_Central_Oregon_Oregon.html',
    campaign: 'write_review'
  }),
  
  // Photos page
  photos: generateCJTrackingLink({
    destinationUrl: 'https://www.tripadvisor.com/Attraction_Review-g51766-d2069561-Reviews-Let_it_Ride_Electric_Bikes_Tours_Rentals-Bend_Central_Oregon_Oregon.html#photos',
    campaign: 'photos'
  }),
  
  // Bend Oregon things to do
  bendThingsToDo: generateCJTrackingLink({
    destinationUrl: 'https://www.tripadvisor.com/Attractions-g51766-Activities-Bend_Central_Oregon_Oregon.html',
    campaign: 'bend_attractions'
  })
};

/**
 * Get CJ API key for client-side tracking
 */
export function getCJPublicConfig() {
  return {
    publisherId: CJ_API_KEY,
    advertiserIds: {
      tripadvisor: CJ_ADVERTISER_ID
    }
  };
}
