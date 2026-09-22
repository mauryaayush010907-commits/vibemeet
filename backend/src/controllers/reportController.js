import { moderationService } from '../services/moderationService.js';

export const reportController = {
  async create(req, res, next) {
    try {
      await moderationService.report(req.body || {});
      res.status(201).json({ ok: true });
    } catch (err) { next(err); }
  },
  async block(req, res, next) {
    try {
      await moderationService.block(req.body || {});
      res.status(201).json({ ok: true });
    } catch (err) { next(err); }
  },
};
