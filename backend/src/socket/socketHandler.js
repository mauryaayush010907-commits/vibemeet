// Wires all Socket.IO namespaces + hooks the presence service to `io`.
import { presenceService } from '../services/presenceService.js';
import { registerMatchmaking } from './matchmaking.js';
import { registerSignaling } from './signaling.js';
import { registerTextChat } from './textChat.js';
import { registerPresence } from './presence.js';
import logger from '../utils/logger.js';

export function registerSocket(io) {
  presenceService.attach(io);

  io.on('connection', (socket) => {
    const { sessionId } = socket.handshake.auth || {};
    if (!sessionId) { socket.disconnect(true); return; }

    logger.debug('socket connected', sessionId);
    presenceService.addConnection({ sessionId, socketId: socket.id });

    registerPresence(io, socket, { sessionId });
    registerMatchmaking(io, socket, { sessionId });
    registerSignaling(io, socket, { sessionId });
    registerTextChat(io, socket, { sessionId });

    socket.on('disconnect', () => {
      logger.debug('socket disconnected', sessionId);
      presenceService.removeConnection(sessionId);
    });
  });
}
