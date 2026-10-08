'use client';

import { useEffect, useState } from 'react';

// Site-wide safety net for errors in the browser (2026-10-08, per Ryan).
// The usual cause is a tab opened before a deploy: its page asks for the
// previous build's JavaScript files, which the new build no longer has
// (Ryan's "Application error" on the condo pages, fixed by a hard refresh).
// So the first error reloads the page once, which gets the current build;
// if it happens again within a minute, show a friendly message instead of
// a blank error screen. Replaces Next.js's default "Application error".
const RELOAD_KEY = 'bch-error-reload';

export default function GlobalError({ error }) {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    let last = 0;
    try {
      last = Number(sessionStorage.getItem(RELOAD_KEY)) || 0;
    } catch {
      // Storage blocked: fall through to the message after one reload attempt.
    }
    if (Date.now() - last > 60 * 1000) {
      try {
        sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
      } catch {
        // Ignore.
      }
      window.location.reload();
      return;
    }
    console.error(error);
    setShowMessage(true);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#f7f5ef', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif', color: '#1f2a30' }}>
        {showMessage && (
          <div style={{ maxWidth: 520, margin: '18vh auto 0', padding: '0 20px', textAlign: 'center' }}>
            <h1 style={{ fontSize: 26, marginBottom: 12 }}>Something went wrong</h1>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: '#445055', marginBottom: 24 }}>
              This page didn&rsquo;t load correctly. Please try again, or call or text Ryan at 321-350-7661.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{ padding: '12px 22px', fontSize: 15, fontWeight: 600, border: 'none', borderRadius: 4, background: '#1f2a30', color: '#fff', cursor: 'pointer', marginRight: 10 }}
            >
              Reload
            </button>
            <a href="/" style={{ fontSize: 15, fontWeight: 600, color: '#1f2a30' }}>
              Home
            </a>
            <p style={{ fontSize: 13, color: '#667377', marginTop: 28 }}>Ryan Pohl, Tropical Realty &amp; Inv. of Brevard</p>
          </div>
        )}
      </body>
    </html>
  );
}
