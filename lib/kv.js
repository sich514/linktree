// lib/kv.js
// Vercel KV wrapper with in-memory fallback for local dev

let kv = null;

async function getKV() {
  if (kv) return kv;

  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const { kv: vercelKV } = await import("@vercel/kv");
    kv = vercelKV;
    return kv;
  }

  // In-memory fallback (resets on cold start — fine for dev)
  if (!global._memStore) global._memStore = {};

  kv = {
    async hincrby(key, field, amount) {
      if (!global._memStore[key]) global._memStore[key] = {};
      if (!global._memStore[key][field]) global._memStore[key][field] = 0;
      global._memStore[key][field] += amount;
      return global._memStore[key][field];
    },
    async hgetall(key) {
      return global._memStore[key] ? { ...global._memStore[key] } : null;
    },
  };

  return kv;
}

// ---------- Click totals ----------

export async function incrementClick(name) {
  const store = await getKV();
  await store.hincrby("clicks", name, 1);
}

export async function getAllClicks() {
  const store = await getKV();
  const data = await store.hgetall("clicks");
  const defaults = { website: 0, whatsapp: 0, zagatclub: 0, reviews: 0 };
  if (!data) return defaults;
  return {
    website: parseInt(data.website || 0),
    whatsapp: parseInt(data.whatsapp || 0),
    zagatclub: parseInt(data.zagatclub || 0),
    reviews: parseInt(data.reviews || 0),
  };
}

// ---------- Daily stats ----------

export async function trackDaily(name) {
  const store = await getKV();
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  await store.hincrby(`daily:${today}`, name, 1);
  await store.hincrby(`daily:${today}`, "_total", 1);
}

export async function getDailyStats(days = 14) {
  const store = await getKV();
  const result = [];
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const data = await store.hgetall(`daily:${key}`);
    result.push({
      date: key,
      website: parseInt(data?.website || 0),
      whatsapp: parseInt(data?.whatsapp || 0),
      zagatclub: parseInt(data?.zagatclub || 0),
      reviews: parseInt(data?.reviews || 0),
      total: parseInt(data?._total || 0),
    });
  }
  return result.reverse(); // oldest first
}

// ---------- Country tracking ----------

export async function trackCountry(countryCode) {
  if (!countryCode || countryCode === "XX") return;
  const store = await getKV();
  await store.hincrby("countries", countryCode, 1);
}

export async function getCountryStats() {
  const store = await getKV();
  const data = await store.hgetall("countries");
  if (!data) return [];
  return Object.entries(data)
    .map(([code, count]) => ({ code, count: parseInt(count) }))
    .sort((a, b) => b.count - a.count);
}

// ---------- Page views ----------

export async function trackPageView(countryCode) {
  const store = await getKV();
  await store.hincrby("pageviews", "_total", 1);
  const today = new Date().toISOString().slice(0, 10);
  await store.hincrby(`pv:${today}`, "_total", 1);
  if (countryCode && countryCode !== "XX") {
    await store.hincrby("pv:countries", countryCode, 1);
  }
}

export async function getPageViews() {
  const store = await getKV();
  const data = await store.hgetall("pageviews");
  return parseInt(data?._total || 0);
}

export async function getPageViewCountries() {
  const store = await getKV();
  const data = await store.hgetall("pv:countries");
  if (!data) return [];
  return Object.entries(data)
    .map(([code, count]) => ({ code, count: parseInt(count) }))
    .sort((a, b) => b.count - a.count);
}
