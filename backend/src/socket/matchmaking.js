// Matchmaking socket handlers. Clients emit queue:join / queue:leave.
// When a compatible pair is found, both are notified with `match:found`
// carrying { matchId, role, peerSessionId }.
import crypto from 'node:crypto';
import { presenceService } from '../services/presenceService.js';
import { matchingService } from '../services/matchingService.js';

export function registerMatchmaking(io, socket, { sessionId }) {
  socket.on('queue:join', async ({ mode, filters = {}, gender = null }) => {
    if (!['video', 'text'].includes(mode)) return;
    presenceService.setSearching(sessionId, { mode, filters, gender });
    io.emit('queue:count', { searchingCount: presenceService.getSearchingCount() });

    const match = await matchingService.findMatch({ sessionId, mode, filters, gender });
    if (!match) return;

    const [a, b] = [sessionId, match.sessionId].sort();
    const matchId = crypto.randomUUID();
    presenceService.startSession(matchId, { a, b, mode });

    // Both clients join a per-match room for signaling & text.
    io.to(match.sessionId).emit('match:found', { matchId, role: a === match.sessionId ? 'initiator' : 'responder', peerSessionId: sessionId === a ? b : a });
    socket.emit('match:found', { matchId, role: a === sessionId ? 'initiator' : 'responder', peerSessionId: sessionId === a ? b : a });
    socket.join(`match:${matchId}`);
    io.sockets.sockets.forEach((s) => {
      if (s.handshake.auth?.sessionId === match.sessionId) s.join(`match:${matchId}`);
    });
    io.emit('session:started', { matchId, mode });
  });

  socket.on('queue:leave', () => {
    presenceService.removeSearching(sessionId);
    io.emit('queue:count', { searchingCount: presenceService.getSearchingCount() });
  });

  socket.on('session:end', ({ matchId }) => {
    if (!matchId) return;
    presenceService.endSession(matchId);
    io.to(`match:${matchId}`).emit('peer:leave', { from: sessionId });
    io.emit('session:ended', { matchId });
  });
}
