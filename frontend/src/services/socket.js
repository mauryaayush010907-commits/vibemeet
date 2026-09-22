import { io } from "socket.io-client";

const BACKEND_URL =
  import.meta.env.VITE_API_URL ||
  "https://vibemeet-8xxp.onrender.com";

let socket = null;

/**
 * Create a new Socket.IO connection
 */
export function createSocket(sessionId) {
  if (!sessionId) {
    console.error("Socket.IO: sessionId is required");
    return null;
  }

  // Disconnect old socket before creating a new one
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io(BACKEND_URL, {
    auth: {
      sessionId,
    },

    transports: ["websocket", "polling"],

    withCredentials: true,

    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    console.log("Socket.IO connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket.IO disconnected:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("Socket.IO connection error:", error.message);
  });

  return socket;
}

/**
 * Get current socket
 */
export function getSocket() {
  return socket;
}

/**
 * Disconnect socket
 */
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/**
 * Backend client wrapper
 *
 * Existing components can use:
 * backendClient.connect(...)
 * backendClient.getSocket()
 * backendClient.on(...)
 * backendClient.off(...)
 * backendClient.emit(...)
 * backendClient.disconnect()
 */
const backendClient = {
  connect(sessionId) {
    return createSocket(sessionId);
  },

  getSocket() {
    return getSocket();
  },

  on(event, callback) {
    if (!socket) {
      console.warn(
        `Socket.IO: Cannot listen for "${event}" because socket is not connected.`
      );
      return this;
    }

    socket.on(event, callback);
    return this;
  },

  off(event, callback) {
    if (!socket) {
      return this;
    }

    if (callback) {
      socket.off(event, callback);
    } else {
      socket.off(event);
    }

    return this;
  },

  emit(event, data) {
    if (!socket) {
      console.warn(
        `Socket.IO: Cannot emit "${event}" because socket is not connected.`
      );
      return this;
    }

    socket.emit(event, data);
    return this;
  },

  disconnect() {
    disconnectSocket();
  },
};

/**
 * Join a room
 *
 * This keeps compatibility with existing code that does:
 *
 * const channel = joinRoom("room-name");
 * channel.on(...)
 * channel.subscribe()
 */
export function joinRoom(name, options = {}) {
  if (!socket) {
    console.warn("Socket.IO: Cannot join room because socket is not connected.");

    return {
      name,
      options,

      on() {
        return this;
      },

      subscribe() {
        return Promise.reject(
          new Error("Socket.IO is not connected")
        );
      },

      unsubscribe() {
        return this;
      },
    };
  }

  socket.emit("room:join", {
    room: name,
    ...options,
  });

  return {
    name,
    options,

    on(event, callback) {
      socket?.on(event, callback);
      return this;
    },

    off(event, callback) {
      if (callback) {
        socket?.off(event, callback);
      } else {
        socket?.off(event);
      }

      return this;
    },

    subscribe() {
      return Promise.resolve("SUBSCRIBED");
    },

    unsubscribe() {
      socket?.emit("room:leave", {
        room: name,
      });

      return this;
    },
  };
}

/**
 * Leave a room
 */
export function leaveRoom(channel) {
  if (!socket) {
    return;
  }

  const room =
    typeof channel === "string"
      ? channel
      : channel?.name;

  if (!room) {
    return;
  }

  socket.emit("room:leave", {
    room,
  });
}

/**
 * Join matchmaking queue
 */
export function joinQueue({
  mode,
  filters = {},
  gender = null,
} = {}) {
  if (!socket) {
    console.warn(
      "Socket.IO: Cannot join queue because socket is not connected."
    );
    return false;
  }

  socket.emit("queue:join", {
    mode,
    filters,
    gender,
  });

  return true;
}

/**
 * Leave matchmaking queue
 */
export function leaveQueue() {
  if (!socket) {
    return false;
  }

  socket.emit("queue:leave");

  return true;
}

/**
 * End a matching session
 */
export function endSession(matchId) {
  if (!socket || !matchId) {
    return false;
  }

  socket.emit("session:end", {
    matchId,
  });

  return true;
}

export default backendClient;