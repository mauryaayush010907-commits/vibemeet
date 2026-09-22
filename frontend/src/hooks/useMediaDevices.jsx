import { useCallback, useEffect, useRef, useState } from 'react';
import { getLocalMedia } from '../services/webrtc';

export function useMediaDevices() {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const streamRef = useRef(null);

  const acquire = useCallback(async ({ video = true, audio = true } = {}) => {
    try {
      const existing = streamRef.current;
      if (existing && existing.getTracks().some((t) => t.readyState === 'live')) return existing;
      const s = await getLocalMedia({ video, audio });
      streamRef.current = s;
      setStream(s);
      setMicOn(true);
      setCamOn(true);
      setError(null);
      return s;
    } catch (e) {
      setError(e?.message || 'Camera/mic permission denied');
      throw e;
    }
  }, []);

  const release = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStream(null);
  }, []);

  const toggleMic = useCallback(() => {
    const s = streamRef.current; if (!s) return;
    const next = !micOn;
    s.getAudioTracks().forEach((t) => (t.enabled = next));
    setMicOn(next);
  }, [micOn]);

  const toggleCam = useCallback(() => {
    const s = streamRef.current; if (!s) return;
    const next = !camOn;
    s.getVideoTracks().forEach((t) => (t.enabled = next));
    setCamOn(next);
  }, [camOn]);

  useEffect(() => () => release(), [release]);

  return { stream, streamRef, acquire, release, micOn, camOn, toggleMic, toggleCam, error };
}
