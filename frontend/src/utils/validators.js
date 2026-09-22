// Lightweight input validators.
export const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || '').trim());
export const isStrongPassword = (s) => typeof s === 'string' && s.length >= 8;
export const isNonEmpty = (s) => typeof s === 'string' && s.trim().length > 0;
export const clampLen = (s, n) => String(s || '').slice(0, n);
export const sanitizeMessage = (s, max = 500) => clampLen(String(s || '').replace(/\s+$/g, ''), max);
export const isValidGender = (g) => ['Male', 'Female', 'Other'].includes(g);
