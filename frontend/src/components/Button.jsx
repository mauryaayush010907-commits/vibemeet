// Shared button primitive used across the app.
import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-primary text-white hover:bg-[#d63868] shadow-[0_8px_30px_-8px_rgba(233,68,118,0.5)]',
  secondary: 'bg-secondary text-black hover:bg-[#e08a05]',
  ghost: 'bg-transparent text-text hover:bg-card-2',
  danger: 'bg-danger text-white hover:bg-[#b91c1c]',
  outline: 'bg-transparent text-text border border-border-strong hover:border-primary hover:text-primary',
};

const sizes = {
  sm: 'h-9 px-3 text-sm rounded-[10px]',
  md: 'h-11 px-5 text-[15px] rounded-[12px]',
  lg: 'h-14 px-7 text-base rounded-[14px]',
};

export default function Button({
  variant = 'primary', size = 'md', loading, leftIcon, rightIcon, fullWidth, children, className = '', disabled, ...rest
}) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {loading ? <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : leftIcon}
      <span>{children}</span>
      {rightIcon}
    </motion.button>
  );
}
