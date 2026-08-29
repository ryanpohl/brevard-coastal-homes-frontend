'use client';

import { useAuth } from '@/lib/auth-context';
import AuthPromptModal from './AuthPromptModal';

/**
 * Bridges lib/auth-context.js's global `authPrompt` state to
 * AuthPromptModal.js (2026-08-29). This is its own tiny component, rather
 * than auth-context.js rendering AuthPromptModal directly, to avoid a
 * circular import: AuthPromptModal renders AuthPanel, and AuthPanel calls
 * useAuth() from auth-context.js. Mounted once in app/layout.js, inside
 * <AuthProvider>, alongside Nav/main/Footer — a sibling, not a wrapper, so
 * it doesn't affect layout.
 */
export default function AuthPromptHost() {
  const { authPrompt, closeAuthPrompt } = useAuth();
  if (!authPrompt.open) return null;
  return <AuthPromptModal message={authPrompt.message} onClose={closeAuthPrompt} />;
}
