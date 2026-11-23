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
  const { login, register, loginWithCode } = useAuth();
  // Password-free sign-in (2026-11-23, per Ryan): Sign In emails a 4-digit
  // code; Register needs no password. 'signin' (email) -> 'code' (enter the
  // code); 'password' is the old email + password sign-in for accounts that
  // have one; 'join' is Register.
  const [mode, setMode] = useState('signin'); // 'signin' | 'code' | 'password' | 'join'
  const [fields, setFields] = useState({
    name: '',
    email: '',
    password: '',
    code: '',
    phone: '',
    workingWithAgent: false,
    remember: true,
  });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  // Show/hide password toggle (2026-09-16, per Ryan) — password sign-in only now.
  const [showPassword, setShowPassword] = useState(false);

  function update(key, value) {
    setFields((f) => ({ ...f, [key]: value }));
  }

  // Prevents Nav.js's document-level "click outside closes this dropdown"
  // listener from closing the panel when a button inside it swaps what the
  // panel shows (root cause traced 2026-09-16 and 2026-09-28: Nav's listener
  // sits on `document`, so only stopImmediatePropagation stops it). Every
  // button that calls switchTab needs this on onMouseDown/onTouchStart too.
  function stopNavOutsideClick(e) {
    e.nativeEvent.stopImmediatePropagation();
  }

  function switchTab(nextMode) {
    setMode(nextMode);
    setError('');
    setNotice('');
  }

  const returnTo = () => {
    try {
      return window.location.pathname + window.location.search;
    } catch {
      return '/my-account';
    }
  };

  async function sendCode(email, note) {
    await api.requestEmailCode(email, returnTo());
    setMode('code');
    setError('');
    setNotice(note || `We emailed a 4-digit code to ${email}. It works for 15 minutes.`);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setNotice('');
    setSubmitting(true);
    const email = fields.email.trim();
    try {
      if (mode === 'signin') {
        await sendCode(email);
      } else if (mode === 'code') {
        await loginWithCode(email, fields.code);
        onClose();
      } else if (mode === 'password') {
        // "Remember me on this machine" — see auth-context.js's persist().
        await login(email, fields.password, fields.remember);
        onClose();
      } else if (mode === 'join') {
        // No password (2026-11-23). phone / "working with an agent" optional.
        await register(fields.name, email, undefined, fields.phone || undefined, fields.workingWithAgent);
        onClose();
      }
    } catch (err) {
      const code = err && err.data && err.data.code;
      try {
        if (mode === 'join' && code === 'exists') {
          await sendCode(email, `You already have an account. We emailed a 4-digit code to ${email} so you can sign in.`);
          return;
        }
        if (mode === 'password' && code === 'use_code') {
          await sendCode(email, `This account doesn't use a password. We emailed a 4-digit code to ${email}.`);
          return;
        }
      } catch (err2) {
        setError(err2.message || 'Something went wrong. Please try again.');
        return;
      }
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const linkProps = (next) => ({
    type: 'button',
    onMouseDown: stopNavOutsideClick,
    onTouchStart: stopNavOutsideClick,
    onClick: (e) => {
      stopNavOutsideClick(e);
      switchTab(next);
    },
    style: linkBtnStyle,
  });

  const submitLabel =
    mode === 'signin' ? 'Email Me a Code' : mode === 'code' ? 'Sign In' : mode === 'password' ? 'Sign In' : 'Create Account';
  const signInTab = mode !== 'join';

  return (
    <div className="nav-dropdown-panel" style={embedded ? embeddedPanelStyle : panelStyle}>
      {message && (
        <p style={{ color: '#fff', fontSize: 14, fontWeight: 600, textAlign: 'center', marginBottom: 18, lineHeight: 1.4 }}>
          {message}
        </p>
      )}
      <div style={tabRowStyle}>
        <button
          type="button"
          onMouseDown={stopNavOutsideClick}
          onTouchStart={stopNavOutsideClick}
          onClick={(e) => {
            stopNavOutsideClick(e);
            switchTab('signin');
          }}
          style={signInTab ? tabActiveStyle : tabInactiveStyle}
        >
          Sign In
        </button>
        <button
          type="button"
          onMouseDown={stopNavOutsideClick}
          onTouchStart={stopNavOutsideClick}
          onClick={(e) => {
            stopNavOutsideClick(e);
            switchTab('join');
          }}
          style={mode === 'join' ? tabActiveStyle : tabInactiveStyle}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {mode === 'join' && (
          <Field label="Name">
            <input required value={fields.name} onChange={(e) => update('name', e.target.value)} type="text" autoComplete="name" />
          </Field>
        )}
        {mode !== 'code' && (
          <Field label="Email">
            <input required value={fields.email} onChange={(e) => update('email', e.target.value)} type="email" autoComplete="email" />
          </Field>
        )}
        {mode === 'signin' && (
          <p style={hintStyle}>No password needed. We&rsquo;ll email you a 4-digit code to sign in.</p>
        )}
        {mode === 'code' && (
          <Field label="4-digit code">
            <input
              required
              autoFocus
              value={fields.code}
              onChange={(e) => update('code', e.target.value.replace(/\D/g, '').slice(0, 4))}
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\d{4}"
              maxLength={4}
              placeholder="1234"
              style={{ letterSpacing: 10, fontSize: 22, textAlign: 'center' }}
            />
          </Field>
        )}
        {mode === 'password' && (
          <Field label="Password">
            <div style={passwordFieldWrapperStyle}>
              <input
                required
                minLength={8}
                value={fields.password}
                onChange={(e) => update('password', e.target.value)}
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                style={passwordInputStyle}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.nativeEvent.stopImmediatePropagation();
                  setShowPassword((v) => !v);
                }}
                onMouseDown={(e) => e.nativeEvent.stopImmediatePropagation()}
                onTouchStart={(e) => e.nativeEvent.stopImmediatePropagation()}
                style={passwordToggleBtnStyle}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </Field>
        )}
        {mode === 'join' && (
          <Field label="Phone Number (optional)">
            <input value={fields.phone} onChange={(e) => update('phone', e.target.value)} type="tel" autoComplete="tel" />
          </Field>
        )}

        {mode === 'password' && (
          <label style={checkboxRowStyle}>
            <input type="checkbox" checked={fields.remember} onChange={(e) => update('remember', e.target.checked)} />
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
        {mode === 'join' && <p style={hintStyle}>No password needed.</p>}

        {error && (
          <p className="error-text" style={{ marginBottom: 12 }}>
            {error}
          </p>
        )}
        {notice && <p style={{ color: '#7bd8a0', fontSize: 13, marginBottom: 12, lineHeight: 1.45 }}>{notice}</p>}

        <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%' }}>
          {submitting ? 'Please wait…' : submitLabel}
        </button>
      </form>

      <div style={{ marginTop: 14, fontSize: 12, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {mode === 'signin' && <button {...linkProps('password')}>Sign in with a password instead</button>}
        {mode === 'password' && <button {...linkProps('signin')}>Email me a code instead</button>}
        {mode === 'code' && (
          <>
            <button
              type="button"
              onMouseDown={stopNavOutsideClick}
              onTouchStart={stopNavOutsideClick}
              onClick={async (e) => {
                stopNavOutsideClick(e);
                setError('');
                try {
                  await sendCode(fields.email.trim(), `We sent a new code to ${fields.email.trim()}.`);
                } catch (err) {
                  setError(err.message || 'Something went wrong. Please try again.');
                }
              }}
              style={linkBtnStyle}
            >
              Send a new code
            </button>
            <button {...linkProps('signin')}>Use a different email</button>
          </>
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

// Eye / eye-with-slash icons for the password show/hide toggle above —
// plain inline SVGs (Feather-icon style: 24x24 viewBox, stroke=currentColor,
// no fill) rather than a new icon library dependency, matching how
// FavoriteButton.js's heart uses a simple inline glyph instead of pulling in
// an icon package for one icon. `currentColor` picks up passwordToggleBtnStyle's
// `color` below, so both icons inherit the same muted-ink tone as the rest
// of the form's labels without needing their own color prop.
function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.3 20.3 0 0 1 5.06-6.06M9.9 4.24A10.4 10.4 0 0 1 12 4c7 0 11 8 11 8a20.32 20.32 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <path d="M1 1l22 22" />
    </svg>
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

// Password show/hide toggle layout — the input keeps the same global
// input/select/textarea styling as every other field (app/globals.css)
// except for extra right padding (passwordInputStyle below) to leave room
// for the icon button, which sits absolutely positioned inside the same
// relative wrapper rather than beside the input, so the field keeps its
// full 100% width instead of shrinking to make room for a sibling element.
const passwordFieldWrapperStyle = {
  position: 'relative',
};
const passwordInputStyle = {
  paddingRight: 38,
};
const passwordToggleBtnStyle = {
  position: 'absolute',
  right: 4,
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 30,
  height: 30,
  padding: 0,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--color-muted)',
};

const checkboxRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 12,
  color: 'rgba(255, 255, 255, 0.85)',
  marginBottom: 14,
  cursor: 'pointer',
};

const hintStyle = {
  fontSize: 12,
  color: 'rgba(255, 255, 255, 0.75)',
  margin: '-4px 0 14px',
  lineHeight: 1.4,
};

const linkBtnStyle = {
  background: 'none',
  border: 'none',
  color: 'rgba(255, 255, 255, 0.85)',
  textDecoration: 'underline',
  cursor: 'pointer',
  fontSize: 12,
};
