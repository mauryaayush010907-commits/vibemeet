function createBackendClient() {
  const channel = {
    on() { return channel; },
    subscribe() { return Promise.resolve('CLOSED'); },
    send() { return Promise.resolve('CLOSED'); },
  };

  return {
    channel: () => channel,
    removeChannel: () => Promise.resolve(),
  };
}

const backendClient = createBackendClient();

export default backendClient;
export const socket = backendClient;

// Create a per-match anonymous room.
export function joinRoom(name, opts = {}) {
  return backendClient.channel(name, { config: { broadcast: { self: false, ack: true } }, ...opts });
}

export function leaveRoom(channel) {
  if (channel) backendClient.removeChannel(channel);
}
