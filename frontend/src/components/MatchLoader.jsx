import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import Button from './Button';

export default function MatchLoader({ mode, availableCount, onCancel }) {
  const nobody = availableCount !== null && availableCount <= 1;
  const others = availableCount === null ? null : Math.max(0, availableCount - 1);
  return (
    <div className="min-h-[60vh] grid place-items-center px-6">
      <div className="text-center max-w-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="w-20 h-20 rounded-full bg-primary/10 grid place-items-center mx-auto"
        >
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}>
            <Loader2 className="w-8 h-8 text-primary" />
          </motion.div>
        </motion.div>
        <div className="font-display text-2xl mt-6">Searching for someone…</div>
        <div className="text-muted mt-2 text-sm">
          {others === null ? 'Checking who’s available right now…'
            : nobody ? 'Nobody matching your preferences is available right now. Keep waiting or broaden your filters.'
            : `${others} other ${others === 1 ? 'person is' : 'people are'} looking for a ${mode === 'video' ? 'video' : 'text'} match right now.`}
        </div>
        <div className="mt-8">
          <Button variant="outline" onClick={onCancel} leftIcon={<X className="w-4 h-4" />}>Cancel search</Button>
        </div>
      </div>
    </div>
  );
}
