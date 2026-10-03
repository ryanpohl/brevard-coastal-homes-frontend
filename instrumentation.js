// Next.js runs register() once when a server instance starts — on Hostinger
// that's once per deploy (every push to main). Used only to send the
// IndexNow ping in lib/indexnow.js; see that file for the why.
//
// Skipped during `next build`, outside production, when pointed at a
// local backend (local testing), or when INDEXNOW_DISABLED=true. Waits a
// minute after startup so the new version is serving before search
// engines are told to recrawl, and never throws — a failed ping is only
// logged.
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  if (process.env.NEXT_PHASE === 'phase-production-build') return;
  if (process.env.NODE_ENV !== 'production') return;
  if (process.env.INDEXNOW_DISABLED === 'true') return;
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  if (/localhost|127\.0\.0\.1/.test(apiBase) && !process.env.INDEXNOW_ENDPOINT) return;

  const delayMs = Number(process.env.INDEXNOW_DELAY_MS ?? 60000);
  const timer = setTimeout(async () => {
    try {
      const { pingIndexNow } = await import('./lib/indexnow');
      const { status, count } = await pingIndexNow();
      console.log(`IndexNow: submitted ${count} URLs (status ${status})`);
    } catch (err) {
      console.error('IndexNow: ping failed —', err.message);
    }
  }, delayMs);
  timer.unref?.();
}
