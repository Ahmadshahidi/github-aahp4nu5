import { ROLES } from '../permissions/roles.js';

export const mockUsers = {
  admin: {
    id: '1',
    role: ROLES.ADMIN,
    isPaid: true,
    activityCount: 10
  },
  paidUser: {
    id: '2',
    role: ROLES.PAID,
    isPaid: true,
    activityCount: 5
  },
  activeBasicUser: {
    id: '3',
    role: ROLES.BASIC,
    isPaid: false,
    activityCount: 4
  },
  inactiveBasicUser: {
    id: '4',
    role: ROLES.BASIC,
    isPaid: false,
    activityCount: 1
  },
  guest: {
    id: '5',
    role: ROLES.GUEST,
    isPaid: false,
    activityCount: 0
  }
};