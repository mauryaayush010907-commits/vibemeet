import { io } from 'socket.io-client';

const BACKEND_URL =
  import.meta.env.VITE_API_URL ||
  'https://vibemeet-8xxp.onrender.com';

let socket = null;

function createSocket(sessionId) {
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

const backendClient = {
  connect(sessionId) {
    return createSocket(sessionId);
  },

  getSocket() {
    return socket;
  },

  disconnect() {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
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
  },

  channel(name) {
    return {
      on(event, callback) {
        socket?.on(event, callback);
        return this;
      },

      subscribe() {
        return Promise.resolve('SUBSCRIBED');
      },

      send(data) {
        socket?.emit(name, data);
        return Promise.resolve('SENT');
      },
    };
  },

  removeChannel() {
    return Promise.resolve();
  },
};

export default backendClient;
export { backendClient };

export function joinRoom(name, opts = {}) {
  if (!socket) {
    console.warn('Socket is not connected');
    return null;
  }

  // Your backend uses match:<matchId> rooms internally.
  // Actual room joining is handled by the matchmaking server.
  return {
    name,
    opts,
    on(event, callback) {
      socket.on(event, callback);
      return this;
    },
    subscribe() {
      return Promise.resolve('SUBSCRIBED');
    },
  };
}

export function leaveRoom(channel) {
  if (!channel) return;

  // The backend handles leaving when the socket disconnects
  // or when session:end is emitted.
}

export function createBackendSocket(sessionId) {
  return createSocket(sessionId);
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
