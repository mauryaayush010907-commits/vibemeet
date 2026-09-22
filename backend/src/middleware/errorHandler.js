import logger from '../utils/logger.js';

export default function errorHandler(err, _req, res, _next) {
  logger.error('unhandled error', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal error' });
}

