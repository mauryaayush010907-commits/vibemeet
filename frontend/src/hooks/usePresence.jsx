// usePresence — real-time presence counts, backed by the MongoDB API.
// Heartbeat keeps our session row fresh; stale rows are cleaned up server-side.
// Each browser tab is represented by its anonymous session id.
import { useEffect, useRef, useState } from 'react';
import { api } from '../services/api';
import backendClient from '../services/socket';
import { useChat } from '../context/ChatContext';
import { PRESENCE_HEARTBEAT_MS } from '../utils/constants';

export function usePresence(state = { status: 'idle', mode: null }) {
  const { sessionId, filters } = useChat();
  const [counts, setCounts] = useState(null);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);

  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    let stopped = false;
    let timer = null;

    async function tick() {
      try {
        const s = stateRef.current;
        const data = await api('/api/presence', undefined, 'GET');
        if (stopped) return;
        setCounts(data);
        setConnected(true);
        setError(null);
      } catch (e) {
        if (stopped) return;
        setError(e?.message || 'Presence unavailable');
        setConnected(false);
      } finally {
        if (!stopped) timer = setTimeout(tick, PRESENCE_HEARTBEAT_MS);
      }
    }
    tick();

    let debounce = null;
    const channel = backendClient
      .channel('presence-listen-' + sessionId)
      .on('presence:update', {}, () => {
        if (debounce) clearTimeout(debounce);
        debounce = setTimeout(async () => {
          try {
            const data = await api('/api/presence', undefined, 'GET');
            if (!stopped) { setCounts(data); setConnected(true); }
          } catch { /* ignore */ }
        }, 400);
      })
      .subscribe();

    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
      if (debounce) clearTimeout(debounce);
      backendClient.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, filters.gender, filters.preferred_gender, filters.country, filters.language, filters.interests.join(',')]);

  useEffect(() => {
    const onLeave = () => {
      try {
        const payload = JSON.stringify({ action: 'cancel', session_id: sessionId });
        navigator.sendBeacon?.('/api/match', new Blob([payload], { type: 'application/json' }));
      } catch { /* ignore */ }
    };
    window.addEventListener('pagehide', onLeave);
    return () => window.removeEventListener('pagehide', onLeave);
  }, [sessionId]);

  return {
    onlineCount: counts?.onlineCount ?? null,
    searchingCount: counts?.searchingCount ?? null,
    videoChatCount: counts?.videoChatCount ?? null,
    textChatCount: counts?.textChatCount ?? null,
    searchingVideo: counts?.searchingVideo ?? null,
    searchingText: counts?.searchingText ?? null,
    presenceConnected: connected,
    presenceError: error,
  };
}
