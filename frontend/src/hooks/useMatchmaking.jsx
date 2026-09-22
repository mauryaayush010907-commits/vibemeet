// useMatchmaking \u2014 orchestrates: search \u2192 pair \u2192 realtime room \u2192 WebRTC signaling + text.
// Uses a realtime room, WebRTC (peer), and media devices (camera/mic).
import { useCallback, useEffect, useRef, useState } from 'react';
import backendClient from '../services/socket';
import { joinRoom, leaveRoom } from '../services/socket';
import { api } from '../services/api';
import { useChat } from '../context/ChatContext';
import { useWebRTC } from './useWebRTC';
import { useMediaDevices } from './useMediaDevices';
import { MATCHMAKING_POLL_MS } from '../utils/constants';
import { nowTime } from '../utils/helpers';

export function useMatchmaking() {
  const { sessionId, filters } = useChat();
  const media = useMediaDevices();
  const rtc = useWebRTC();

  const [mode, setMode] = useState('video');
  const [phase, setPhase] = useState('idle'); // idle | preflight | searching | connecting | connected
  const [error, setError] = useState(null);
  const [peer, setPeer] = useState(null);
  const [peerDisconnected, setPeerDisconnected] = useState(false);

  const [messages, setMessages] = useState([]);
  const [strangerTyping, setStrangerTyping] = useState(false);

  const channelRef = useRef(null);
  const matchListenRef = useRef(null);
  const searchIntervalRef = useRef(null);
  const strangerTypingTimer = useRef(null);
  const peerRef = useRef(null);
  const modeRef = useRef(mode);
  modeRef.current = mode;

  const addSystem = useCallback((text) => {
    setMessages((m) => [...m, { id: `sys-${Date.now()}-${Math.random()}`, from: 'system', text, time: '' }]);
  }, []);

  const teardownChannel = useCallback(() => {
    if (channelRef.current) { leaveRoom(channelRef.current); channelRef.current = null; }
  }, []);

  const stopSearchPolling = useCallback(() => {
    if (searchIntervalRef.current) { clearInterval(searchIntervalRef.current); searchIntervalRef.current = null; }
  }, []);

  const endSession = useCallback(async ({ keepMedia = false, notifyPeer = true } = {}) => {
    stopSearchPolling();
    const matchId = peerRef.current?.match_id;
    if (notifyPeer && channelRef.current && peerRef.current) {
      try { await channelRef.current.send({ type: 'broadcast', event: 'peer:leave', payload: { from: sessionId } }); } catch { /* ignore */ }
    }
    teardownChannel();
    rtc.teardown();
    setPeer(null); peerRef.current = null;
    setPeerDisconnected(false);
    setMessages([]); setStrangerTyping(false);
    setPhase('idle'); setError(null);
    if (!keepMedia) media.release();
    try { await api('/api/match', { action: 'end', session_id: sessionId, match_id: matchId }); } catch { /* ignore */ }
  }, [sessionId, stopSearchPolling, teardownChannel, rtc, media]);

  const cancelSearch = useCallback(async () => {
    stopSearchPolling();
    setPhase('idle');
    if (matchListenRef.current) { backendClient.removeChannel(matchListenRef.current); matchListenRef.current = null; }
    try { await api('/api/match', { action: 'cancel', session_id: sessionId }); } catch { /* ignore */ }
  }, [sessionId, stopSearchPolling]);

  const startMatch = useCallback(async (info) => {
    peerRef.current = info;
    setPeer(info);
    setPeerDisconnected(false);
    setPhase('connecting');
    setMessages([]); setStrangerTyping(false);

    const ch = joinRoom(`match:${info.match_id}`);
    channelRef.current = ch;

    let pc = null;
    if (modeRef.current === 'video') {
      pc = rtc.start({
        localStream: media.streamRef.current,
        onLocalIce: (candidate) => {
          channelRef.current?.send({ type: 'broadcast', event: 'webrtc:ice', payload: { from: sessionId, candidate } });
        },
      });
    }

    ch.on('broadcast', { event: 'webrtc:offer' }, async ({ payload }) => {
      if (!pc || payload.from === sessionId) return;
      const answer = await rtc.handleOffer(payload.sdp);
      if (answer) channelRef.current?.send({ type: 'broadcast', event: 'webrtc:answer', payload: { from: sessionId, sdp: answer } });
    });
    ch.on('broadcast', { event: 'webrtc:answer' }, async ({ payload }) => {
      if (!pc || payload.from === sessionId) return;
      await rtc.handleAnswer(payload.sdp);
    });
    ch.on('broadcast', { event: 'webrtc:ice' }, async ({ payload }) => {
      if (!pc || payload.from === sessionId) return;
      await rtc.addIce(payload.candidate);
    });
    ch.on('broadcast', { event: 'chat:msg' }, ({ payload }) => {
      if (payload.from === sessionId) return;
      setMessages((m) => [...m, { id: `s-${Date.now()}-${Math.random()}`, from: 'stranger', text: String(payload.text || '').slice(0, 500), time: nowTime() }]);
    });
    ch.on('broadcast', { event: 'typing' }, ({ payload }) => {
      if (payload.from === sessionId) return;
      setStrangerTyping(Boolean(payload.typing));
      if (strangerTypingTimer.current) clearTimeout(strangerTypingTimer.current);
      if (payload.typing) strangerTypingTimer.current = setTimeout(() => setStrangerTyping(false), 3000);
    });
    ch.on('broadcast', { event: 'peer:leave' }, () => {
      setPeerDisconnected(true);
      rtc.setConnState('disconnected');
      addSystem('Stranger disconnected.');
    });
    ch.on('broadcast', { event: 'peer:hello' }, () => {
      if (modeRef.current === 'text') { setPhase('connected'); rtc.setConnState('connected'); }
    });

    await ch.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await ch.send({ type: 'broadcast', event: 'peer:hello', payload: { from: sessionId } });
        if (modeRef.current === 'video' && pc && info.role === 'initiator') {
          const offer = await rtc.createOffer();
          if (offer) await ch.send({ type: 'broadcast', event: 'webrtc:offer', payload: { from: sessionId, sdp: offer } });
        }
        if (modeRef.current === 'text') {
          setPhase('connected'); rtc.setConnState('connected');
          addSystem('Connected with a stranger. Say hi \u{1F44B}');
        } else {
          addSystem('Connected with a stranger.');
        }
        setPhase('connected');
      }
    });
  }, [sessionId, rtc, media, addSystem]);

  const findMatch = useCallback(async (chosenMode) => {
    setError(null);
    setMode(chosenMode);
    modeRef.current = chosenMode;

    if (chosenMode === 'video') {
      setPhase('preflight');
      try { await media.acquire({ video: true, audio: true }); }
      catch (e) {
        setError(e?.message || 'Camera/mic permission denied');
        setPhase('idle');
        return;
      }
    }

    setPhase('searching');

    if (matchListenRef.current) backendClient.removeChannel(matchListenRef.current);
    const listen = backendClient
      .channel(`match-listen-${sessionId}`)
      .on('match:update', {}, (payload) => {
        const row = payload.new;
        if (row.status !== 'active') return;
        if (row.session_a !== sessionId && row.session_b !== sessionId) return;
        if (row.mode !== modeRef.current) return;
        const info = {
          match_id: row.id,
          peer_session_id: row.session_a === sessionId ? row.session_b : row.session_a,
          role: row.session_a === sessionId ? 'initiator' : 'responder',
        };
        stopSearchPolling();
        backendClient.removeChannel(listen);
        matchListenRef.current = null;
        startMatch(info);
      })
      .subscribe();
    matchListenRef.current = listen;

    const poll = async () => {
      try {
        const res = await api('/api/match', {
          action: 'find',
          session_id: sessionId,
          mode: chosenMode,
          gender: filters.gender || null,
          filters: {
            preferred_gender: filters.preferred_gender,
            country: filters.country,
            language: filters.language,
            interests: filters.interests,
          },
        });
        if (res.matched) {
          stopSearchPolling();
          if (matchListenRef.current) { backendClient.removeChannel(matchListenRef.current); matchListenRef.current = null; }
          startMatch({ match_id: res.match_id, peer_session_id: res.peer_session_id, role: res.role });
        }
      } catch (e) { console.warn('match find error', e); }
    };
    poll();
    searchIntervalRef.current = setInterval(poll, MATCHMAKING_POLL_MS);
  }, [sessionId, filters, startMatch, stopSearchPolling, media]);

  const next = useCallback(async () => {
    const m = modeRef.current;
    await endSession({ keepMedia: m === 'video', notifyPeer: true });
    await new Promise((r) => setTimeout(r, 250));
    findMatch(m);
  }, [endSession, findMatch]);

  const sendChat = useCallback((text) => {
    if (!channelRef.current) return;
    setMessages((m) => [...m, { id: `y-${Date.now()}-${Math.random()}`, from: 'you', text, time: nowTime() }]);
    channelRef.current.send({ type: 'broadcast', event: 'chat:msg', payload: { from: sessionId, text } });
  }, [sessionId]);

  const setTyping = useCallback((typing) => {
    channelRef.current?.send({ type: 'broadcast', event: 'typing', payload: { from: sessionId, typing } });
  }, [sessionId]);

  useEffect(() => {
    return () => {
      stopSearchPolling();
      teardownChannel();
      if (matchListenRef.current) backendClient.removeChannel(matchListenRef.current);
      try {
        const payload = JSON.stringify({ action: 'end', session_id: sessionId, match_id: peerRef.current?.match_id });
        navigator.sendBeacon?.('/api/match', new Blob([payload], { type: 'application/json' }));
      } catch { /* ignore */ }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    mode, phase, error,
    connState: rtc.connState, peer, peerDisconnected,
    localStream: media.stream, remoteStream: rtc.remoteStream, remoteHasVideo: rtc.remoteHasVideo,
    micOn: media.micOn, camOn: media.camOn,
    messages, strangerTyping,
    setMode, findMatch, cancelSearch, endSession, next,
    sendChat, setTyping,
    toggleMic: media.toggleMic, toggleCam: media.toggleCam,
  };
}
