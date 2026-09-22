// VibeMeet backend entrypoint. Express + Socket.IO.
import 'dotenv/config';
import express from 'express';
import http from 'node:http';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';

import reportRoutes from './routes/reportRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import { registerSocket } from './socket/socketHandler.js';
import logger from './utils/logger.js';
import matchHandler from '../../api/match.js';
import presenceHandler from '../../api/presence.js';
import reportHandler from '../../api/report.js';
import blockHandler from '../../api/block.js';

const normalizeOrigin = (value) => {
  if (!value) return '';
  try {
    return new URL(value).origin;
  } catch {
    return value.replace(/\/?$/, '');
  }
};

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => normalizeOrigin(origin.trim()))
  .filter(Boolean);

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const normalized = normalizeOrigin(origin);
      return allowedOrigins.includes(normalized)
        ? callback(null, true)
        : callback(new Error('CORS origin not allowed'));
    },
    credentials: true,
  },
});

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const normalized = normalizeOrigin(origin);
    return allowedOrigins.includes(normalized)
      ? callback(null, true)
      : callback(new Error('CORS origin not allowed'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '256kb' }));

app.get('/api/healthz', (_req, res) => res.json({ ok: true, ts: Date.now() }));
app.all('/api/match', matchHandler);
app.all('/api/presence', presenceHandler);
app.all('/api/report', reportHandler);
app.all('/api/block', blockHandler);

app.use('/api/reports', reportRoutes);

app.use(errorHandler);

registerSocket(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => logger.info(`VibeMeet backend listening on :${PORT}`));
