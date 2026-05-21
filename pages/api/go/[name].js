// pages/api/go/[name].js
import { incrementClick } from "../../../lib/kv";
import { LINKS } from "../../../lib/links";

export default async function handler(req, res) {
  const { name } = req.query;

  if (!LINKS[name]) {
    return res.status(404).json({ error: "Link not found" });
  }

  try {
    await incrementClick(name);
  } catch (err) {
    console.error("Click tracking error:", err);
  }

  res.redirect(302, LINKS[name]);
}
