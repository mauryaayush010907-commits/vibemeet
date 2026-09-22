// Handles reports and blocks. Persists via the MongoDB models.
import { Report } from '../models/Report.js';
import { Block } from '../models/Block.js';
import { sanitizeText } from '../utils/security.js';

export const moderationService = {
  async report({ reporter_session, reported_session, match_id = null, reason, description = '' }) {
    if (!reporter_session || !reported_session || !reason) throw new Error('Missing report fields');
    await Report.create({
      reporter_session, reported_session, match_id,
      reason: sanitizeText(reason, 100),
      description: sanitizeText(description, 500),
    });
  },
  async block({ blocker_session, blocked_session, match_id = null }) {
    if (!blocker_session || !blocked_session) throw new Error('Missing block fields');
    await Block.create({ blocker_session, blocked_session, match_id });
  },
};
