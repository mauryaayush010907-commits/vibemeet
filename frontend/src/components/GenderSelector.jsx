export default function GenderSelector({ value, onChange, options, label }) {
  return (
    <div>
      {label && <div className="text-xs uppercase tracking-widest text-muted-2 mb-2">{label}</div>}
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value === o;
          return (
            <button
              key={o}
              onClick={() => onChange(o)}
              className={`h-10 px-4 text-sm rounded-full border transition-colors ${active ? 'bg-primary text-white border-primary' : 'bg-card-2 text-text border-border hover:border-border-strong'}`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}
