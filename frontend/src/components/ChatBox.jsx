import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { CHAT_MAX_LEN, CHAT_RATE_LIMIT_MS } from '../utils/constants';

export default function ChatBox({ messages, onSend, onTyping, strangerTyping, disabled, placeholder = 'Type a message…' }) {
  const [text, setText] = useState('');
  const scrollRef = useRef(null);
  const lastSentRef = useRef(0);
  const typingTimer = useRef(null);

  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 240;
    if (nearBottom) el.scrollTop = el.scrollHeight;
  }, [messages.length, strangerTyping]);

  const send = () => {
    const t = text.trim(); if (!t) return;
    const now = Date.now();
    if (now - lastSentRef.current < CHAT_RATE_LIMIT_MS) return;
    lastSentRef.current = now;
    onSend(t.slice(0, CHAT_MAX_LEN));
    setText('');
    onTyping?.(false);
  };

  const handleChange = (v) => {
    setText(v.slice(0, CHAT_MAX_LEN));
    if (!onTyping) return;
    onTyping(true);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => onTyping(false), 1200);
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 sm:px-4 py-4">
        {messages.map((m) => (<MessageBubble key={m.id} from={m.from} text={m.text} time={m.time} />))}
        {strangerTyping && <TypingIndicator />}
      </div>
      <div className="border-t border-border p-2 sm:p-3 bg-surface">
        <div className="flex items-end gap-2">
          <textarea
            value={text}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={disabled ? 'Not connected' : placeholder}
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none min-h-[42px] max-h-32 px-3.5 py-2.5 rounded-[12px] bg-card-2 border border-border text-text text-[15px] outline-none focus:border-primary disabled:opacity-50"
          />
          <button
            onClick={send}
            disabled={disabled || !text.trim()}
            className="h-[42px] w-[42px] shrink-0 grid place-items-center rounded-[12px] bg-primary text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#d63868] transition-colors"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex justify-between items-center mt-1 px-1">
          <div className="text-[10px] text-muted-2">Anonymous · not stored</div>
          <div className={`text-[10px] tabular-nums ${text.length > CHAT_MAX_LEN * 0.9 ? 'text-warning' : 'text-muted-2'}`}>{text.length}/{CHAT_MAX_LEN}</div>
        </div>
      </div>
    </div>
  );
}
