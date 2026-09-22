// Tiny leveled logger. Swap for pino/winston in production.
const fmt = (level, args) => [`[${new Date().toISOString()}] [${level}]`, ...args];
const logger = {
  info: (...a) => console.log(...fmt('info', a)),
  warn: (...a) => console.warn(...fmt('warn', a)),
  error: (...a) => console.error(...fmt('error', a)),
  debug: (...a) => (process.env.DEBUG ? console.debug(...fmt('debug', a)) : undefined),
};
export default logger;
