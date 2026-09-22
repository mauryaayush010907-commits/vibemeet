import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff } from 'lucide-react';
import { formatCount } from '../utils/helpers';

export default function LivePeopleCounter({ count, connected, error, label = 'people online now', compact = false }) {
  if (error && !connected && count === null) {
    return (
      <div className={`inline-flex items-center gap-2 ${compact ? 'text-xs' : 'text-sm'} text-muted`} aria-live="polite">
        <WifiOff className="w-3.5 h-3.5" />
        <span>Online status unavailable</span>
      </div>
    );
  }
  if (count === null) {
    return (
      <div className={`inline-flex items-center gap-2 ${compact ? 'text-xs' : 'text-sm'} text-muted`} aria-live="polite">
        <span className="inline-block w-2 h-2 bg-muted-2 rounded-full animate-pulse" />
        <span>Loading online count…</span>
      </div>
    );
  }
  return (
    <div
      className={`inline-flex items-center gap-2 ${compact ? 'text-xs' : 'text-sm'} text-text`}
      aria-live="polite"
      aria-label={`${count} ${label}`}
    >
      <span className={`live-dot ${connected ? '' : 'warn'}`} aria-hidden="true" />
      <span className="font-mono tabular-nums text-text">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={count}
            initial={{ y: -6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 6, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="inline-block"
          >
            {formatCount(count)}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="text-muted">{label}</span>
    </div>
  );
}
