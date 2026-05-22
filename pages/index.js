// pages/index.js
import Head from "next/head";

const LINKS = [
  { key: "website",   icon: "👜", label: "Website",    desc: "Shop the collection" },
  { key: "whatsapp",  icon: "💬", label: "WhatsApp",   desc: "Chat with us" },
  { key: "zagatclub", icon: "🗝️", label: "Zagat Club", desc: "Join our Telegram" },
  { key: "reviews",   icon: "⭐", label: "Reviews",    desc: "See what clients say" },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>Zagat Boutique — Links</title>
        <meta name="description" content="Zagat Boutique — luxury bags & accessories. All links in one place." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#060f0b" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💎</text></svg>" />
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

        <main className="card">
          {/* Profile */}
          <div className="profile">
            <div className="avatar-ring">
              <div className="avatar">
                <img
                  src="/logo.jpg"
                  alt="Zagat Boutique"
                  loading="eager"
                />
              </div>
            </div>
            <h1>Zagat Boutique</h1>
            <p className="tagline">Luxury bags & accessories · Worldwide shipping</p>
          </div>

          {/* Links */}
          <nav className="links">
            {LINKS.map(({ key, icon, label, desc }, i) => (
              <a
                key={key}
                className="link"
                href={`/api/go/${key}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ animationDelay: `${0.1 + i * 0.07}s` }}
              >
                <span className="link-icon">{icon}</span>
                <span className="link-text">
                  <span className="link-label">{label}</span>
                  <span className="link-desc">{desc}</span>
                </span>
                <span className="link-arrow">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M17 7H7M17 7v10"/>
                  </svg>
                </span>
              </a>
            ))}
          </nav>

          {/* Footer */}
          <footer className="footer">
            © {new Date().getFullYear()} Zagat Boutique
          </footer>
        </main>
      </div>

      <style jsx global>{`
        *, *::before, *::after {
          margin: 0; padding: 0; box-sizing: border-box;
        }

        html {
          -webkit-text-size-adjust: 100%;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        body {
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          min-height: 100vh;
          min-height: 100dvh;
          background: #060f0b;
          color: #f0f0f0;
          overflow-x: hidden;
        }
      `}</style>

      <style jsx>{`
        /* Page */
        .page {
          position: relative;
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 24px 16px;
          padding: 24px 16px env(safe-area-inset-bottom, 0px);
        }

        /* Background glows */
        .glow {
          position: fixed;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          z-index: 0;
        }
        .glow-1 {
          width: 500px; height: 500px;
          top: -120px; left: -100px;
          background: radial-gradient(circle, rgba(20,92,70,0.35), transparent 70%);
        }
        .glow-2 {
          width: 400px; height: 400px;
          bottom: -80px; right: -80px;
          background: radial-gradient(circle, rgba(88,189,148,0.15), transparent 70%);
        }

        /* Card */
        .card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: 24px;
          padding: 36px 24px 28px;
          animation: cardIn 0.5s ease-out both;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Profile */
        .profile {
          text-align: center;
          margin-bottom: 28px;
        }

        .avatar-ring {
          width: 96px; height: 96px;
          margin: 0 auto 16px;
          border-radius: 50%;
          padding: 3px;
          background: linear-gradient(135deg, #145c46, #58bd94, #145c46);
          animation: ringPulse 4s ease-in-out infinite;
        }

        @keyframes ringPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(88,189,148,0.15); }
          50%      { box-shadow: 0 0 20px 4px rgba(88,189,148,0.1); }
        }

        .avatar {
          width: 100%; height: 100%;
          border-radius: 50%;
          overflow: hidden;
          background: #0a1a14;
        }
        .avatar img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }

        h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 600;
          font-size: 26px;
          letter-spacing: -0.01em;
          margin-bottom: 6px;
          color: #ffffff;
        }

        .tagline {
          font-size: 13px;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.02em;
        }

        /* Links */
        .links {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .link {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          text-decoration: none;
          color: #f0f0f0;
          transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
          animation: linkIn 0.4s ease-out both;
        }

        @keyframes linkIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .link:hover, .link:focus-visible {
          transform: translateY(-2px);
          background: rgba(88,189,148,0.1);
          border-color: rgba(88,189,148,0.2);
        }
        .link:active {
          transform: translateY(0) scale(0.98);
        }

        .link-icon {
          width: 42px; height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: rgba(255,255,255,0.06);
          font-size: 18px;
          flex-shrink: 0;
        }

        .link-text {
          flex: 1;
          min-width: 0;
        }

        .link-label {
          display: block;
          font-weight: 500;
          font-size: 15px;
          line-height: 1.3;
        }

        .link-desc {
          display: block;
          font-size: 12px;
          color: rgba(255,255,255,0.38);
          margin-top: 1px;
        }

        .link-arrow {
          flex-shrink: 0;
          color: rgba(255,255,255,0.25);
          transition: color 0.2s, transform 0.2s;
        }
        .link:hover .link-arrow {
          color: #58bd94;
          transform: translate(2px, -2px);
        }

        /* Footer */
        .footer {
          margin-top: 24px;
          text-align: center;
          font-size: 11px;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.04em;
        }

        /* ----- Responsive ----- */

        /* Small phones */
        @media (max-width: 360px) {
          .card { padding: 28px 18px 22px; border-radius: 20px; }
          h1 { font-size: 22px; }
          .avatar-ring { width: 80px; height: 80px; }
          .link { padding: 12px 14px; gap: 12px; }
          .link-icon { width: 38px; height: 38px; font-size: 16px; border-radius: 10px; }
          .link-label { font-size: 14px; }
          .link-desc { font-size: 11px; }
        }

        /* Tablets */
        @media (min-width: 768px) {
          .card { max-width: 440px; padding: 44px 32px 34px; }
          h1 { font-size: 30px; }
          .link { padding: 16px 20px; }
        }

        /* Desktop */
        @media (min-width: 1024px) {
          .card { max-width: 460px; padding: 48px 36px 36px; border-radius: 28px; }
        }

        /* Landscape phones — less vertical padding */
        @media (max-height: 500px) and (orientation: landscape) {
          .page { padding: 12px 16px; align-items: flex-start; }
          .card { padding: 20px 24px 18px; }
          .profile { margin-bottom: 16px; }
          .avatar-ring { width: 64px; height: 64px; margin-bottom: 10px; }
          .links { gap: 8px; }
          .link { padding: 10px 14px; }
          .link-icon { width: 36px; height: 36px; }
        }

        /* Respect prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          .card, .link, .avatar-ring { animation: none; }
          .link:hover { transform: none; }
        }
      `}</style>
    </>
  );
}
