import { createTool } from "@mastra/core/tools";
import {
  fetchAllPlatformsPrice,
  fetchPlatformPrice,
  QUICK_COMMERCE_PLATFORMS,
} from "@/src/lib/quickcommerce";

export const quickCommercePriceCheckTool = createTool({
  id: "quickcommerce-price-check",
  description:
    "Check and compare live item prices, MRP, discounts, stock, and delivery times across all 11 quick commerce and marketplace platforms (Blinkit, Zepto, Swiggy Instamart, BigBasket, DMart, JioMart, Flipkart Minutes, Amazon, Nykaa, Myntra, Flipkart).",
  execute: async (inputData: any, context?: any) => {
    const input = inputData || context || {};
    const query = input.query || input.item || "milk";
    const platform = input.platform;
    const lat = input.lat || 12.9021;
    const lon = input.lon || 77.6639;
    const pincode = input.pincode || "560068";

    if (platform && platform !== "all") {
      const targetPlatform = QUICK_COMMERCE_PLATFORMS.find(
        (p) =>
          p.id.toLowerCase() === platform.toLowerCase() ||
          p.displayName.toLowerCase() === platform.toLowerCase()
      );
      if (!targetPlatform) {
        return {
          error: `Unknown platform '${platform}'. Valid platforms: ${QUICK_COMMERCE_PLATFORMS.map((p) => p.id).join(", ")}`,
        };
      }
      return fetchPlatformPrice(query, targetPlatform, { lat, lon, pincode });
    }

    const results = await fetchAllPlatformsPrice(query, { lat, lon, pincode });
    return {
      query,
      platformsEvaluated: results.length,
      results: results.map((r) => ({
        platform: r.displayName,
        platformId: r.platformId,
        category: r.category,
        status: r.status,
        totalResults: r.totalResults,
        topItem: r.topProduct
          ? {
              name: r.topProduct.name,
              brand: r.topProduct.brand,
              offerPrice: r.topProduct.offerPrice,
              mrp: r.topProduct.mrp,
              discount: `${r.topProduct.discountPercentage || 0}%`,
              quantity: r.topProduct.quantity,
              deliverySLA: r.sla,
              available: r.topProduct.available,
              deeplink: r.topProduct.deeplink,
            }
          : null,
      })),
    };
  },
});
