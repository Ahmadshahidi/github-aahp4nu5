export const ROLES = {
  ADMIN: 'admin',
  PAID: 'paid',
  BASIC: 'basic',
  GUEST: 'guest'
};

export const RESOURCES = {
  PUBLIC: 'public',
  PREMIUM: 'premium',
  DASHBOARD: 'dashboard'
};

export const ACTIONS = {
  READ: 'read',
  WRITE: 'write',
  MANAGE: 'manage'
};

export const roleHierarchy = {
  [ROLES.ADMIN]: [ROLES.PAID, ROLES.BASIC, ROLES.GUEST],
  [ROLES.PAID]: [ROLES.BASIC, ROLES.GUEST],
  [ROLES.BASIC]: [ROLES.GUEST],
  [ROLES.GUEST]: []
};