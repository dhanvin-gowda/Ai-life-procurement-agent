export interface QuickCommerceProduct {
  id: string;
  name: string;
  brand?: string;
  mrp: number;
  offerPrice: number;
  discountPercentage?: number;
  quantity?: string;
  rating?: number;
  ratingCount?: number;
  inventory?: number;
  available: boolean;
  sla?: string;
  deeplink?: string;
  imageUrl?: string;
}

export interface PlatformConfig {
  id: string; // Exact platform string expected by quickcommerceapi.com
  displayName: string;
  category: "quick_commerce" | "marketplace";
  themeColor: string;
  badgeBg: string;
  defaultDeliveryFee: number;
  handlingFee: number;
  fallbackDeliveryTime: string;
  review: string;
  rating: number;
}

export const QUICK_COMMERCE_PLATFORMS: PlatformConfig[] = [
  {
    id: "BlinkIt",
    displayName: "Blinkit",
    category: "quick_commerce",
    themeColor: "#f7c942",
    badgeBg: "#fef3c7",
    defaultDeliveryFee: 15,
    handlingFee: 4,
    fallbackDeliveryTime: "10 Mins",
    review: "Lightning fast 10-minute delivery with excellent grocery stock availability.",
    rating: 4.8,
  },
  {
    id: "Zepto",
    displayName: "Zepto",
    category: "quick_commerce",
    themeColor: "#7000ff",
    badgeBg: "#f3e8ff",
    defaultDeliveryFee: 19,
    handlingFee: 3,
    fallbackDeliveryTime: "8 Mins",
    review: "Fastest 8-minute delivery speed with consistent discounts on essentials.",
    rating: 4.9,
  },
  {
    id: "Swiggy",
    displayName: "Swiggy Instamart",
    category: "quick_commerce",
    themeColor: "#fc8019",
    badgeBg: "#ffedd5",
    defaultDeliveryFee: 12,
    handlingFee: 5,
    fallbackDeliveryTime: "12 Mins",
    review: "Reliable 10-15 minute delivery backed by Swiggy One membership benefits.",
    rating: 4.7,
  },
  {
    id: "BigBasket",
    displayName: "BigBasket (BB Now)",
    category: "quick_commerce",
    themeColor: "#84cc16",
    badgeBg: "#ecfdf5",
    defaultDeliveryFee: 0,
    handlingFee: 2,
    fallbackDeliveryTime: "15 Mins",
    review: "Lowest total basket price, farm fresh organic produce and trusted Tata quality.",
    rating: 4.9,
  },
  {
    id: "DMart",
    displayName: "DMart Ready",
    category: "quick_commerce",
    themeColor: "#16a34a",
    badgeBg: "#dcfce7",
    defaultDeliveryFee: 20,
    handlingFee: 2,
    fallbackDeliveryTime: "Same Day / Pick-up",
    review: "Deepest wholesale supermarket discounts and everyday low prices.",
    rating: 4.6,
  },
  {
    id: "JioMart",
    displayName: "JioMart Express",
    category: "quick_commerce",
    themeColor: "#0078ad",
    badgeBg: "#e0f2fe",
    defaultDeliveryFee: 10,
    handlingFee: 2,
    fallbackDeliveryTime: "1-2 Hours",
    review: "Great staple and FMCG discounts directly from Reliance Retail network.",
    rating: 4.6,
  },
  {
    id: "Minutes",
    displayName: "Flipkart Minutes",
    category: "quick_commerce",
    themeColor: "#2874f0",
    badgeBg: "#dbeafe",
    defaultDeliveryFee: 10,
    handlingFee: 3,
    fallbackDeliveryTime: "10-15 Mins",
    review: "Rapid doorstep deliveries for groceries, electronics and daily needs by Flipkart.",
    rating: 4.7,
  },
  {
    id: "Amazon",
    displayName: "Amazon Fresh",
    category: "marketplace",
    themeColor: "#ff9900",
    badgeBg: "#fef3c7",
    defaultDeliveryFee: 0,
    handlingFee: 0,
    fallbackDeliveryTime: "2-4 Hours / Prime",
    review: "Massive selection with Prime fast delivery and competitive bundle packs.",
    rating: 4.8,
  },
  {
    id: "Nykaa",
    displayName: "Nykaa",
    category: "marketplace",
    themeColor: "#fc2779",
    badgeBg: "#fce7f3",
    defaultDeliveryFee: 29,
    handlingFee: 0,
    fallbackDeliveryTime: "1-2 Days",
    review: "Premier curated beauty, wellness, skincare and personal grooming collection.",
    rating: 4.7,
  },
  {
    id: "Myntra",
    displayName: "Myntra",
    category: "marketplace",
    themeColor: "#ff3f6c",
    badgeBg: "#ffe4e6",
    defaultDeliveryFee: 30,
    handlingFee: 5,
    fallbackDeliveryTime: "1-2 Days Express",
    review: "Top apparel, fashion footwear, grooming essentials and lifestyle items.",
    rating: 4.8,
  },
  {
    id: "Flipkart",
    displayName: "Flipkart",
    category: "marketplace",
    themeColor: "#2874f0",
    badgeBg: "#e0f2fe",
    defaultDeliveryFee: 40,
    handlingFee: 5,
    fallbackDeliveryTime: "1-2 Days",
    review: "India's largest marketplace with nationwide delivery on gadgets, home, & goods.",
    rating: 4.6,
  },
];

export interface FetchPlatformResult {
  platformId: string;
  displayName: string;
  category: "quick_commerce" | "marketplace";
  status: "success" | "empty" | "error";
  totalResults: number;
  products: QuickCommerceProduct[];
  topProduct: QuickCommerceProduct | null;
  sla?: string;
  errorMessage?: string;
  responseTimeMs: number;
}

export interface SearchOptions {
  lat?: number;
  lon?: number;
  pincode?: string;
  apiKey?: string;
}

const DEFAULT_OPTIONS: Required<SearchOptions> = {
  lat: 12.9021,
  lon: 77.6639,
  pincode: "560068",
  apiKey: "",
};

export function getQuickCommerceApiKey(): string {
  return (
    process.env.QUICKCOMMERCEAPI ||
    process.env.NEXT_PUBLIC_QUICKCOMMERCEAPI ||
    "7a0077c2-7989-4811-ac66-ef70830a3229"
  );
}

/**
 * Fetch products for a single platform from QuickCommerce API
 */
export async function fetchPlatformPrice(
  query: string,
  platform: PlatformConfig,
  options?: SearchOptions
): Promise<FetchPlatformResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const apiKey = opts.apiKey || getQuickCommerceApiKey();
  const startTime = Date.now();

  const url = `https://api.quickcommerceapi.com/v1/search?q=${encodeURIComponent(
    query
  )}&lat=${opts.lat}&lon=${opts.lon}&pincode=${opts.pincode}&platform=${platform.id}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "X-API-Key": apiKey,
        Accept: "application/json",
      },
      next: { revalidate: 300 }, // Cache on Next.js server for 5 minutes
    });

    const elapsed = Date.now() - startTime;

    if (!res.ok) {
      const errText = await res.text();
      return {
        platformId: platform.id,
        displayName: platform.displayName,
        category: platform.category,
        status: "error",
        totalResults: 0,
        products: [],
        topProduct: null,
        errorMessage: `HTTP ${res.status}: ${errText}`,
        responseTimeMs: elapsed,
      };
    }

    const data = await res.json();
    const rawProducts: any[] = data.data?.products || [];

    const products: QuickCommerceProduct[] = rawProducts.map((p) => {
      const mrp = Number(p.mrp) || 0;
      const offerPrice = Number(p.offer_price ?? p.mrp) || mrp;
      const discountPercentage =
        mrp > offerPrice ? Math.round(((mrp - offerPrice) / mrp) * 100) : 0;

      return {
        id: String(p.id || ""),
        name: String(p.name || "Item"),
        brand: p.brand || undefined,
        mrp,
        offerPrice,
        discountPercentage,
        quantity: p.quantity || undefined,
        rating: typeof p.rating === "number" ? p.rating : undefined,
        ratingCount: typeof p.rating_count === "number" ? p.rating_count : undefined,
        inventory: typeof p.inventory === "number" ? p.inventory : undefined,
        available: p.available !== false,
        sla: p.platform?.sla || data.data?.sla || undefined,
        deeplink: p.deeplink || undefined,
        imageUrl: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : undefined,
      };
    });

    const topProduct = products[0] || null;
    const sla = topProduct?.sla || platform.fallbackDeliveryTime;

    return {
      platformId: platform.id,
      displayName: platform.displayName,
      category: platform.category,
      status: products.length > 0 ? "success" : "empty",
      totalResults: products.length,
      products,
      topProduct,
      sla,
      responseTimeMs: elapsed,
    };
  } catch (err: any) {
    return {
      platformId: platform.id,
      displayName: platform.displayName,
      category: platform.category,
      status: "error",
      totalResults: 0,
      products: [],
      topProduct: null,
      errorMessage: err?.message || "Network request failed",
      responseTimeMs: Date.now() - startTime,
    };
  }
}

/**
 * Fetch products across all 11 platforms simultaneously in parallel
 */
export async function fetchAllPlatformsPrice(
  query: string,
  options?: SearchOptions
): Promise<FetchPlatformResult[]> {
  const promises = QUICK_COMMERCE_PLATFORMS.map((platform) =>
    fetchPlatformPrice(query, platform, options)
  );
  return Promise.all(promises);
}
