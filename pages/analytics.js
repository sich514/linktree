// pages/analytics.js
import Head from "next/head";
import { useEffect, useState } from "react";

const LINK_LABELS = {
  website:   { icon: "🌐", label: "Website" },
  whatsapp:  { icon: "💬", label: "WhatsApp" },
  reviews:   { icon: "⭐", label: "WA Channel" },
};

function flag(code) {
  if (!code || code.length !== 2) return "🌍";
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  );
}

const COUNTRY_NAMES = {
  US:"USA",CA:"Canada",GB:"UK",DE:"Germany",FR:"France",UA:"Ukraine",
  PL:"Poland",IT:"Italy",ES:"Spain",NL:"Netherlands",SE:"Sweden",
  NO:"Norway",DK:"Denmark",FI:"Finland",PT:"Portugal",BE:"Belgium",
  AT:"Austria",CH:"Switzerland",CZ:"Czechia",RO:"Romania",HU:"Hungary",
  BG:"Bulgaria",HR:"Croatia",SK:"Slovakia",SI:"Slovenia",LT:"Lithuania",
  LV:"Latvia",EE:"Estonia",IE:"Ireland",GR:"Greece",TR:"Turkey",
  RU:"Russia",BY:"Belarus",KZ:"Kazakhstan",JP:"Japan",CN:"China",
  KR:"South Korea",IN:"India",AU:"Australia",NZ:"New Zealand",
  BR:"Brazil",MX:"Mexico",AR:"Argentina",AE:"UAE",SA:"Saudi Arabia",
  IL:"Israel",EG:"Egypt",ZA:"South Africa",NG:"Nigeria",SG:"Singapore",
  TH:"Thailand",VN:"Vietnam",MY:"Malaysia",PH:"Philippines",ID:"Indonesia",
};
function countryName(code) {
  return COUNTRY_NAMES[code] || code;
}

function fmtDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDate();
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${day} ${months[d.getMonth()]}`;
}

export default function Analytics() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(14);
  const [tab, setTab] = useState("overview");
  const [expanded, setExpanded] = useState(null);

  const load = (numDays) => {
    setLoading(true);
    setError(null);
    fetch(`/api/analytics?days=${numDays || days}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError("Failed to load"); setLoading(false); });
  };

  useEffect(() => { load(days); }, [days]);

  const totalClicks = data?.clicks
    ? Object.values(data.clicks).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <>
      <Head>
        <title>Analytics — Zagat Boutique</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="robots" content="noindex" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@500;600&family=DM+Mono:wght@400&display=swap"
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
          </header>

          {error && <div className="msg error">{error}</div>}
          {loading && !error && <div className="msg">Loading…</div>}

          {data && !loading && (
            <>
              {/* Summary */}
              <div className="summary">
                <div className="sum-card">
                  <div className="sum-num">{data.pageviews || 0}</div>
                  <div className="sum-lbl">Page Views</div>
                </div>
                <div className="sum-card">
                  <div className="sum-num">{totalClicks}</div>
                  <div className="sum-lbl">Link Clicks</div>
                </div>
              </div>

              {/* Tabs */}
              <div className="tabs">
                {[["overview","Overview"],["daily","By Day"],["geo","Countries"]].map(([key,label]) => (
                  <button key={key} className={`tab ${tab===key?"active":""}`} onClick={() => setTab(key)}>{label}</button>
                ))}
              </div>

              {/* ===== OVERVIEW ===== */}
              {tab === "overview" && (
                <div className="section">
                  <div className="items">
                    {Object.entries(LINK_LABELS).map(([key, { icon, label }]) => {
                      const count = data.clicks[key] || 0;
                      const pct = totalClicks > 0 ? Math.round((count / totalClicks) * 100) : 0;
                      return (
                        <div className="item" key={key}>
                          <div className="item-top">
                            <span className="item-icon">{icon}</span>
                            <span className="item-info">
                              <span className="item-label">{label}</span>
                              <span className="item-count">{count} clicks · {pct}%</span>
                            </span>
                            <span className="item-num">{count}</span>
                          </div>
                          <div className="bar"><div className="bar-fill" style={{ width: `${pct}%` }} /></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ===== BY DAY ===== */}
              {tab === "daily" && (
                <div className="section">
                  <div className="day-controls">
                    {[7, 14, 30].map((n) => (
                      <button key={n} className={`day-btn ${days===n?"active":""}`} onClick={() => setDays(n)}>{n}d</button>
                    ))}
                  </div>

                  <div className="day-list">
                    {[...data.daily].reverse().map((d) => {
                      const isOpen = expanded === d.date;
                      const hasGeo = (d.countries && d.countries.length > 0) || (d.pvCountries && d.pvCountries.length > 0);
                      return (
                        <div className={`day-card ${isOpen ? "open" : ""}`} key={d.date}>
                          <div
                            className="day-header"
                            onClick={() => setExpanded(isOpen ? null : d.date)}
                          >
                            <span className="day-date">{fmtDate(d.date)}</span>
                            <div className="day-stats">
                              <span className="day-stat">
                                <span className="day-stat-num">{d.pageviews || 0}</span>
                                <span className="day-stat-lbl">views</span>
                              </span>
                              <span className="day-stat">
                                <span className="day-stat-num">{d.total || 0}</span>
                                <span className="day-stat-lbl">clicks</span>
                              </span>
                              {d.total > 0 && (
                                <span className="day-links">
                                  {d.website > 0 && <span className="day-dot seg-web" title={`Website: ${d.website}`} />}
                                  {d.whatsapp > 0 && <span className="day-dot seg-wa" title={`WhatsApp: ${d.whatsapp}`} />}
                                  {d.reviews > 0 && <span className="day-dot seg-rv" title={`Channel: ${d.reviews}`} />}
                                </span>
                              )}
                            </div>
                            <span className={`day-chevron ${isOpen ? "rotated" : ""}`}>›</span>
                          </div>

                          {isOpen && (
                            <div className="day-detail">
                              {/* Click breakdown */}
                              {d.total > 0 && (
                                <div className="day-breakdown">
                                  {d.website > 0 && <span className="bd-item"><span className="bd-dot seg-web" /> Website: {d.website}</span>}
                                  {d.whatsapp > 0 && <span className="bd-item"><span className="bd-dot seg-wa" /> WhatsApp: {d.whatsapp}</span>}
                                  {d.reviews > 0 && <span className="bd-item"><span className="bd-dot seg-rv" /> Channel: {d.reviews}</span>}
                                </div>
                              )}

                              {/* Countries for this day */}
                              {hasGeo ? (
                                <div className="day-geo">
                                  {d.pvCountries && d.pvCountries.length > 0 && (
                                    <div className="day-geo-section">
                                      <div className="day-geo-title">Page views</div>
                                      <div className="day-geo-rows">
                                        {d.pvCountries.map(({ code, count }) => (
                                          <span className="day-geo-chip" key={code}>
                                            {flag(code)} {countryName(code)} <span className="day-geo-n">{count}</span>
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {d.countries && d.countries.length > 0 && (
                                    <div className="day-geo-section">
                                      <div className="day-geo-title">Clicks</div>
                                      <div className="day-geo-rows">
                                        {d.countries.map(({ code, count }) => (
                                          <span className="day-geo-chip" key={code}>
                                            {flag(code)} {countryName(code)} <span className="day-geo-n">{count}</span>
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="day-geo-empty">No country data</div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ===== COUNTRIES ===== */}
              {tab === "geo" && (
                <div className="section">
                  <div className="geo-group">
                    <h3 className="geo-title">Link Clicks by Country</h3>
                    {data.countries && data.countries.length > 0 ? (
                      <div className="geo-list">
                        {data.countries.map(({ code, count }) => {
                          const topCount = data.countries[0].count;
                          const pct = Math.round((count / topCount) * 100);
                          return (
                            <div className="geo-row" key={code}>
                              <span className="geo-flag">{flag(code)}</span>
                              <span className="geo-name">{countryName(code)}</span>
                              <span className="geo-bar-wrap">
                                <span className="geo-bar" style={{ width: `${pct}%` }} />
                              </span>
                              <span className="geo-count">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : <div className="msg-sm">No data yet</div>}
                  </div>

                  <div className="geo-group">
                    <h3 className="geo-title">Page Views by Country</h3>
                    {data.pvCountries && data.pvCountries.length > 0 ? (
                      <div className="geo-list">
                        {data.pvCountries.map(({ code, count }) => {
                          const topCount = data.pvCountries[0].count;
                          const pct = Math.round((count / topCount) * 100);
                          return (
                            <div className="geo-row" key={code}>
                              <span className="geo-flag">{flag(code)}</span>
                              <span className="geo-name">{countryName(code)}</span>
                              <span className="geo-bar-wrap">
                                <span className="geo-bar pv" style={{ width: `${pct}%` }} />
                              </span>
                              <span className="geo-count">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : <div className="msg-sm">No data yet</div>}
                  </div>
                </div>
              )}

              <button className="refresh" onClick={() => load(days)}>↻ Refresh</button>
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
          background: #060f0b; color: #f0f0f0; overflow-x: hidden;
        }
      `}</style>

      <style jsx>{`
        .page {
          position: relative; min-height: 100vh; min-height: 100dvh;
          display: flex; justify-content: center; padding: 32px 16px;
        }
        .glow { position: fixed; border-radius: 50%; filter: blur(100px); pointer-events: none; z-index: 0; }
        .glow-1 { width: 500px; height: 500px; top: -120px; left: -100px; background: radial-gradient(circle, rgba(20,92,70,0.35), transparent 70%); }
        .glow-2 { width: 400px; height: 400px; bottom: -80px; right: -80px; background: radial-gradient(circle, rgba(88,189,148,0.15), transparent 70%); }

        .wrap { position: relative; z-index: 1; width: 100%; max-width: 520px; }

        .header { margin-bottom: 24px; }
        .back { display: inline-block; margin-bottom: 12px; color: #58bd94; text-decoration: none; font-size: 13px; transition: opacity 0.2s; }
        .back:hover { opacity: 0.7; }
        h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: 600; }

        /* Summary */
        .summary { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
        .sum-card {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 18px; text-align: center;
        }
        .sum-num { font-size: 32px; font-weight: 600; line-height: 1; color: #58bd94; }
        .sum-lbl { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 6px; }

        /* Tabs */
        .tabs { display: flex; gap: 6px; margin-bottom: 18px; background: rgba(255,255,255,0.03); border-radius: 12px; padding: 4px; }
        .tab {
          flex: 1; padding: 9px 0; border: none; border-radius: 9px;
          background: transparent; color: rgba(255,255,255,0.45);
          font-family: inherit; font-size: 13px; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
        }
        .tab.active { background: rgba(88,189,148,0.15); color: #58bd94; }
        .tab:hover:not(.active) { color: rgba(255,255,255,0.7); }

        .section { animation: fadeIn 0.25s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

        /* Overview */
        .items { display: flex; flex-direction: column; gap: 10px; }
        .item { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 14px; }
        .item-top { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
        .item-icon {
          width: 38px; height: 38px; border-radius: 10px;
          background: rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; flex-shrink: 0;
        }
        .item-info { flex: 1; }
        .item-label { display: block; font-weight: 500; font-size: 14px; }
        .item-count { display: block; font-size: 11px; color: rgba(255,255,255,0.35); margin-top: 1px; }
        .item-num { font-size: 20px; font-weight: 600; color: #58bd94; }
        .bar { height: 4px; background: rgba(255,255,255,0.07); border-radius: 2px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, #145c46, #58bd94); transition: width 0.6s ease; }

        /* ===== Daily — card list ===== */
        .day-controls { display: flex; gap: 6px; margin-bottom: 16px; }
        .day-btn {
          padding: 6px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);
          background: transparent; color: rgba(255,255,255,0.5);
          font-family: inherit; font-size: 12px; cursor: pointer; transition: all 0.2s;
        }
        .day-btn.active { background: rgba(88,189,148,0.15); color: #58bd94; border-color: rgba(88,189,148,0.3); }

        .day-list { display: flex; flex-direction: column; gap: 6px; }

        .day-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px; overflow: hidden; transition: border-color 0.2s;
        }
        .day-card.open { border-color: rgba(88,189,148,0.2); }

        .day-header {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 14px; cursor: pointer; transition: background 0.15s;
        }
        .day-header:hover { background: rgba(255,255,255,0.03); }

        .day-date {
          width: 52px; flex-shrink: 0; font-size: 13px; font-weight: 500;
          font-family: 'DM Mono', monospace; color: rgba(255,255,255,0.6);
        }

        .day-stats { flex: 1; display: flex; align-items: center; gap: 14px; }

        .day-stat { display: flex; align-items: baseline; gap: 4px; }
        .day-stat-num { font-size: 14px; font-weight: 600; color: #58bd94; font-family: 'DM Mono', monospace; }
        .day-stat-lbl { font-size: 11px; color: rgba(255,255,255,0.3); }

        .day-links { display: flex; gap: 4px; margin-left: auto; }
        .day-dot { width: 8px; height: 8px; border-radius: 2px; }

        .seg-web { background: #58bd94; }
        .seg-wa { background: #25d366; }
        .seg-rv { background: #e8b344; }

        .day-chevron {
          font-size: 18px; color: rgba(255,255,255,0.25); flex-shrink: 0;
          transition: transform 0.2s; transform: rotate(0deg);
        }
        .day-chevron.rotated { transform: rotate(90deg); color: #58bd94; }

        /* Expanded detail */
        .day-detail {
          padding: 0 14px 14px; animation: fadeIn 0.2s ease;
          border-top: 1px solid rgba(255,255,255,0.04);
        }

        .day-breakdown {
          display: flex; flex-wrap: wrap; gap: 10px;
          padding: 10px 0; font-size: 12px; color: rgba(255,255,255,0.55);
        }
        .bd-item { display: flex; align-items: center; gap: 5px; }
        .bd-dot { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }

        .day-geo { padding-top: 4px; }
        .day-geo-section { margin-bottom: 10px; }
        .day-geo-section:last-child { margin-bottom: 0; }
        .day-geo-title { font-size: 11px; color: rgba(255,255,255,0.3); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em; }

        .day-geo-rows { display: flex; flex-wrap: wrap; gap: 6px; }
        .day-geo-chip {
          display: inline-flex; align-items: center; gap: 4px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px; padding: 5px 10px; font-size: 12px; color: rgba(255,255,255,0.65);
        }
        .day-geo-n { font-family: 'DM Mono', monospace; font-weight: 500; color: #58bd94; margin-left: 2px; }

        .day-geo-empty { padding: 10px 0; font-size: 12px; color: rgba(255,255,255,0.2); }

        /* Geo tab */
        .geo-group { margin-bottom: 20px; }
        .geo-title { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.5); margin-bottom: 10px; }
        .geo-list {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px; overflow: hidden;
        }
        .geo-row {
          display: flex; align-items: center; gap: 10px; padding: 11px 14px;
          border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 13px;
        }
        .geo-row:last-child { border-bottom: none; }
        .geo-flag { font-size: 18px; flex-shrink: 0; width: 26px; text-align: center; }
        .geo-name { width: 90px; flex-shrink: 0; color: rgba(255,255,255,0.7); font-size: 12px; }
        .geo-bar-wrap { flex: 1; height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; }
        .geo-bar { height: 100%; border-radius: 3px; background: linear-gradient(90deg, #145c46, #58bd94); transition: width 0.4s ease; min-width: 3px; }
        .geo-bar.pv { background: linear-gradient(90deg, #1a4a6e, #5badcf); }
        .geo-count { font-family: 'DM Mono', monospace; font-size: 12px; color: rgba(255,255,255,0.5); width: 40px; text-align: right; flex-shrink: 0; }

        .msg-sm { padding: 20px; text-align: center; color: rgba(255,255,255,0.3); font-size: 13px; }

        .refresh {
          display: block; margin: 24px auto 0;
          background: rgba(255,255,255,0.05); color: #f0f0f0;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 10px 24px; border-radius: 12px;
          cursor: pointer; font-size: 13px; font-family: inherit;
          transition: background 0.2s;
        }
        .refresh:hover { background: rgba(255,255,255,0.09); }

        .msg { text-align: center; padding: 40px; color: rgba(255,255,255,0.35); font-size: 14px; }
        .error { color: #ff6b6b; }

        @media (max-width: 360px) {
          .sum-num { font-size: 26px; }
          .day-date { width: 44px; font-size: 11px; }
          .day-stat-num { font-size: 12px; }
          .geo-name { width: 70px; font-size: 11px; }
        }
      `}</style>
    </>
  );
}
