// Wraps Session model + presence in one place for controllers/socket handlers.
import { Session } from '../models/Session.js';
import { presenceService } from './presenceService.js';

const STALE_SECONDS = 45;

export const sessionService = {
  async heartbeat({ session_id, status = 'idle', mode = null, filters = {}, gender = null }) {
    await Session.cleanupStale(new Date(Date.now() - STALE_SECONDS * 1000).toISOString());
    await Session.upsert({
      id: session_id, status, mode, filters, gender,
      last_seen: new Date().toISOString(),
    });
  },
  async endAll(session_id) {
    await Session.setStatus(session_id, 'idle');
    presenceService.removeSearching(session_id);
  },
};
