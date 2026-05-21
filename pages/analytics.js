// pages/analytics.js
import { useEffect, useState } from 'react';

const LABELS = {
  website:   { icon: '🌐', label: 'Website' },
  whatsapp:  { icon: '💬', label: 'WhatsApp' },
  zagatclub: { icon: '🚀', label: 'Zagat Club' },
  reviews:   { icon: '⭐', label: 'Reviews' },
};

export default function Analytics() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/analytics')
      .then(r => r.json())
      .then(setData)
      .catch(() => setError('Failed to load analytics'));
  }, []);

  const total = data ? Object.values(data).reduce((a, b) => a + b, 0) : 0;

  return (
    <>
      <div className="page">
        <div className="header">
          <a href="/" className="back">← Back</a>
          <h1>Analytics</h1>
          <p className="subtitle">Link click statistics</p>
        </div>

        {error && <div className="error">{error}</div>}

        {!data && !error && (
          <div className="loading">Loading...</div>
        )}

        {data && (
          <>
            <div className="total-card">
              <div className="total-number">{total}</div>
              <div className="total-label">Total Clicks</div>
            </div>

            <div className="cards">
              {Object.entries(LABELS).map(([key, { icon, label }]) => {
                const count = data[key] || 0;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div className="card" key={key}>
                    <div className="card-top">
                      <div className="card-icon">{icon}</div>
                      <div className="card-info">
                        <div className="card-label">{label}</div>
                        <div className="card-count">{count} clicks</div>
                      </div>
                      <div className="card-pct">{pct}%</div>
                    </div>
                    <div className="bar-bg">
                      <div className="bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="refresh" onClick={() => {
              setData(null);
              fetch('/api/analytics').then(r => r.json()).then(setData);
            }}>
              ↻ Refresh
            </button>
          </>
        )}
      </div>

      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: Arial, sans-serif;
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, #145c46 0%, transparent 30%),
            radial-gradient(circle at bottom right, #07241d 0%, transparent 35%),
            linear-gradient(135deg, #02100c 0%, #052018 30%, #0b3b2d 60%, #02100c 100%);
          color: white;
          padding: 40px 20px;
        }
      `}</style>

      <style jsx>{`
        .page { max-width: 500px; margin: 0 auto; }

        .header { margin-bottom: 30px; }
        .back {
          color: #58bd94;
          text-decoration: none;
          font-size: 14px;
          display: inline-block;
          margin-bottom: 12px;
        }
        h1 { font-size: 28px; margin-bottom: 6px; }
        .subtitle { color: #9f9f9f; font-size: 14px; }

        .total-card {
          background: rgba(88,189,148,0.12);
          border: 1px solid rgba(88,189,148,0.2);
          border-radius: 20px;
          padding: 24px;
          text-align: center;
          margin-bottom: 20px;
        }
        .total-number { font-size: 48px; font-weight: bold; color: #58bd94; }
        .total-label { color: #9f9f9f; margin-top: 4px; }

        .cards { display: flex; flex-direction: column; gap: 12px; }

        .card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 18px;
        }
        .card-top {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 12px;
        }
        .card-icon {
          width: 44px; height: 44px;
          background: rgba(255,255,255,0.06);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }
        .card-info { flex: 1; }
        .card-label { font-size: 15px; font-weight: 500; }
        .card-count { font-size: 13px; color: #9f9f9f; margin-top: 2px; }
        .card-pct { font-size: 18px; font-weight: bold; color: #58bd94; }

        .bar-bg {
          height: 6px;
          background: rgba(255,255,255,0.08);
          border-radius: 3px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #145c46, #58bd94);
          border-radius: 3px;
          transition: width 0.6s ease;
        }

        .refresh {
          display: block;
          margin: 24px auto 0;
          background: rgba(255,255,255,0.06);
          color: white;
          border: 1px solid rgba(255,255,255,0.12);
          padding: 12px 28px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        }
        .refresh:hover { background: rgba(255,255,255,0.1); }

        .loading, .error {
          text-align: center;
          padding: 40px;
          color: #9f9f9f;
        }
        .error { color: #ff6b6b; }
      `}</style>
    </>
  );
}
