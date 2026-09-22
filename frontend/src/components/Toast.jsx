import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

const ToastCtx = createContext(null);
let id = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((t) => {
    const newT = { id: ++id, kind: t.kind, title: t.title, description: t.description, ttl: t.ttl ?? 4200 };
    setToasts((cur) => [...cur, newT]);
  }, []);

  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map((t) => setTimeout(() => setToasts((cur) => cur.filter((x) => x.id !== t.id)), t.ttl));
    return () => timers.forEach(clearTimeout);
  }, [toasts]);

  const iconFor = (k) => k === 'success' ? <CheckCircle2 className="w-5 h-5 text-success" /> :
    k === 'error' ? <XCircle className="w-5 h-5 text-danger" /> :
    k === 'warning' ? <AlertTriangle className="w-5 h-5 text-warning" /> :
    <Info className="w-5 h-5 text-accent" />;

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="fixed z-[100] top-4 right-4 left-4 sm:left-auto sm:top-4 flex flex-col items-stretch sm:items-end gap-2 pointer-events-none">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              className="pointer-events-auto bg-surface border border-border-strong rounded-[14px] shadow-2xl px-4 py-3 max-w-sm w-full sm:w-auto sm:min-w-[280px] flex items-start gap-3"
              role="status"
            >
              {iconFor(t.kind)}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-text truncate">{t.title}</div>
                {t.description && <div className="text-xs text-muted mt-0.5">{t.description}</div>}
              </div>
              <button className="text-muted hover:text-text" onClick={() => setToasts((cur) => cur.filter((x) => x.id !== t.id))} aria-label="Dismiss">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
