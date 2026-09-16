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
  // Show/hide password toggle (2026-09-16, per Ryan, pasting screenshots of
  // both the Sign In and Register tabs of this same panel: "Can you add the
  // eye icon next to the passwords on these so if the person clicks on the
  // icon they can see their password to make sure they are entering it in
  // correct.") — two independent booleans since Password and Confirm
  // Password (Register tab only) should toggle separately; a person
  // double-checking a typo in one shouldn't be forced to also reveal the
  // other. Both default to false (masked), matching how every browser's own
  // native password-reveal control starts.
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
            <div style={passwordFieldWrapperStyle}>
              <input
                required
                minLength={8}
                value={fields.password}
                onChange={(e) => update('password', e.target.value)}
                type={showPassword ? 'text' : 'password'}
                style={passwordInputStyle}
              />
              <button
                type="button"
                onClick={(e) => {
                  // Stop this click from bubbling to Nav.js's document-level
                  // "click outside closes the panel" listener (2026-09-16,
                  // per Ryan: "When i click on the eye icon to show the
                  // password the whole sign in pop up box disappears. Same
                  // thing happens on the Register pop up box.") — Nav.js's
                  // handleOutsideInteraction listens on document for both
                  // 'click' and 'touchstart' the whole time this panel is
                  // open, and unconditionally closes it (setOpenMenu(null))
                  // for ANY click it sees that isn't inside its containerRef
                  // — unlike its sibling closeNow, it has no isAuth/isAccount
                  // guard. This button lives inside a <label> (Field's own
                  // wrapper) — clicking it forwards a second synthetic click
                  // to the label's associated password <input>, and that
                  // forwarded event is what was reaching document and
                  // reading as an "outside" click. onMouseDown/onTouchStart
                  // below stop the same thing happening on touch devices,
                  // where 'touchstart' fires (and would already have closed
                  // the panel) before 'click' ever does.
                  e.stopPropagation();
                  setShowPassword((v) => !v);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                style={passwordToggleBtnStyle}
                // No visible label of its own (icon-only button) — aria-label
                // is the accessible name a screen reader announces, and it
                // flips with the toggle state same as the icon does.
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </Field>
        )}
        {mode === 'join' && (
          <Field label="Confirm Password">
            <div style={passwordFieldWrapperStyle}>
              <input
                required
                minLength={8}
                value={fields.confirmPassword}
                onChange={(e) => update('confirmPassword', e.target.value)}
                type={showConfirmPassword ? 'text' : 'password'}
                style={passwordInputStyle}
              />
              <button
                type="button"
                onClick={(e) => {
                  // Same outside-click-listener fix as the Password field's
                  // own toggle above — see that button's comment for the
                  // full explanation.
                  e.stopPropagation();
                  setShowConfirmPassword((v) => !v);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                style={passwordToggleBtnStyle}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
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

const linkBtnStyle = {
  background: 'none',
  border: 'none',
  color: 'rgba(255, 255, 255, 0.85)',
  textDecoration: 'underline',
  cursor: 'pointer',
  fontSize: 12,
};
