
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Search, Check, Globe2 } from 'lucide-react';
import { COUNTRIES } from '../utils/constants';

export default function CountrySelector({ value, onChange, label = 'Country', placeholder = 'Any country' }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return qq ? COUNTRIES.filter((o) => o.toLowerCase().includes(qq)) : COUNTRIES;
  }, [q]);

  return (
    <div ref={ref} className="relative">
      {label && <div className="text-xs uppercase tracking-widest text-muted-2 mb-2">{label}</div>}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full h-11 px-4 pr-3 rounded-[12px] bg-card-2 border border-border hover:border-border-strong text-left text-sm flex items-center justify-between transition-colors"
      >
        <span className="inline-flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-muted" />
          <span className={value ? 'text-text' : 'text-muted'}>{value || placeholder}</span>
        </span>
        <ChevronDown className={`w-4 h-4 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-30 mt-2 w-full bg-surface border border-border rounded-[14px] shadow-2xl overflow-hidden">
          <div className="p-2 border-b border-border">
            <div className="flex items-center gap-2 px-2 h-9 bg-card-2 rounded-[10px]">
              <Search className="w-4 h-4 text-muted" />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search country…" className="flex-1 bg-transparent outline-none text-sm text-text" />
            </div>
          </div>
          <div className="max-h-56 overflow-y-auto">
            {filtered.length === 0 && <div className="p-3 text-sm text-muted text-center">No matches</div>}
            {filtered.map((o) => (
              <button key={o} onClick={() => { onChange(o); setOpen(false); setQ(''); }} className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-card-2 ${value === o ? 'text-primary' : 'text-text'}`}>
                <span>{o}</span>
                {value === o && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
