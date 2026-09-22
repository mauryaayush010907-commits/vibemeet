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

// Keep this export because your existing components use it.
const backendClient = {
  connect(sessionId) {
    return createSocket(sessionId);
  },

  getSocket() {
    return socket;
  },

  on(event, callback) {
    socket?.on(event, callback);
    return this;
  },

  off(event, callback) {
    socket?.off(event, callback);
    return this;
  },

  emit(event, data) {
    socket?.emit(event, data);
    return this;
  },

  disconnect() {
    socket?.disconnect();
    socket = null;
  },
};

// Keep these because your existing code imports them.
export function joinRoom(name, opts = {}) {
  return {
    name,
    opts,

    on(event, callback) {
      socket?.on(event, callback);
      return this;
    },

    subscribe() {
      return Promise.resolve('SUBSCRIBED');
    },
  };
}

export function leaveRoom(channel) {
  if (channel) {
    // Socket.IO handles the actual connection.
    // Match/session cleanup is handled by the backend.
  }
}

export function joinQueue({ mode, filters = {}, gender = null }) {
  if (!socket) {
    throw new Error('Socket is not connected');
  }

  socket.emit('queue:join', {
    mode,
    filters,
    gender,
  });
}

export function leaveQueue() {
  socket?.emit('queue:leave');
}

export function endSession(matchId) {
  if (!socket || !matchId) return;

  socket.emit('session:end', {
    matchId,
  });
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

export default backendClient;
