export function validateBody(schema) {
  return (req, res, next) => {
    for (const [key, spec] of Object.entries(schema)) {
      const v = req.body?.[key];
      if (spec.required && (v === undefined || v === null || v === '')) {
        return res.status(400).json({ error: `${key} is required` });
      }
      if (v !== undefined && spec.type && typeof v !== spec.type) {
        return res.status(400).json({ error: `${key} must be ${spec.type}` });
      }
      if (spec.maxLen && typeof v === 'string' && v.length > spec.maxLen) {
        return res.status(400).json({ error: `${key} too long` });
      }
    }
    next();
  };
}