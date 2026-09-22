// Matching engine — pairs the oldest compatible waiter in the same mode.
import { presenceService } from './presenceService.js';
import { Block } from '../models/Block.js';

function compat(a, b) {
  if (a.sessionId === b.sessionId) return false;
  if (a.mode !== b.mode) return false;
  const af = a.filters || {}, bf = b.filters || {};
  const wantsA = af.preferred_gender && af.preferred_gender !== 'Anyone';
  const wantsB = bf.preferred_gender && bf.preferred_gender !== 'Anyone';
  if (wantsA && b.gender && b.gender !== af.preferred_gender) return false;
  if (wantsB && a.gender && a.gender !== bf.preferred_gender) return false;
  if (af.country && af.country !== 'Any' && bf.country && bf.country !== 'Any' && af.country !== bf.country) return false;
  if (af.language && af.language !== 'Any' && bf.language && bf.language !== 'Any' && af.language !== bf.language) return false;
  return true;
}

export const matchingService = {
  async findMatch(seeker) {
    const candidates = [];
    for (const [sessionId, s] of presenceService.searching) {
      candidates.push({ sessionId, ...s });
    }
    candidates.sort((a, b) => a.since - b.since);
    for (const c of candidates) {
      if (!compat(seeker, c)) continue;
      if (await Block.isBlocked(seeker.sessionId, c.sessionId)) continue;
      return c;
    }
    return null;
  },
};