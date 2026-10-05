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
  // Next replaces NEXT_RUNTIME at build time, so the Edge bundle (built
  // because middleware.js exists) drops this branch and never pulls in the
  // Node-only IndexNow code in instrumentation-node.js.
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { startIndexNow } = await import('./instrumentation-node');
    startIndexNow();
  }
}
