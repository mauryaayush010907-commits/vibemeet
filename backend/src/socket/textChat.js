// Ephemeral text chat over Socket.IO. Messages are never persisted.
import { sanitizeText } from '../utils/security.js';

const MAX_LEN = 500;
const rate = new Map(); // sessionId -> lastTs
const RATE_MS = 400;

export function registerTextChat(_io, socket, { sessionId }) {
  socket.on('chat:msg', ({ matchId, text }) => {
    if (!matchId) return;
    const now = Date.now();
    const last = rate.get(sessionId) || 0;
    if (now - last < RATE_MS) return;
    rate.set(sessionId, now);
    const clean = sanitizeText(text, MAX_LEN);
    if (!clean) return;
    socket.to(`match:${matchId}`).emit('chat:msg', { from: sessionId, text: clean });
  });

  socket.on('typing', ({ matchId, typing }) => {
    if (!matchId) return;
    socket.to(`match:${matchId}`).emit('typing', { from: sessionId, typing: !!typing });
  });
}
