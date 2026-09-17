#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Helper to load .env manually if dotenv isn't preloaded
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2] || '';
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        if (!process.env[key]) process.env[key] = val.trim();
      }
    }
  }
}

loadEnv();

const apiKey =
  process.env.QUICKCOMMERCEAPI ||
  process.env.NEXT_PUBLIC_QUICKCOMMERCEAPI ||
  '7a0077c2-7989-4811-ac66-ef70830a3229';

const query = process.argv[2] || 'milk';
const lat = 12.9021;
const lon = 77.6639;
const pincode = '560068';

// All 11 platforms supported by QuickCommerce API
const PLATFORMS = [
  { id: 'BlinkIt', name: 'Blinkit', type: 'Quick Commerce' },
  { id: 'Zepto', name: 'Zepto', type: 'Quick Commerce' },
  { id: 'Swiggy', name: 'Swiggy Instamart', type: 'Quick Commerce' },
  { id: 'BigBasket', name: 'BigBasket (BB Now)', type: 'Quick Commerce' },
  { id: 'DMart', name: 'DMart Ready', type: 'Supermarket' },
  { id: 'JioMart', name: 'JioMart Express', type: 'Quick Commerce' },
  { id: 'Minutes', name: 'Flipkart Minutes', type: 'Quick Commerce' },
  { id: 'Amazon', name: 'Amazon Fresh', type: 'Marketplace' },
  { id: 'Nykaa', name: 'Nykaa', type: 'Marketplace' },
  { id: 'Myntra', name: 'Myntra', type: 'Marketplace' },
  { id: 'Flipkart', name: 'Flipkart', type: 'Marketplace' }
];

async function fetchPlatform(platform) {
  const url = `https://api.quickcommerceapi.com/v1/search?q=${encodeURIComponent(
    query
  )}&lat=${lat}&lon=${lon}&pincode=${pincode}&platform=${platform.id}`;

  const start = Date.now();
  try {
    const res = await fetch(url, {
      headers: {
        'X-API-Key': apiKey,
        Accept: 'application/json'
      }
    });
    const elapsed = Date.now() - start;

    if (!res.ok) {
      const errorText = await res.text();
      return {
        platform: platform.name,
        platformId: platform.id,
        type: platform.type,
        status: 'Error',
        statusCode: res.status,
        count: 0,
        topItem: null,
        message: errorText,
        elapsed
      };
    }

    const data = await res.json();
    const products = data.data?.products || [];
    const top = products[0] || null;

    return {
      platform: platform.name,
      platformId: platform.id,
      type: platform.type,
      status: products.length > 0 ? 'Success' : 'No Match',
      count: products.length,
      topItem: top
        ? {
            name: top.name,
            brand: top.brand || 'N/A',
            mrp: Number(top.mrp) || 0,
            offerPrice: Number(top.offer_price ?? top.mrp) || 0,
            quantity: top.quantity || 'N/A',
            sla: top.platform?.sla || data.data?.sla || 'Standard',
            rating: top.rating ? `${top.rating.toFixed(1)}★` : 'N/A',
            deeplink: top.deeplink || 'N/A'
          }
        : null,
      elapsed
    };
  } catch (err) {
    return {
      platform: platform.name,
      platformId: platform.id,
      type: platform.type,
      status: 'Network Error',
      count: 0,
      topItem: null,
      message: err.message,
      elapsed: Date.now() - start
    };
  }
}

async function main() {
  console.log('\n' + '='.repeat(80));
  console.log(`🛒 QuickCommerce API Price Check Across All 11 Platforms`);
  console.log(`🔎 Item Query : "${query}"`);
  console.log(`📍 Coordinates: Lat ${lat}, Lon ${lon} (Bangalore - Pincode: ${pincode})`);
  console.log(`🔑 Key Masked : ${apiKey.slice(0, 6)}...${apiKey.slice(-4)}`);
  console.log('='.repeat(80) + '\n');
  console.log('⏳ Fetching prices in parallel across 11 platforms...');

  const startTime = Date.now();
  const results = await Promise.all(PLATFORMS.map(fetchPlatform));
  const totalDuration = Date.now() - startTime;

  // Format table output
  const tableRows = results.map((r) => {
    const item = r.topItem;
    const hasItem = Boolean(item);
    const mrp = hasItem ? `₹${item.mrp}` : '-';
    const price = hasItem ? `₹${item.offerPrice}` : '-';
    const discount =
      hasItem && item.mrp > item.offerPrice
        ? `${Math.round(((item.mrp - item.offerPrice) / item.mrp) * 100)}% OFF`
        : '0%';

    return {
      Platform: r.platform,
      Category: r.type,
      Status: r.status === 'Success' ? `✅ (${r.count})` : r.status === 'No Match' ? '⚪ (0)' : '❌ Error',
      'Item Name': hasItem ? (item.name.length > 28 ? item.name.slice(0, 25) + '...' : item.name) : (r.message ? r.message.slice(0, 25) : 'No items found'),
      Price: price,
      MRP: mrp,
      Discount: discount,
      Pack: hasItem ? item.quantity : '-',
      Delivery: hasItem ? item.sla : '-',
      Time: `${r.elapsed}ms`
    };
  });

  console.table(tableRows);

  // Find lowest price and fastest quick delivery
  const itemsWithPrice = results
    .filter((r) => r.topItem && r.topItem.offerPrice > 0)
    .sort((a, b) => a.topItem.offerPrice - b.topItem.offerPrice);

  const quickItemsWithSLA = results
    .filter((r) => r.type === 'Quick Commerce' && r.topItem && r.topItem.sla)
    .sort((a, b) => {
      const getMins = (str) => {
        const m = str.match(/(\d+)\s*min/i);
        return m ? parseInt(m[1], 10) : 999;
      };
      return getMins(a.topItem.sla) - getMins(b.topItem.sla);
    });

  console.log('\n📊 SUMMARY & HIGHLIGHTS:');
  console.log(`⏱ Total comparison completed in ${(totalDuration / 1000).toFixed(2)}s`);

  if (itemsWithPrice.length > 0) {
    const best = itemsWithPrice[0];
    console.log(
      `🏆 BEST VALUE: ${best.platform} at ₹${best.topItem.offerPrice} (${best.topItem.name} - ${best.topItem.quantity})`
    );
  }

  if (quickItemsWithSLA.length > 0) {
    const fastest = quickItemsWithSLA[0];
    console.log(
      `⚡ FASTEST DELIVERY: ${fastest.platform} (${fastest.topItem.sla}) - "${fastest.topItem.name}"`
    );
  }

  console.log('\n🔗 PURCHASE DEEPLINKS:');
  results.forEach((r) => {
    if (r.topItem && r.topItem.deeplink && r.topItem.deeplink !== 'N/A') {
      console.log(`  • ${r.platform}: ${r.topItem.deeplink}`);
    }
  });

  console.log('\n' + '='.repeat(80) + '\n');
}

main().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
