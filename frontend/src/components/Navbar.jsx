import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home as HomeIcon, Info, Sparkles, Shield } from 'lucide-react';
import { useState } from 'react';
import Button from './Button';
import LivePeopleCounter from './LivePeopleCounter';
import { usePresence } from '../hooks/usePresence';

function LogoMark({ className = 'w-8 h-8' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-label="VibeMeet">
      <defs>
        <linearGradient id="vm-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e94476" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="#1a1613" />
      <path d="M14 20 L26 44 L32 44 L44 20" stroke="url(#vm-g)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="48" cy="18" r="5" fill="#16a34a" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();
  const { onlineCount, presenceConnected, presenceError } = usePresence();

  const links = [
    { to: '/', label: 'Home', icon: HomeIcon },
    { to: '/safety', label: 'Safety', icon: Shield },
    { to: '/about', label: 'About', icon: Info },
  ];

  return (
    <header className="safe-t sticky top-0 z-40 backdrop-blur-xl bg-bg/70 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <LogoMark className="w-8 h-8" />
          <span className="font-display text-xl font-semibold tracking-tight">VibeMeet</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = loc.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-2 text-sm rounded-[10px] transition-colors ${active ? 'text-text bg-card' : 'text-muted hover:text-text hover:bg-card/60'}`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <LivePeopleCounter count={onlineCount} connected={presenceConnected} error={presenceError} compact />
          </div>
          <Button size="sm" onClick={() => nav('/video')} leftIcon={<Sparkles className="w-4 h-4" />}>
            Start Chat
          </Button>
          <button className="md:hidden text-text p-2 -mr-2" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-surface">
          <div className="px-4 py-3 flex flex-col gap-1">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="px-3 py-2.5 text-sm rounded-[10px] text-text hover:bg-card flex items-center gap-2">
                <l.icon className="w-4 h-4 text-muted" />{l.label}
              </Link>
            ))}
            <div className="px-3 py-2">
              <LivePeopleCounter count={onlineCount} connected={presenceConnected} error={presenceError} compact />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

