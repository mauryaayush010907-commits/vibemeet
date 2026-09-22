// useWebRTC — owns the RTCPeerConnection for a match.
// Signaling is passed in from useMatchmaking (via the room channel).
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPeerConnection } from '../services/webrtc';

export function useWebRTC() {
  const pcRef = useRef(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [remoteHasVideo, setRemoteHasVideo] = useState(false);
  const [connState, setConnState] = useState('disconnected');

  const start = useCallback(({ localStream, onLocalIce }) => {
    const pc = createPeerConnection();
    pcRef.current = pc;
    setConnState('connecting');

    if (localStream) {
      for (const t of localStream.getTracks()) pc.addTrack(t, localStream);
    }

    pc.ontrack = (e) => {
      const stream = e.streams[0] || new MediaStream([e.track]);
      setRemoteStream(stream);
      const hasVideo = stream.getVideoTracks().some((t) => t.readyState === 'live');
      setRemoteHasVideo(hasVideo || stream.getVideoTracks().length > 0);
      stream.getVideoTracks().forEach((t) => {
        t.onmute = () => setRemoteHasVideo(false);
        t.onunmute = () => setRemoteHasVideo(true);
        t.onended = () => setRemoteHasVideo(false);
      });
    };
    pc.onicecandidate = (e) => { if (e.candidate) onLocalIce?.(e.candidate.toJSON()); };
    pc.onconnectionstatechange = () => {
      const s = pc.connectionState;
      if (s === 'connected') setConnState('connected');
      else if (s === 'connecting' || s === 'new') setConnState('connecting');
      else if (s === 'disconnected') setConnState('reconnecting');
      else if (s === 'failed') setConnState('failed');
      else if (s === 'closed') setConnState('disconnected');
    };
    return pc;
  }, []);

  const createOffer = useCallback(async () => {
    const pc = pcRef.current; if (!pc) return null;
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    return offer;
  }, []);

  const handleOffer = useCallback(async (sdp) => {
    const pc = pcRef.current; if (!pc) return null;
    await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    return answer;
  }, []);

  const handleAnswer = useCallback(async (sdp) => {
    const pc = pcRef.current; if (!pc) return;
    try { await pc.setRemoteDescription(new RTCSessionDescription(sdp)); } catch (e) { console.warn(e); }
  }, []);

  const addIce = useCallback(async (candidate) => {
    const pc = pcRef.current; if (!pc) return;
    try { await pc.addIceCandidate(new RTCIceCandidate(candidate)); } catch (e) { console.warn(e); }
  }, []);

  const teardown = useCallback(() => {
    try { pcRef.current?.close(); } catch { /* ignore */ }
    pcRef.current = null;
    setRemoteStream(null);
    setRemoteHasVideo(false);
    setConnState('disconnected');
  }, []);

  useEffect(() => () => teardown(), [teardown]);

  return { pcRef, remoteStream, remoteHasVideo, connState, setConnState, start, createOffer, handleOffer, handleAnswer, addIce, teardown };
}
