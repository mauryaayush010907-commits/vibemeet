import { AnimatePresence, motion } from 'framer-motion';
import { X, Ban } from 'lucide-react';
import Button from './Button';
import { useState } from 'react';

export default function BlockModal({ open, onClose, onConfirm }) {
  const [busy, setBusy] = useState(false);
  const confirm = async () => { setBusy(true); try { await onConfirm(); onClose(); } finally { setBusy(false); } };
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm grid place-items-end sm:place-items-center p-0 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface border border-border w-full sm:max-w-sm rounded-t-[22px] sm:rounded-[22px] p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="font-display text-xl">Block user?</div>
              <button onClick={onClose} className="text-muted hover:text-text p-1" aria-label="Close"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex items-start gap-3 text-sm text-muted mb-4">
              <Ban className="w-4 h-4 text-danger shrink-0 mt-0.5" />
              <p>Blocking will immediately end this session and prevent us from matching you with this person again on this device.</p>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button variant="danger" onClick={confirm} loading={busy}>Block & end session</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
