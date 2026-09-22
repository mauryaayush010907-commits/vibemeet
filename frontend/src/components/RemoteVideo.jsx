import { useEffect, useRef } from 'react';
import { VideoOff, User } from 'lucide-react';

export default function RemoteVideo({ stream, remoteHasVideo, connectionLabel }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.srcObject = stream; }, [stream]);
  return (
    <div className="relative w-full h-full bg-black rounded-[18px] overflow-hidden">
      {stream && remoteHasVideo ? (
        <video ref={ref} playsInline autoPlay className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full grid place-items-center bg-gradient-to-br from-card to-card-2">
          <div className="flex flex-col items-center gap-2 text-muted">
            <div className="w-14 h-14 rounded-full bg-card-2 grid place-items-center">
              {stream ? <VideoOff className="w-6 h-6" /> : <User className="w-6 h-6" />}
            </div>
            <div className="text-sm">{stream ? 'Stranger’s camera is off' : 'Waiting for stranger’s video…'}</div>
          </div>
        </div>
      )}
      {connectionLabel && (
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-xs bg-black/50 text-white backdrop-blur-md border border-white/10">{connectionLabel}</span>
        </div>
      )}
    </div>
  );
}
