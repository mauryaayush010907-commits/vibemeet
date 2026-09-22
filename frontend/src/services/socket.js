import { io } from "socket.io-client";

const BACKEND_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

let socket = null;

export function channel(name) {
  const channelInstance = {
    name,
    _handlers: [],

    on(event, options, callback) {
      if (typeof options === "function") {
        callback = options;
      }

      const targetEvent = `${name}:${event}`;
      const wrapped = (payload) => callback?.(payload);
      socket?.on(targetEvent, wrapped);
      this._handlers.push({ event: targetEvent, callback: wrapped });
      return this;
    },

    off(event, callback) {
      const targetEvent = `${name}:${event}`;
      if (callback) {
        socket?.off(targetEvent, callback);
      } else {
        socket?.off(targetEvent);
      }
      return this;
    },

    send(data) {
      if (!socket) return false;
      socket.emit(name, data);
      return true;
    },

    subscribe() {
      return Promise.resolve("SUBSCRIBED");
    },

    unsubscribe() {
      this._handlers.forEach(({ event, callback }) => socket?.off(event, callback));
      this._handlers = [];
      return this;
    },
  };

  return channelInstance;
}

export function removeChannel(ch) {
  if (!ch || !socket) return;
  ch._handlers.forEach(({ event, callback }) => socket.off(event, callback));
  ch._handlers = [];
}

// ===============================
// CREATE SOCKET
// ===============================
export function createSocket(sessionId) {
  if (!sessionId) {
    console.error("Socket: sessionId is required");
    return null;
  }

  // Disconnect previous connection
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
    console.log("Socket connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error.message);
  });

  return socket;
}

// ===============================
// GET SOCKET
// ===============================
export function getSocket() {
  return socket;
}

// ===============================
// DISCONNECT SOCKET
// ===============================
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

// ===============================
// JOIN ROOM
// ===============================
export function joinRoom(name, options = {}) {
  if (!socket) {
    console.warn("Socket is not connected");

    return {
      name,
      options,

      on() {
        return this;
      },

      off() {
        return this;
      },

      subscribe() {
        return Promise.reject(
          new Error("Socket is not connected")
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

// ===============================
// LEAVE ROOM
// ===============================
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

// ===============================
// JOIN QUEUE
// ===============================
export function joinQueue({
  mode,
  filters = {},
  gender = null,
} = {}) {
  if (!socket) {
    console.warn("Socket is not connected");
    return false;
  }

  socket.emit("queue:join", {
    mode,
    filters,
    gender,
  });

  return true;
}

// ===============================
// LEAVE QUEUE
// ===============================
export function leaveQueue() {
  if (!socket) {
    return false;
  }

  socket.emit("queue:leave");

  return true;
}

// ===============================
// END SESSION
// ===============================
export function endSession(matchId) {
  if (!socket || !matchId) {
    return false;
  }

  socket.emit("session:end", {
    matchId,
  });

  return true;
}

// ===============================
// BACKEND CLIENT
// ===============================
const backendClient = {
  connect(sessionId) {
    return createSocket(sessionId);
  },

  getSocket() {
    return getSocket();
  },

  channel(name) {
    return channel(name);
  },

  removeChannel(ch) {
    removeChannel(ch);
    return this;
  },

  on(event, callback) {
    if (!socket) {
      console.warn(
        `Socket is not connected. Cannot listen to "${event}".`
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
        `Socket is not connected. Cannot emit "${event}".`
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

export default backendClient;