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
  if (!global._memStore) {
    global._memStore = { website: 0, whatsapp: 0, zagatclub: 0, reviews: 0 };
  }

  kv = {
    async hincrby(_key, field, amount) {
      if (!global._memStore[field]) global._memStore[field] = 0;
      global._memStore[field] += amount;
      return global._memStore[field];
    },
    async hgetall(_key) {
      return { ...global._memStore };
    },
  };

  return kv;
}

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
