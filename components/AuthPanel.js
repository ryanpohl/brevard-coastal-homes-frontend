'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import * as api from '@/lib/api';

/**
 * Sign In / Join / Reset Password panel — all three render inside the same
 * dropdown-style panel, matching the design spec (email/password fields,
 * submit, inline error text, "forgot password" toggles to reset mode).
 *
 * `mode` is controlled by the parent (Nav) so opening "Sign In" vs "Join"
 * starts on the right form; the panel itself only manages the reset toggle.
 */
export default function AuthPanel({ mode: initialMode, onClose }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'signin' | 'join' | 'reset'
  const [fields, setFields] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function update(key, value) {
    setFields((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setNotice('');
    setSubmitting(true);
    try {
      if (mode === 'signin') {
        await login(fields.email, fields.password);
        onClose();
      } else if (mode === 'join') {
        await register(fields.name, fields.email, fields.password);
        onClose();
      } else if (mode === 'reset') {
        const res = await api.requestPasswordReset(fields.email);
        setNotice(res.message || 'If that email exists, a reset link has been generated.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="nav-dropdown-panel"
      style={{
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: 8,
        padding: 20,
        width: 300,
        boxShadow: 'var(--shadow-nav-menu)',
        zIndex: 40,
      }}
    >
      <h3 style={{ fontSize: 18, marginBottom: 16 }}>
        {mode === 'signin' ? 'Sign In' : mode === 'join' ? 'Join' : 'Reset Password'}
      </h3>
      <form onSubmit={handleSubmit}>
        {mode === 'join' && (
          <Field label="Name">
            <input
              required
              value={fields.name}
              onChange={(e) => update('name', e.target.value)}
              type="text"
            />
          </Field>
        )}
        <Field label="Email">
          <input required value={fields.email} onChange={(e) => update('email', e.target.value)} type="email" />
        </Field>
        {mode !== 'reset' && (
          <Field label="Password">
            <input
              required
              minLength={8}
              value={fields.password}
              onChange={(e) => update('password', e.target.value)}
              type="password"
            />
          </Field>
        )}

        {error && <p className="error-text" style={{ marginBottom: 12 }}>{error}</p>}
        {notice && <p style={{ color: '#7bd8a0', fontSize: 13, marginBottom: 12 }}>{notice}</p>}

        <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%' }}>
          {submitting ? 'Please wait…' : mode === 'signin' ? 'Sign In' : mode === 'join' ? 'Create Account' : 'Send Reset Link'}
        </button>
      </form>

      <div style={{ marginTop: 14, fontSize: 12, textAlign: 'center' }}>
        {mode === 'signin' && (
          <button type="button" onClick={() => setMode('reset')} style={linkBtnStyle}>
            Forgot password?
          </button>
        )}
        {mode === 'reset' && (
          <button type="button" onClick={() => setMode('signin')} style={linkBtnStyle}>
            Back to sign in
          </button>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'block', marginBottom: 12, fontSize: 12, fontWeight: 600 }}>
      {label}
      <div style={{ marginTop: 4 }}>{children}</div>
    </label>
  );
}

const linkBtnStyle = {
  background: 'none',
  border: 'none',
  color: 'rgba(255, 255, 255, 0.85)',
  textDecoration: 'underline',
  cursor: 'pointer',
  fontSize: 12,
};
