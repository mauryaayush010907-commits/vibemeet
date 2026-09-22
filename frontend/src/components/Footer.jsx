import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-xs text-muted-2">
          © {new Date().getFullYear()} VibeMeet — Real people, real conversations.
        </div>
        <div className="flex items-center gap-4 text-xs text-muted">
          <Link className="hover:text-text" to="/safety">Safety</Link>
          <Link className="hover:text-text" to="/guidelines">Guidelines</Link>
          <Link className="hover:text-text" to="/about">About</Link>
          <Link className="hover:text-text" to="/terms">Terms</Link>
          <Link className="hover:text-text" to="/privacy">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}