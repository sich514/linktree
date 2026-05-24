// pages/api/analytics.js
import { getAllClicks, getDailyStats, getCountryStats, getPageViews, getPageViewCountries } from "../../lib/kv";

export default async function handler(req, res) {
  try {
    const days = Math.min(parseInt(req.query.days) || 14, 90);
    const [clicks, daily, countries, pageviews, pvCountries] = await Promise.all([
      getAllClicks(),
      getDailyStats(days),
      getCountryStats(),
      getPageViews(),
      getPageViewCountries(),
    ]);
    res.status(200).json({ clicks, daily, countries, pageviews, pvCountries });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ error: "Failed to load analytics" });
  }
}
