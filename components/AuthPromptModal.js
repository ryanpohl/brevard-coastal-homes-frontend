'use client';

import { createPortal } from 'react-dom';
import AuthPanel from './AuthPanel';

/**
 * Pops up the site's Sign In/Register form as a centered modal, for
 * anywhere a signed-out visitor tries to do something that requires an
 * account (2026-08-29, per Ryan: the favorite heart on listing cards did
 * nothing when clicked while signed out — he asked whether a message or
 * the Sign In/Register box popping up would be better, and picked the
 * popup after being shown both as options). Rendered by AuthPromptHost
 * (mounted in app/layout.js) whenever lib/auth-context.js's
 * `authPrompt.open` is true — triggered via that context's
 * `promptSignIn(message)`.
 *
 * Deliberately its own modal rather than reusing Nav.js's inline
 * Sign In/Register dropdown: that dropdown is `position: absolute`,
 * anchored under the nav's own button (see AuthPanel.js's `panelStyle`),
 * so it only makes sense right under that button. A listing card's heart
 * icon can be anywhere on a long, scrolled page, so this instead follows
 * the same body-level `.modal-overlay` portal pattern already established
 * by ContactModal.js/ScheduleShowingModal.js/PropertyContactPanel.js's
 * ModalShell — fixed, centered, and visible regardless of scroll
 * position. Reuses the exact same AuthPanel form (tabs, fields, submit
 * logic, "remember me", forgot password) via its `embedded`/`message`
 * props rather than duplicating any of that.
 *
 * Closes on backdrop click, the × button, or a successful sign in/
 * register (AuthPanel's onSubmit already calls onClose() on success).
 */
export default function AuthPromptModal({ message, onClose }) {
  const modal = (
    <div className="modal-overlay" onClick={onClose}>
      <div
        style={{
          background: 'var(--color-nav-bg)',
          borderRadius: 6,
          width: 'min(340px, 100%)',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 12,
            right: 14,
            cursor: 'pointer',
            fontSize: 20,
            color: 'rgba(255,255,255,0.75)',
            lineHeight: 1,
            background: 'none',
            border: 'none',
            zIndex: 1,
          }}
        >
          ×
        </button>
        <AuthPanel onClose={onClose} message={message} embedded />
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
