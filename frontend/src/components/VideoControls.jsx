import { Mic, MicOff, Video, VideoOff, SkipForward, PhoneOff, Flag, Maximize2, Minimize2 } from 'lucide-react';
import { motion } from 'framer-motion';

function IconBtn({ children, onClick, active = true, danger = false, primary = false, label }) {
  const base = 'w-12 h-12 sm:w-13 sm:h-13 rounded-full grid place-items-center transition-colors';
  const style = danger ? 'bg-danger text-white hover:bg-[#b91c1c]'
    : primary ? 'bg-primary text-white hover:bg-[#d63868]'
    : active ? 'bg-card-2 text-text border border-border hover:border-border-strong'
    : 'bg-danger/20 text-danger border border-danger/40';
  return (
    <motion.button whileTap={{ scale: 0.94 }} onClick={onClick} className={`${base} ${style}`} aria-label={label} title={label}>
      {children}
    </motion.button>
  );
}

export default function VideoControls({ micOn, camOn, isFullscreen, onToggleMic, onToggleCam, onNext, onEnd, onReport, onToggleFullscreen, nextLoading }) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      <IconBtn active={micOn} onClick={onToggleMic} label={micOn ? 'Mute microphone' : 'Unmute microphone'}>
        {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
      </IconBtn>
      <IconBtn active={camOn} onClick={onToggleCam} label={camOn ? 'Turn off camera' : 'Turn on camera'}>
        {camOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
      </IconBtn>
      <IconBtn primary onClick={onNext} label="Next person">
        {nextLoading ? <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : <SkipForward className="w-5 h-5" />}
      </IconBtn>
      <IconBtn danger onClick={onEnd} label="End session">
        <PhoneOff className="w-5 h-5" />
      </IconBtn>
      <IconBtn onClick={onReport} label="Report user">
        <Flag className="w-5 h-5" />
      </IconBtn>
      {onToggleFullscreen && (
        <IconBtn onClick={onToggleFullscreen} label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </IconBtn>
      )}
    </div>
  );
}
