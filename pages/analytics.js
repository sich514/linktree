// pages/analytics.js
import Head from "next/head";
import { useEffect, useState } from "react";

const LABELS = {
  website:   { icon: "🌐", label: "Website" },
  whatsapp:  { icon: "💬", label: "WhatsApp" },
  zagatclub: { icon: "🚀", label: "Zagat Club" },
  reviews:   { icon: "⭐", label: "Reviews" },
};

export default function Analytics() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    setError(null);
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError("Failed to load"); setLoading(false); });
  };

  useEffect(load, []);

  const total = data ? Object.values(data).reduce((a, b) => a + b, 0) : 0;

  return (
    <>
      <Head>
        <title>Analytics — Zagat Boutique</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="robots" content="noindex" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="page">
        <div className="glow glow-1" />
        <div className="glow glow-2" />

        <div className="wrap">
          <header className="header">
            <a href="/" className="back">← Back</a>
            <h1>Analytics</h1>
            <p className="sub">Link click statistics</p>
          </header>

          {error && <div className="msg error">{error}</div>}
          {loading && !error && <div className="msg">Loading…</div>}

          {data && !loading && (
            <>
              <div className="total">
                <span className="total-num">{total}</span>
                <span className="total-lbl">Total Clicks</span>
              </div>

              <div className="items">
                {Object.entries(LABELS).map(([key, { icon, label }]) => {
                  const count = data[key] || 0;
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div className="item" key={key}>
                      <div className="item-top">
                        <span className="item-icon">{icon}</span>
                        <span className="item-info">
                          <span className="item-label">{label}</span>
                          <span className="item-count">{count} clicks</span>
                        </span>
                        <span className="item-pct">{pct}%</span>
                      </div>
                      <div className="bar">
                        <div className="bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <button className="refresh" onClick={load}>↻ Refresh</button>
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { -webkit-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; }
        body {
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          min-height: 100vh; min-height: 100dvh;
          background: #060f0b;
          color: #f0f0f0;
          overflow-x: hidden;
        }
      `}</style>

      <style jsx>{`
        .page {
          position: relative;
          min-height: 100vh; min-height: 100dvh;
          display: flex; justify-content: center;
          padding: 40px 16px;
        }
        .glow { position: fixed; border-radius: 50%; filter: blur(100px); pointer-events: none; z-index: 0; }
        .glow-1 { width: 500px; height: 500px; top: -120px; left: -100px; background: radial-gradient(circle, rgba(20,92,70,0.35), transparent 70%); }
        .glow-2 { width: 400px; height: 400px; bottom: -80px; right: -80px; background: radial-gradient(circle, rgba(88,189,148,0.15), transparent 70%); }

        .wrap { position: relative; z-index: 1; width: 100%; max-width: 440px; }

        .header { margin-bottom: 28px; }
        .back {
          display: inline-block; margin-bottom: 14px;
          color: #58bd94; text-decoration: none; font-size: 13px;
          transition: opacity 0.2s;
        }
        .back:hover { opacity: 0.7; }
        h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: 600; margin-bottom: 4px; }
        .sub { font-size: 13px; color: rgba(255,255,255,0.4); }

        .total {
          display: flex; flex-direction: column; align-items: center;
          background: rgba(88,189,148,0.08);
          border: 1px solid rgba(88,189,148,0.15);
          border-radius: 20px; padding: 24px; margin-bottom: 20px;
        }
        .total-num { font-size: 44px; font-weight: 600; color: #58bd94; line-height: 1; }
        .total-lbl { font-size: 13px; color: rgba(255,255,255,0.4); margin-top: 6px; }

        .items { display: flex; flex-direction: column; gap: 10px; }

        .item {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px; padding: 16px;
        }
        .item-top { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
        .item-icon {
          width: 40px; height: 40px; border-radius: 10px;
          background: rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
        }
        .item-info { flex: 1; }
        .item-label { display: block; font-weight: 500; font-size: 14px; }
        .item-count { display: block; font-size: 12px; color: rgba(255,255,255,0.35); margin-top: 1px; }
        .item-pct { font-size: 16px; font-weight: 600; color: #58bd94; }

        .bar { height: 5px; background: rgba(255,255,255,0.07); border-radius: 3px; overflow: hidden; }
        .bar-fill {
          height: 100%; border-radius: 3px;
          background: linear-gradient(90deg, #145c46, #58bd94);
          transition: width 0.6s ease;
        }

        .refresh {
          display: block; margin: 24px auto 0;
          background: rgba(255,255,255,0.05);
          color: #f0f0f0;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 10px 24px; border-radius: 12px;
          cursor: pointer; font-size: 13px; font-family: inherit;
          transition: background 0.2s;
        }
        .refresh:hover { background: rgba(255,255,255,0.09); }

        .msg { text-align: center; padding: 40px; color: rgba(255,255,255,0.35); font-size: 14px; }
        .error { color: #ff6b6b; }

        @media (max-width: 360px) {
          .total-num { font-size: 36px; }
          .item { padding: 14px; }
          .item-icon { width: 36px; height: 36px; font-size: 16px; }
        }
      `}</style>
    </>
  );
}
