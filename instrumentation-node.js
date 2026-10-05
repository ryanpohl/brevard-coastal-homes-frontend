// Node-only half of instrumentation.js (2026-10-05): split out so the
// Edge build that middleware.js triggers never sees fs/os/path. See
// instrumentation.js for what this does and when it's skipped.
export function startIndexNow() {
  if (process.env.NEXT_PHASE === 'phase-production-build') return;
  if (process.env.NODE_ENV !== 'production') return;
  if (process.env.INDEXNOW_DISABLED === 'true') return;
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  if (/localhost|127\.0\.0\.1/.test(apiBase) && !process.env.INDEXNOW_ENDPOINT) return;

  const delayMs = Number(process.env.INDEXNOW_DELAY_MS ?? 60000);
  const timer = setTimeout(async () => {
    try {
      // Hostinger runs two server processes per deploy, so only the first
      // to claim this build's lock file sends the ping (otherwise every
      // deploy submits twice). Keyed by .next/BUILD_ID, so each new deploy
      // pings once.
      const fs = await import('fs');
      const os = await import('os');
      const path = await import('path');
      let buildId = 'unknown';
      try {
        buildId = fs.readFileSync(path.join(process.cwd(), '.next', 'BUILD_ID'), 'utf8').trim();
      } catch {}
      try {
        fs.writeFileSync(path.join(os.tmpdir(), `indexnow-${buildId}.lock`), String(process.pid), { flag: 'wx' });
      } catch {
        return; // another process for this build already sent it
      }
      const { pingIndexNow } = await import('./lib/indexnow');
      const { status, count } = await pingIndexNow();
      console.log(`IndexNow: submitted ${count} URLs (status ${status})`);
    } catch (err) {
      console.error('IndexNow: ping failed —', err.message);
    }
  }, delayMs);
  timer.unref?.();
}
