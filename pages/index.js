// pages/index.js
import Head from 'next/head';
import { useState } from 'react';

const LINKS_CONFIG = [
  { key: 'website',   icon: '🌐', label: 'Website' },
  { key: 'whatsapp',  icon: '💬', label: 'WhatsApp' },
  { key: 'zagatclub', icon: '🚀', label: 'Zagat Club' },
  { key: 'reviews',   icon: '⭐', label: 'Reviews' },
];

export default function Home() {
  const [openPanel, setOpenPanel] = useState(null);

  const toggle = (key) => setOpenPanel(openPanel === key ? null : key);

  return (
    <>
      <Head>
        <title>Zagat Boutique</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="container">
        <div className="card">

          <div className="profile">
            <div className="avatar">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop"
                alt="Zagat Boutique"
              />
            </div>
            <h1>Zagat Boutique</h1>
            <div className="bio">
              Luxury bags &amp; accessories.<br />
              Worldwide shipping.
            </div>
          </div>

          <div className="links">
            {LINKS_CONFIG.map(({ key, icon, label }) => (
              <a
                key={key}
                className="link"
                href={`/api/go/${key}`}
                /* открываем в новой вкладке — пользователь остаётся на странице */
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="left">
                  <div className="icon">{icon}</div>
                  <div>{label}</div>
                </div>
                <div>→</div>
              </a>
            ))}
          </div>

          <div className="section">
            <button className="accordion" onClick={() => toggle('about')}>
              About
            </button>
            {openPanel === 'about' && (
              <div className="panel">
                Zagat Boutique is a luxury destination specializing in premium
                handbags and accessories with worldwide shipping.
              </div>
            )}
          </div>

          <div className="section">
            <button className="accordion" onClick={() => toggle('faq')}>
              FAQ
            </button>
            {openPanel === 'faq' && (
              <div className="panel">
                <b>Do you ship worldwide?</b><br /><br />
                Yes, we provide worldwide shipping with tracking.
                <br /><br />
                <b>Do you provide QC?</b><br /><br />
                Yes, every order receives QC photos and videos before shipping.
              </div>
            )}
          </div>

          <div className="footer">© Zagat Boutique</div>

        </div>
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
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .container { width: 100%; max-width: 450px; }

        .card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(20px);
          border-radius: 28px;
          padding: 30px;
        }

        .profile { text-align: center; margin-bottom: 30px; }

        .avatar {
          width: 100px; height: 100px;
          border-radius: 50%;
          margin: 0 auto 15px;
          overflow: hidden;
        }
        .avatar img { width: 100%; height: 100%; object-fit: cover; }

        h1 { font-size: 32px; margin-bottom: 10px; }
        .bio { color: #c7c7c7; line-height: 1.6; }

        .links { display: flex; flex-direction: column; gap: 16px; }

        .link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255,255,255,0.06);
          padding: 18px 20px;
          border-radius: 18px;
          text-decoration: none;
          color: white;
          transition: 0.25s;
        }
        .link:hover {
          transform: translateY(-3px);
          background: rgba(88,189,148,0.12);
        }

        .left { display: flex; align-items: center; gap: 14px; }

        .icon {
          width: 46px; height: 46px;
          border-radius: 14px;
          background: rgba(255,255,255,0.06);
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 20px;
        }

        .section { margin-top: 25px; }

        .accordion {
          width: 100%;
          background: rgba(255,255,255,0.05);
          color: white;
          border: none;
          padding: 18px;
          border-radius: 16px;
          cursor: pointer;
          text-align: left;
          font-size: 16px;
          margin-bottom: 10px;
          transition: background 0.2s;
        }
        .accordion:hover { background: rgba(255,255,255,0.09); }

        .panel {
          background: rgba(255,255,255,0.03);
          border-radius: 16px;
          padding: 18px;
          line-height: 1.7;
          color: #d3d3d3;
        }

        .footer { margin-top: 25px; text-align: center; color: #9f9f9f; font-size: 13px; }
      `}</style>
    </>
  );
}
