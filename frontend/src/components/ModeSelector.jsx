import { motion } from 'framer-motion';
import { Video, MessageSquare } from 'lucide-react';

function Card({ active, onClick, icon, title, description, avail, connected }) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`text-left p-5 rounded-[18px] border transition-colors ${active ? 'bg-card-2 border-primary shadow-[0_0_0_1px_var(--color-primary)]' : 'bg-card border-border hover:border-border-strong'}`}
    >
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-[12px] grid place-items-center ${active ? 'bg-primary/15 text-primary' : 'bg-card-2 text-text'}`}>{icon}</div>
        <div className="text-xs text-muted flex items-center gap-1.5">
          <span className={`live-dot ${connected ? '' : 'warn'}`} />
          {avail === null ? 'Loading…' : avail === 0 ? 'No one waiting yet' : `${avail} waiting now`}
        </div>
      </div>
      <div className="mt-4 font-display text-xl">{title}</div>
      <div className="text-sm text-muted mt-1">{description}</div>
    </motion.button>
  );
}

export default function ModeSelector({ value, onChange, videoAvailable, textAvailable, presenceConnected }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <Card active={value === 'video'} onClick={() => onChange('video')} icon={<Video className="w-6 h-6" />} title="Video chat" description="Face-to-face over WebRTC. Camera + mic required." avail={videoAvailable} connected={presenceConnected} />
      <Card active={value === 'text'} onClick={() => onChange('text')} icon={<MessageSquare className="w-6 h-6" />} title="Anonymous text chat" description="No camera. Ephemeral messages, no history saved." avail={textAvailable} connected={presenceConnected} />
    </div>
  );
}
