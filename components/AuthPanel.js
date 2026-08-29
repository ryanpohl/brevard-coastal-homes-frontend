'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import * as api from '@/lib/api';

/**
 * Sign In/Register panel — combined into one entry point with a Log In /
 * Register tab switcher (2026-08-16, per Ryan: "would it be smart to
 * combine the Sign in & Join buttons... into Log in/Register button" and
 * two reference screenshots showing a tabbed Log In/Register panel).
 * Previously Nav.js rendered two separate AuthPanel instances (mode=
 * 'signin'/'join', controlled by which of two separate nav buttons was
 * clicked), with no way to switch between them short of closing and
 * reopening via the OTHER nav button. Now there's a single "Sign
 * In/Register" nav button and this panel owns its own tab state
 * internally, defaulting to the Log In tab.
 *
 * Styling note: Ryan's reference screenshots had a white background with
 * light blue buttons — confirmed with him this was just to show the
 * tab-switcher CONCEPT, and the panel should keep the site's own dark
 * navy/gold theme rather than adopt those colors. `.nav-dropdown-panel`
 * (globals.css) is unchanged from before this redesign.
 *
 * `message` / `embedded` added 2026-08-29 so this same form can also be
 * used by AuthPromptModal.js (the "sign in to save a property" popup
 * triggered from a listing card's heart icon), not just Nav.js's own
 * Sign In/Register dropdown:
 *  - `message`, when set, renders a line of context above the tabs (e.g.
 *    "Sign in to save this property to your favorites") explaining why
 *    the panel appeared. Nav.js doesn't pass one, so its dropdown is
 *    unchanged.
 *  - `embedded`, when true, drops the dropdown-specific positioning
 *    (`position: absolute` anchored under the nav's Sign In/Register
 *    button) in favor of a plain block that fills whatever container it's
 *    placed in — AuthPromptModal supplies its own centered `.modal-overlay`
 *    positioning instead.
 */
export default function AuthPanel({ onClose, message, embedded = false }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin' | 'join' | 'reset'
  const [fields, setFields] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    workingWithAgent: false,
    remember: true,
  });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function update(key, value) {
    setFields((f) => ({ ...f, [key]: value }));
  }

  // Switches tabs AND clears any error/notice left over from the other
  // tab's last attempt — without this, a failed Log In error would still
  // be showing after switching to Register (or vice versa).
  function switchTab(nextMode) {
    setMode(nextMode);
    setError('');
    setNotice('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setNotice('');

    // Confirm Password is a client-side-only check (2026-08-16, Register
    // tab) — the backend never sees confirmPassword, just password.
    if (mode === 'join' && fields.password !== fields.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'signin') {
        // "Remember me on this machine" (2026-08-16) — see
        // auth-context.js's persist()/login() for what this actually
        // controls (localStorage vs. session-only sessionStorage).
        await login(fields.email, fields.password, fields.remember);
        onClose();
      } else if (mode === 'join') {
        // phone/workingWithAgent are both optional — see backend's
        // schema.sql comment on users.phone/users.working_with_agent.
        await register(fields.name, fields.email, fields.password, fields.phone || undefined, fields.workingWithAgent);
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
    <div className="nav-dropdown-panel" style={embedded ? embeddedPanelStyle : panelStyle}>
      {message && (
        <p style={{ color: '#fff', fontSize: 14, fontWeight: 600, textAlign: 'center', marginBottom: 18, lineHeight: 1.4 }}>
          {message}
        </p>
      )}
      {mode === 'reset' ? (
        <h3 style={{ fontSize: 18, marginBottom: 16 }}>Reset Password</h3>
      ) : (
        <div style={tabRowStyle}>
          <button
            type="button"
            onClick={() => switchTab('signin')}
            style={mode === 'signin' ? tabActiveStyle : tabInactiveStyle}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchTab('join')}
            style={mode === 'join' ? tabActiveStyle : tabInactiveStyle}
          >
            Register
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {mode === 'join' && (
          <Field label="Name">
            <input required value={fields.name} onChange={(e) => update('name', e.target.value)} type="text" />
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
        {mode === 'join' && (
          <Field label="Confirm Password">
            <input
              required
              minLength={8}
              value={fields.confirmPassword}
              onChange={(e) => update('confirmPassword', e.target.value)}
              type="password"
            />
          </Field>
        )}
        {mode === 'join' && (
          <Field label="Phone Number">
            <input value={fields.phone} onChange={(e) => update('phone', e.target.value)} type="tel" />
          </Field>
        )}

        {mode === 'signin' && (
          <label style={checkboxRowStyle}>
            <input
              type="checkbox"
              checked={fields.remember}
              onChange={(e) => update('remember', e.target.checked)}
            />
            Remember me on this machine
          </label>
        )}
        {mode === 'join' && (
          <label style={checkboxRowStyle}>
            <input
              type="checkbox"
              checked={fields.workingWithAgent}
              onChange={(e) => update('workingWithAgent', e.target.checked)}
            />
            I am working with an agent
          </label>
        )}

        {error && (
          <p className="error-text" style={{ marginBottom: 12 }}>
            {error}
          </p>
        )}
        {notice && <p style={{ color: '#7bd8a0', fontSize: 13, marginBottom: 12 }}>{notice}</p>}

        <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%' }}>
          {submitting ? 'Please wait…' : mode === 'signin' ? 'Sign In' : mode === 'join' ? 'Create Account' : 'Send Reset Link'}
        </button>
      </form>

      <div style={{ marginTop: 14, fontSize: 12, textAlign: 'center' }}>
        {mode === 'signin' && (
          <button type="button" onClick={() => switchTab('reset')} style={linkBtnStyle}>
            Forgot password?
          </button>
        )}
        {mode === 'reset' && (
          <button type="button" onClick={() => switchTab('signin')} style={linkBtnStyle}>
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

const panelStyle = {
  position: 'absolute',
  top: '100%',
  right: 0,
  marginTop: 8,
  padding: 20,
  width: 300,
  boxShadow: 'var(--shadow-nav-menu)',
  zIndex: 40,
};

// See the `embedded` prop doc comment above — used by AuthPromptModal.js,
// which already provides its own centered/fixed positioning and shadow via
// `.modal-overlay`, so this just needs to fill that container.
const embeddedPanelStyle = {
  padding: 24,
  width: '100%',
};

// Log In / Register tab switcher (2026-08-16). Segmented-control look using
// the site's existing gold/navy palette (--color-gold for the active tab,
// matching the old standalone "Join" button's accent color) rather than the
// reference screenshots' white/light-blue styling — see this file's top
// comment for why.
const tabRowStyle = {
  display: 'flex',
  marginBottom: 18,
  borderRadius: 4,
  overflow: 'hidden',
  border: '1px solid rgba(255, 255, 255, 0.25)',
};
const tabBaseStyle = {
  flex: 1,
  padding: '10px 0',
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 1,
  textTransform: 'uppercase',
  border: 'none',
  cursor: 'pointer',
  textAlign: 'center',
};
const tabActiveStyle = { ...tabBaseStyle, background: 'var(--color-gold)', color: 'var(--color-ink-dark)' };
const tabInactiveStyle = { ...tabBaseStyle, background: 'transparent', color: 'rgba(255, 255, 255, 0.75)' };

const checkboxRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 12,
  color: 'rgba(255, 255, 255, 0.85)',
  marginBottom: 14,
  cursor: 'pointer',
};

const linkBtnStyle = {
  background: 'none',
  border: 'none',
  color: 'rgba(255, 255, 255, 0.85)',
  textDecoration: 'underline',
  cursor: 'pointer',
  fontSize: 12,
};
