import { ROLES, RESOURCES, ACTIONS, roleHierarchy } from './roles.js';

const hasRole = (userRole, requiredRole) => {
  if (userRole === requiredRole) return true;
  return roleHierarchy[userRole]?.includes(requiredRole) || false;
};

export const defineRulesFor = (user) => {
  const rules = [];
  const role = user?.role || ROLES.GUEST;
  const isActive = user?.activityCount >= 3;
  const isPaid = user?.isPaid;

  // Public access
  rules.push({
    resource: RESOURCES.PUBLIC,
    actions: [ACTIONS.READ],
    allow: true
  });

  // Premium content rules
  if (isPaid || (hasRole(role, ROLES.BASIC) && isActive)) {
    rules.push({
      resource: RESOURCES.PREMIUM,
      actions: [ACTIONS.READ],
      allow: true
    });
  }

  if (isPaid || hasRole(role, ROLES.ADMIN)) {
    rules.push({
      resource: RESOURCES.PREMIUM,
      actions: [ACTIONS.WRITE],
      allow: true
    });
  }

  // Dashboard access
  if (isPaid || hasRole(role, ROLES.ADMIN)) {
    rules.push({
      resource: RESOURCES.DASHBOARD,
      actions: [ACTIONS.READ, ACTIONS.WRITE],
      allow: true
    });
  }

  // Admin full access
  if (hasRole(role, ROLES.ADMIN)) {
    rules.push({
      resource: '*',
      actions: [ACTIONS.MANAGE],
      allow: true
    });
  }

  return rules;
};