// pages/api/analytics.js
import { getAllClicks } from "../../lib/kv";

export default async function handler(req, res) {
  try {
    const data = await getAllClicks();
    res.status(200).json(data);
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ error: "Failed to load analytics" });
  }
}
