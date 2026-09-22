// WebRTC signaling relay. Purely broadcast within the match room.
export function registerSignaling(io, socket, { sessionId }) {
  socket.on('webrtc:offer', ({ matchId, sdp }) => {
    if (!matchId) return;
    socket.to(`match:${matchId}`).emit('webrtc:offer', { from: sessionId, sdp });
  });
  socket.on('webrtc:answer', ({ matchId, sdp }) => {
    if (!matchId) return;
    socket.to(`match:${matchId}`).emit('webrtc:answer', { from: sessionId, sdp });
  });
  socket.on('webrtc:ice', ({ matchId, candidate }) => {
    if (!matchId) return;
    socket.to(`match:${matchId}`).emit('webrtc:ice', { from: sessionId, candidate });
  });
}
