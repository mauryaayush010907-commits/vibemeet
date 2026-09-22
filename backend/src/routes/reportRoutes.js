import { Router } from 'express';
import { reportController } from '../controllers/reportController.js';
import { validateBody } from '../middleware/validation.js';
import { apiLimiter } from '../middleware/rateLiniter.js';

const r = Router();
r.post('/', apiLimiter, validateBody({
  reporter_session: { required: true, type: 'string' },
  reported_session: { required: true, type: 'string' },
  reason: { required: true, type: 'string', maxLen: 100 },
  description: { type: 'string', maxLen: 500 },
}), reportController.create);

r.post('/block', apiLimiter, validateBody({
  blocker_session: { required: true, type: 'string' },
  blocked_session: { required: true, type: 'string' },
}), reportController.block);

export default r;
