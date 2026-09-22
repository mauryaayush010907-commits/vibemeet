// useSocket — join/leave a real-time room.
// Same primitives as a Socket.IO room, exposed to React components.
import { useEffect, useRef } from 'react';
import { joinRoom, leaveRoom } from '../services/socket';

export function useSocket(roomName, handlers, deps = []) {
  const chRef = useRef(null);
  useEffect(() => {
    if (!roomName) return undefined;
    const ch = joinRoom(roomName);
    chRef.current = ch;
    for (const [event, fn] of Object.entries(handlers || {})) {
      ch.on('broadcast', { event }, ({ payload }) => fn(payload));
    }
    ch.subscribe();
    return () => { leaveRoom(ch); chRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomName, ...deps]);

  const send = (event, payload) => {
    if (!chRef.current) return;
    chRef.current.send({ type: 'broadcast', event, payload });
  };
  return { send, channel: () => chRef.current };
}
