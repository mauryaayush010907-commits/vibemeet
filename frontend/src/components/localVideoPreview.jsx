import { useEffect, useRef, useState } from 'react';
import { VideoOff } from 'lucide-react';

export default function LocalVideoPreview({ stream, cameraOn }) {
  const videoRef = useRef(null);
  const wrapRef = useRef(null);
  const [pos, setPos] = useState({ x: 16, y: 16 });
  const drag = useRef({ dx: 0, dy: 0, active: false });

  useEffect(() => { if (videoRef.current && stream) videoRef.current.srcObject = stream; }, [stream]);

  const onStart = (cx, cy) => {
    const el = wrapRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    drag.current = { dx: cx - r.left, dy: cy - r.top, active: true };
    document.body.classList.add('grabbing');
  };
  const onMove = (cx, cy) => {
    if (!drag.current.active) return;
    const parent = wrapRef.current?.parentElement; if (!parent) return;
    const p = parent.getBoundingClientRect();
    const w = wrapRef.current.offsetWidth, h = wrapRef.current.offsetHeight;
    let x = cx - p.left - drag.current.dx;
    let y = cy - p.top - drag.current.dy;
    x = Math.max(8, Math.min(p.width - w - 8, x));
    y = Math.max(8, Math.min(p.height - h - 8, y));
    setPos({ x, y });
  };
  const onEnd = () => { drag.current.active = false; document.body.classList.remove('grabbing'); };

  return (
    <div
      ref={wrapRef}
      style={{ left: pos.x, top: pos.y }}
      className="absolute w-32 h-44 sm:w-44 sm:h-60 rounded-[14px] overflow-hidden border-2 border-border-strong bg-black shadow-2xl select-none touch-none z-10 cursor-grab"
      onMouseDown={(e) => onStart(e.clientX, e.clientY)}
      onMouseMove={(e) => onMove(e.clientX, e.clientY)}
      onMouseUp={onEnd}
      onMouseLeave={onEnd}
      onTouchStart={(e) => { const t = e.touches[0]; onStart(t.clientX, t.clientY); }}
      onTouchMove={(e) => { const t = e.touches[0]; onMove(t.clientX, t.clientY); }}
      onTouchEnd={onEnd}
      aria-label="Your camera preview"
    >
      {cameraOn ? (
        <video ref={videoRef} playsInline autoPlay muted className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />
      ) : (
        <div className="w-full h-full grid place-items-center bg-card-2 text-muted">
          <div className="flex flex-col items-center gap-1 text-xs">
            <VideoOff className="w-5 h-5" />
            <span>Camera off</span>
          </div>
        </div>
      )}
      <div className="absolute bottom-1.5 left-1.5 text-[10px] text-white/80 bg-black/40 px-1.5 rounded">You</div>
    </div>
  );
}
