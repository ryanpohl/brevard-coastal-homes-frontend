'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

/**
 * Where the "Sign in" button in a sign-in code email lands (2026-11-23,
 * password-free sign-in). The visitor taps "Sign in" here to finish: email
 * security scanners open links in emails on their own, so signing in waits
 * for a real tap instead of happening when the page loads. Then it goes back
 * to the page they were on (`next`), or My Account.
 */
function SignInInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { loginWithLink, signedIn, user } = useAuth();
  const [state, setState] = useState({ busy: false, error: '' });
  const token = params.get('token') || '';
  const nextRaw = params.get('next') || '/my-account';
  const next = /^\/[^/\\]/.test(nextRaw) ? nextRaw : '/my-account';

  async function go() {
    setState({ busy: true, error: '' });
    try {
      await loginWithLink(token);
      router.replace(next);
    } catch (err) {
      setState({ busy: false, error: err.message || 'Something went wrong. Please try again.' });
    }
  }

  return (
    <div className="container" style={{ padding: '64px clamp(16px, 4vw, 56px)', maxWidth: 520 }}>
      <div className="card" style={{ padding: 28, textAlign: 'center' }}>
        <h1 style={{ fontSize: 26, marginBottom: 10 }}>Sign in to Brevard Coastal Homes</h1>
        {signedIn && !state.busy ? (
          <>
            <p style={{ marginBottom: 18 }}>You&rsquo;re signed in{user?.name ? ` as ${user.name}` : ''}.</p>
            <button type="button" className="btn btn-gold" onClick={() => router.replace(next)}>
              Continue
            </button>
          </>
        ) : !token ? (
          <p>This sign-in link is missing its code. Use &ldquo;Sign In&rdquo; at the top of the page to get a new one.</p>
        ) : (
          <>
            <p style={{ marginBottom: 18, color: 'var(--color-muted-dark)' }}>Tap below to finish signing in on this device.</p>
            <button type="button" className="btn btn-gold" onClick={go} disabled={state.busy}>
              {state.busy ? 'Signing in…' : 'Sign in'}
            </button>
            {state.error && (
              <p className="error-text" style={{ marginTop: 14 }}>
                {state.error}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInInner />
    </Suspense>
  );
}
