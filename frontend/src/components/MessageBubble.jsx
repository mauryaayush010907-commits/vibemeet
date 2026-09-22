import { motion } from 'framer-motion';

export default function MessageBubble({ from, text, time }) {
  if (from === 'system') {
    return (
      <div className="my-2 text-center">
        <span className="text-xs text-muted-2 italic">{text}</span>
      </div>
    );
  }
  const me = from === 'you';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`flex ${me ? 'justify-end' : 'justify-start'} mb-2`}
    >
      <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-[15px] leading-snug break-words ${me ? 'bg-primary text-white rounded-br-sm' : 'bg-card-2 text-text border border-border rounded-bl-sm'}`}>
        <div>{text}</div>
        {time && <div className={`text-[10px] mt-1 ${me ? 'text-white/70' : 'text-muted-2'}`}>{time}</div>}
      </div>
    </motion.div>
  );
}
