import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getSessionId } from '../utils/helpers';

const defaultFilters = {
  gender: '',
  preferred_gender: 'Anyone',
  country: 'Any',
  language: 'Any',
  interests: [],
};

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const sessionId = getSessionId();
  const [filters, setFiltersState] = useState(() => {
    try {
      const saved = localStorage.getItem('vibemeet.filters');
      if (saved) return { ...defaultFilters, ...JSON.parse(saved) };
    } catch { /* ignore */ }
    return defaultFilters;
  });

  const setFilters = (f) => {
    setFiltersState(f);
    try { localStorage.setItem('vibemeet.filters', JSON.stringify(f)); } catch { /* ignore */ }
  };

  const value = useMemo(() => ({ sessionId, filters, setFilters }), [sessionId, filters]);
  useEffect(() => { /* placeholder */ }, []);
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}