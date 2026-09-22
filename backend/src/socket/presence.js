// Presence events. Emits the current stats to the client on request and on connect.
import { presenceService } from '../services/presenceService.js';

export function registerPresence(_io, socket, _ctx) {
  socket.emit('presence:update', presenceService.getPresenceStats());
  socket.on('presence:get', () => socket.emit('presence:update', presenceService.getPresenceStats()));
  socket.emit('presence:online', { onlineCount: presenceService.getOnlineCount() });
}
