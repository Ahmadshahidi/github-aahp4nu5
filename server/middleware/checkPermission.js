import { defineRulesFor } from '../permissions/defineRulesFor.js';

export const checkPermission = (action, resource) => {
  return async (req, res, next) => {
    try {
      // In production, get user from session/token
      // For testing, we'll use query params
      const user = req.query.user ? JSON.parse(req.query.user) : null;
      
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const rules = defineRulesFor(user);
      
      const hasPermission = rules.some(rule => {
        const resourceMatch = rule.resource === '*' || rule.resource === resource;
        const actionMatch = rule.actions.includes(action);
        return resourceMatch && actionMatch && rule.allow;
      });

      if (!hasPermission) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: 'Permission check failed' });
    }
  };
};