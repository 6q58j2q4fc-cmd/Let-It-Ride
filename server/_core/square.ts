// Square API integration helper
import { SquareClient, SquareEnvironment, type Currency } from "square";
import { ENV } from "./env";

// Initialize Square client
function getSquareClient(): SquareClient {
  if (!ENV.squareAccessToken) {
    throw new Error("Square access token not configured");
  }

  return new SquareClient({
    token: ENV.squareAccessToken,
    environment:
      ENV.squareEnvironment === "production"
        ? SquareEnvironment.Production
        : SquareEnvironment.Sandbox,
  });
}

// Get Square client instance (lazy initialization)
let squareClient: SquareClient | null = null;

export function getClient(): SquareClient {
  if (!squareClient) {
    squareClient = getSquareClient();
  }
  return squareClient;
}

// Check if Square is configured
export function isSquareConfigured(): boolean {
  return !!(ENV.squareAccessToken && ENV.squareApplicationId);
}

// Get Square application ID for frontend
export function getSquareAppId(): string {
  return ENV.squareApplicationId;
}

// Get Square environment
export function getSquareEnvironment(): "sandbox" | "production" {
  return ENV.squareEnvironment;
}

// Get default location ID
let cachedLocationId: string | null = null;

export async function getDefaultLocationId(): Promise<string> {
  if (cachedLocationId) {
    return cachedLocationId;
  }

  const client = getClient();
  const response = await client.locations.list();

  if (!response.locations || response.locations.length === 0) {
    throw new Error("No Square locations found. Please set up a location in your Square dashboard.");
  }

  // Use the first active location
  const activeLocation = response.locations.find(
    (loc: { status?: string }) => loc.status === "ACTIVE"
  );

  if (!activeLocation?.id) {
    throw new Error("No active Square location found");
  }

  cachedLocationId = activeLocation.id;
  return cachedLocationId;
}

// Create a checkout link for a payment
export async function createCheckoutLink(options: {
  orderId: string;
  lineItems: Array<{
    name: string;
    quantity: string;
    basePriceMoney: {
      amount: bigint;
      currency: Currency;
    };
  }>;
  redirectUrl: string;
  customerEmail?: string;
  note?: string;
}): Promise<{ checkoutUrl: string; orderId: string }> {
  const client = getClient();
  const locationId = await getDefaultLocationId();

  // Create checkout link using the checkout.paymentLinks API
  const checkoutResponse = await client.checkout.paymentLinks.create({
    idempotencyKey: `checkout-${options.orderId}-${Date.now()}`,
    order: {
      locationId,
      lineItems: options.lineItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        basePriceMoney: {
          amount: item.basePriceMoney.amount,
          currency: item.basePriceMoney.currency,
        },
      })),
      referenceId: options.orderId,
    },
    checkoutOptions: {
      redirectUrl: options.redirectUrl,
      askForShippingAddress: false,
    },
    prePopulatedData: options.customerEmail
      ? {
          buyerEmail: options.customerEmail,
        }
      : undefined,
  });

  if (!checkoutResponse.paymentLink?.url) {
    throw new Error("Failed to create Square checkout link");
  }

  return {
    checkoutUrl: checkoutResponse.paymentLink.url,
    orderId: checkoutResponse.paymentLink.orderId || options.orderId,
  };
}

// Verify Square credentials by listing locations
export async function verifyCredentials(): Promise<{
  valid: boolean;
  locationId?: string;
  locationName?: string;
  error?: string;
}> {
  try {
    const client = getClient();
    const response = await client.locations.list();

    if (response.locations && response.locations.length > 0) {
      const location = response.locations[0];
      return {
        valid: true,
        locationId: location.id ?? undefined,
        locationName: location.name ?? undefined,
      };
    }

    return {
      valid: false,
      error: "No locations found in Square account",
    };
  } catch (error: any) {
    return {
      valid: false,
      error: error.message || "Failed to verify Square credentials",
    };
  }
}

// Get payment details
export async function getPayment(paymentId: string) {
  const client = getClient();
  const response = await client.payments.get({ paymentId });
  return response.payment;
}

// List recent payments
export async function listRecentPayments(limit: number = 10) {
  const client = getClient();
  const locationId = await getDefaultLocationId();
  
  // Get the paginated response
  const paymentsPage = await client.payments.list({ locationId });
  const payments: any[] = [];
  
  // Collect payments from the response
  if (paymentsPage.data) {
    for (const payment of paymentsPage.data) {
      payments.push(payment);
      if (payments.length >= limit) break;
    }
  }
  
  return payments;
}

// Create a quick pay checkout (simplified for single items)
export async function createQuickPayCheckout(options: {
  name: string;
  priceInCents: number;
  quantity?: number;
  redirectUrl: string;
  customerEmail?: string;
  referenceId?: string;
}): Promise<{ checkoutUrl: string; orderId: string }> {
  const client = getClient();
  const locationId = await getDefaultLocationId();
  const idempotencyKey = `quick-${options.referenceId || Date.now()}-${Math.random().toString(36).substring(7)}`;

  const response = await client.checkout.paymentLinks.create({
    idempotencyKey,
    quickPay: {
      name: options.name,
      priceMoney: {
        amount: BigInt(options.priceInCents),
        currency: "USD",
      },
      locationId,
    },
    checkoutOptions: {
      redirectUrl: options.redirectUrl,
      askForShippingAddress: false,
    },
    prePopulatedData: options.customerEmail
      ? {
          buyerEmail: options.customerEmail,
        }
      : undefined,
  });

  if (!response.paymentLink?.url) {
    throw new Error("Failed to create Square checkout");
  }

  return {
    checkoutUrl: response.paymentLink.url,
    orderId: response.paymentLink.orderId ?? idempotencyKey,
  };
}
