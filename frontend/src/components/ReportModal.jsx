import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Button from './Button';

const REASONS = [
  'Nudity or sexual content',
  'Harassment or hate speech',
  'Minor (under 18)',
  'Violence or threats',
  'Spam or scam',
  'Other',
];

export default function ReportModal({ open, onClose, onSubmit }) {
  const [reason, setReason] = useState(REASONS[0]);
  const [desc, setDesc] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try { await onSubmit(reason, desc); onClose(); setDesc(''); setReason(REASONS[0]); }
    finally { setBusy(false); }
  };

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
            className="bg-surface border border-border w-full sm:max-w-md rounded-t-[22px] sm:rounded-[22px] p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="font-display text-xl">Report user</div>
              <button onClick={onClose} className="text-muted hover:text-text p-1" aria-label="Close"><X className="w-5 h-5" /></button>
            </div>
            <div className="text-sm text-muted mb-4">Reports are reviewed by our safety team. False reports may result in restrictions.</div>
            <div className="space-y-2 mb-4">
              {REASONS.map((r) => (
                <label key={r} className={`flex items-center gap-3 p-2.5 rounded-[10px] border cursor-pointer transition-colors ${reason === r ? 'border-primary bg-primary/5' : 'border-border hover:border-border-strong'}`}>
                  <input type="radio" name="reason" checked={reason === r} onChange={() => setReason(r)} className="accent-primary" />
                  <span className="text-sm">{r}</span>
                </label>
              ))}
            </div>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value.slice(0, 500))}
              placeholder="Add details (optional)"
              rows={3}
              className="w-full px-3 py-2 rounded-[10px] bg-card-2 border border-border text-sm outline-none focus:border-primary resize-none"
            />
            <div className="text-right text-[10px] text-muted-2 mt-1">{desc.length}/500</div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button variant="danger" onClick={submit} loading={busy}>Submit report</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
