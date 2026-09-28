'use client';

import { useState } from 'react';
import * as api from '@/lib/api';

/**
 * The form half of app/reset-password/page.js — added 2026-09-28, per Ryan
 * ("I hit forgot password on ryan@brevardcoastalhomes.com &
 * ryanpohl12@gmail.com & didn't receive an email to either account").
 * Two separate gaps led to that: the backend's requestPasswordReset never
 * actually sent an email at all (fixed in auth.controller.js, same commit
 * as this file), AND even if it had, there was nowhere on the site for the
 * emailed link to point to — this page/component is that missing landing
 * spot. `token` comes from the page's own `?token=` query param.
 *
 * Styled to match ContactForm.js's plain `.card` form convention rather
 * than AuthPanel.js's nav-dropdown styling, since this is a full standalone
 * page, not a dropdown panel.
 *
 * No token in the URL (someone navigated here directly, or a stale/already
 * bookmarked link) — shown a plain message instead of a form that would
 * just 400 on submit, pointing back to the normal "Forgot password?" flow.
 */
export default function ResetPasswordForm({ token }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState({ submitting: false, error: '', success: '' });

  if (!token) {
    return (
      <div className="card" style={{ padding: 24 }}>
        <p className="error-text">
          This password reset link is missing its token. Go back to the homepage, click Sign In/Register, then
          &quot;Forgot password?&quot; to request a new one.
        </p>
      </div>
    );
  }

  async function submit(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus({ submitting: false, error: 'Passwords do not match.', success: '' });
      return;
    }
    setStatus({ submitting: true, error: '', success: '' });
    try {
      const result = await api.confirmPasswordReset({ token, newPassword });
      setStatus({
        submitting: false,
        error: '',
        success: result.message || 'Your password has been reset. You can now sign in.',
      });
    } catch (err) {
      setStatus({ submitting: false, error: err.message || 'Something went wrong. Please try again.', success: '' });
    }
  }

  if (status.success) {
    return (
      <div className="card" style={{ padding: 24 }}>
        <p style={{ color: 'var(--color-success)', marginBottom: 16 }}>{status.success}</p>
        <a href="/" className="btn btn-primary">
          Go to Homepage
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <input
        type="password"
        placeholder="New Password"
        required
        minLength={8}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        required
        minLength={8}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {status.error && <p className="error-text">{status.error}</p>}
      <button type="submit" className="btn btn-primary" disabled={status.submitting}>
        {status.submitting ? 'Resetting…' : 'Reset Password'}
      </button>
    </form>
  );
}
