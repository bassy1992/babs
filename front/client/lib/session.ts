/**
 * Session key management for cart
 */

const SESSION_KEY_STORAGE = 'cart_session_key';

export function getSessionKey(): string {
  let sessionKey = localStorage.getItem(SESSION_KEY_STORAGE);
  
  if (!sessionKey) {
    // Generate a unique session key
    sessionKey = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(SESSION_KEY_STORAGE, sessionKey);
  }
  
  return sessionKey;
}

export function clearSessionKey(): void {
  localStorage.removeItem(SESSION_KEY_STORAGE);
}
