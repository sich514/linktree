// pages/api/pageview.js
import { trackPageView } from "../../lib/kv";

export default async function handler(req, res) {
  try {
    const country = req.headers["x-vercel-ip-country"] || "XX";
    await trackPageView(country);
    res.status(204).end();
  } catch (err) {
    console.error("Pageview tracking error:", err);
    res.status(500).end();
  }
}
