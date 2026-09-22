import { io } from 'socket.io-client';

const BACKEND_URL =
  import.meta.env.VITE_API_URL ||
  'https://vibemeet-8xxp.onrender.com';

let socket = null;

export function createSocket(sessionId) {
  if (!sessionId) {
    throw new Error('sessionId is required');
  }

  if (socket) {
    socket.disconnect();
  }

  socket = io(BACKEND_URL, {
    auth: {
      sessionId,
    },
    transports: ['websocket', 'polling'],
    withCredentials: true,
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function joinQueue({ mode, filters = {}, gender = null }) {
  if (!socket) throw new Error('Socket is not connected');

  socket.emit('queue:join', {
    mode,
    filters,
    gender,
  });
}

export function leaveQueue() {
  if (!socket) return;
  socket.emit('queue:leave');
}

export function endSession(matchId) {
  if (!socket || !matchId) return;
  socket.emit('session:end', { matchId });
}

export default {
  createSocket,
  getSocket,
  disconnectSocket,
  joinQueue,
  leaveQueue,
  endSession,
};
