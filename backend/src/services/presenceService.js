// Presence service — the single source of truth for who is online.
// In-memory maps keyed by anonymous session id.
// The service auto-broadcasts `presence:update` whenever counts change.
import logger from '../utils/logger.js';

class PresenceService {
  constructor() {
    this.io = null;
    // sessionId -> { socketId, status, mode, updatedAt }
    this.connections = new Map();
    // sessionId -> { mode, filters, gender } for those in the search queue
    this.searching = new Map();
    // matchId -> { a, b, mode }
    this.sessions = new Map();
  }

  attach(io) { this.io = io; }

  addConnection({ sessionId, socketId }) {
    this.connections.set(sessionId, { socketId, status: 'idle', mode: null, updatedAt: Date.now() });
    this._broadcast();
  }

  removeConnection(sessionId) {
    this.connections.delete(sessionId);
    this.searching.delete(sessionId);
    // Clean sessions this member was in.
    for (const [matchId, s] of this.sessions) {
      if (s.a === sessionId || s.b === sessionId) this.sessions.delete(matchId);
    }
    this._broadcast();
  }

  setSearching(sessionId, { mode, filters, gender }) {
    const c = this.connections.get(sessionId);
    if (c) c.status = 'searching';
    this.searching.set(sessionId, { mode, filters, gender, since: Date.now() });
    this._broadcast();
  }

  removeSearching(sessionId) {
    this.searching.delete(sessionId);
    const c = this.connections.get(sessionId);
    if (c && c.status === 'searching') c.status = 'idle';
    this._broadcast();
  }

  startSession(matchId, { a, b, mode }) {
    this.sessions.set(matchId, { a, b, mode });
    for (const id of [a, b]) {
      const c = this.connections.get(id);
      if (c) { c.status = 'in_session'; c.mode = mode; }
      this.searching.delete(id);
    }
    this._broadcast();
  }

  endSession(matchId) {
    const s = this.sessions.get(matchId);
    if (!s) return;
    this.sessions.delete(matchId);
    for (const id of [s.a, s.b]) {
      const c = this.connections.get(id);
      if (c) { c.status = 'idle'; c.mode = null; }
    }
    this._broadcast();
  }

  getOnlineCount() {
    return this.connections.size;
  }

  getSearchingCount() {
    return this.searching.size;
  }

  getVideoCount() {
    let count = 0;
    for (const [, s] of this.sessions) if (s.mode === 'video') count += 2;
    return count;
  }

  getTextCount() {
    let count = 0;
    for (const [, s] of this.sessions) if (s.mode === 'text') count += 2;
    return count;
  }

  getPresenceStats() {
    let searchingVideo = 0, searchingText = 0;
    for (const [, s] of this.searching) {
      if (s.mode === 'video') searchingVideo++;
      else if (s.mode === 'text') searchingText++;
    }
    return {
      onlineCount: this.getOnlineCount(),
      searchingCount: this.getSearchingCount(),
      videoChatCount: this.getVideoCount(),
      textChatCount: this.getTextCount(),
      searchingVideo,
      searchingText,
    };
  }

  _broadcast() {
    if (!this.io) return;
    try { this.io.emit('presence:update', this.getPresenceStats()); }
    catch (e) { logger.warn('presence broadcast failed', e?.message); }
  }
}

export const presenceService = new PresenceService();
