// Small security helpers.
export function sanitizeText(s, max = 500) {
  return String(s ?? '').replace(/[\u0000-\u001F\u007F]/g, '').slice(0, max);
}

export function safeJson(x) {
  try { return JSON.parse(x); } catch { return null; }
}

export function stripPrivate(obj) {
  // Never expose IPs, socket IDs, or internal identifiers to the peer.
  if (!obj || typeof obj !== 'object') return obj;
  const { ip, socketId, ...rest } = obj;
  return rest;
}
