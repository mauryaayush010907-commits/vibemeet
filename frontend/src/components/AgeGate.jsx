// One-time age confirmation. Users must confirm they are 18+ before entering.
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import Button from './Button';

const KEY = 'vibemeet.age_confirmed_v1';

export default function AgeGate() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const ok = localStorage.getItem(KEY);
      if (!ok) setVisible(true);
    } catch { setVisible(true); }
  }, []);

  const confirm = () => {
    try { localStorage.setItem(KEY, '1'); } catch { /* ignore */ }
    setVisible(false);
  };

  const leave = () => {
    // Send the user away from the platform.
    window.location.href = 'https://www.google.com';
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm grid place-items-center p-4"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="w-full max-w-md bg-surface border border-border rounded-[20px] p-6"
          >
            <div className="w-11 h-11 rounded-full bg-warning/10 grid place-items-center text-warning">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="font-display text-2xl mt-4">Are you 18 or older?</div>
            <p className="text-sm text-muted mt-2">
              VibeMeet is intended for adults. By continuing, you confirm that you are at least
              18 years old and agree to our community guidelines.
            </p>
            <div className="mt-6 flex items-center justify-end gap-2">
              <Button variant="ghost" onClick={leave}>I'm under 18</Button>
              <Button onClick={confirm}>Yes, I'm 18+</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
