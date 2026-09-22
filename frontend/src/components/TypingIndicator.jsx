import { motion } from 'framer-motion';

export default function TypingIndicator({ label = 'Stranger is typing' }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted px-1 py-1">
      <span>{label}</span>
      <span className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-muted"
            animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </span>
    </div>
  );
}
