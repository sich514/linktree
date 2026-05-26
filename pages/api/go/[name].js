// pages/api/go/[name].js
import { incrementClick, trackDaily, trackCountry } from "../../../lib/kv";
import { LINKS } from "../../../lib/links";

export default async function handler(req, res) {
  const { name } = req.query;

  if (!LINKS[name]) {
    return res.status(404).json({ error: "Link not found" });
  }

  try {
    // Vercel provides geo headers automatically (free)
    const country = req.headers["x-vercel-ip-country"] || "XX";
    await Promise.all([
      incrementClick(name),
      trackDaily(name),
      trackCountry(country),
    ]);
  } catch (err) {
    console.error("Click tracking error:", err);
  }

  res.redirect(302, LINKS[name]);
}
