// Utility helpers shared across the app.
export function uuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const KEY = 'vibemeet.session_id';
export function getSessionId() {
  if (typeof window === 'undefined') return '';
  let id = sessionStorage.getItem(KEY);
  if (!id) {
    id = uuid();
    sessionStorage.setItem(KEY, id);
  }
  return id;
}
export function clearSessionId() { sessionStorage.removeItem(KEY); }

export function formatCount(n) {
  if (n < 1000) return String(n);
  if (n < 1_000_000) return (n / 1000).toFixed(n < 10_000 ? 1 : 0).replace(/\.0$/, '') + 'k';
  return (n / 1_000_000).toFixed(1) + 'm';
}

export const nowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
