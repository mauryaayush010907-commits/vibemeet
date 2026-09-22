// WebRTC helpers. Public STUN only; no TURN needed for most consumer NATs.
export const RTC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun.cloudflare.com:3478' },
  ],
};

export function createPeerConnection() {
  return new RTCPeerConnection(RTC_CONFIG);
}

export async function getLocalMedia({ video = true, audio = true } = {}) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Camera/microphone not supported by this browser.');
  }
  return navigator.mediaDevices.getUserMedia({ video, audio });
}
