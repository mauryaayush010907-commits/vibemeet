import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { INTERESTS } from '../utils/constants';

export default function InterestSelector({ value, onChange }) {
  const [custom, setCustom] = useState('');

  const toggle = (t) => {
    if (value.includes(t)) onChange(value.filter((x) => x !== t));
    else onChange([...value, t]);
  };

  const addCustom = () => {
    const t = custom.trim();
    if (!t || t.length > 24) return;
    if (!value.includes(t)) onChange([...value, t]);
    setCustom('');
  };

  const suggestions = INTERESTS.filter((i) => !value.includes(i));

  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-muted-2 mb-2">Interests</div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {value.map((t) => (
            <span key={t} className="h-8 pl-3 pr-1.5 inline-flex items-center gap-1.5 rounded-full bg-primary/15 text-primary text-sm border border-primary/30">
              {t}
              <button onClick={() => toggle(t)} className="w-5 h-5 rounded-full hover:bg-primary/25 grid place-items-center" aria-label={`Remove ${t}`}>
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {suggestions.map((t) => (
          <button key={t} onClick={() => toggle(t)} className="h-8 px-3 text-sm rounded-full bg-card-2 border border-border text-text hover:border-border-strong">{t}</button>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustom(); } }}
          placeholder="Add your own…"
          maxLength={24}
          className="flex-1 h-10 px-3 rounded-[10px] bg-card-2 border border-border text-sm text-text outline-none focus:border-primary"
        />
        <button onClick={addCustom} className="h-10 px-3 rounded-[10px] bg-card-2 border border-border text-sm text-text hover:border-border-strong inline-flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>
    </div>
  );
}