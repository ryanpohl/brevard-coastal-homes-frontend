import ResetPasswordForm from '@/components/ResetPasswordForm';

// Password reset landing page — added 2026-09-28 alongside the fix to
// AuthPanel.js's "Forgot password?" flow (see that file's
// stopNavOutsideClick comment) and to auth.controller.js's
// requestPasswordReset (see its comment for the full story). This page
// didn't exist at all before: the backend's password-reset/confirm
// endpoint and the frontend's api.confirmPasswordReset() were both already
// wired up, but there was nowhere for a visitor to land with their reset
// token and actually enter a new password. The emailed reset link points
// here.
export const metadata = {
  title: 'Reset Your Password | Brevard Coastal Homes',
    robots: { index: false, follow: false },
    };

    export default async function ResetPasswordPage({ searchParams: searchParamsPromise }) {
      // Next.js 15: searchParams is a Promise — same pattern as app/search/page.js.
        const searchParams = await searchParamsPromise;
          const token = (searchParams.token || '').trim();

            return (
                <div className="container" style={{ padding: '48px clamp(16px, 4vw, 56px) 64px', maxWidth: 460 }}>
                      <h1 style={{ fontSize: 'clamp(24px, 3vw, 32px)', marginBottom: 20 }}>Reset Your Password</h1>
                            <ResetPasswordForm token={token} />
                                </div>
                                  );
                                  }
                                  
