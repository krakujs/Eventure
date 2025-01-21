import { User } from '../types';

export const PERMISSIONS = {
  READ_EVENT: 'READ_EVENT',
  WRITE_EVENT: 'WRITE_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
  READ_TASK: 'READ_TASK',
  WRITE_TASK: 'WRITE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  READ_USER: 'READ_USER',
  WRITE_USER: 'WRITE_USER',
  DELETE_USER: 'DELETE_USER',
};

const rolePermissions = {
  ADMIN: Object.values(PERMISSIONS),
  ORGANIZER: [PERMISSIONS.READ_EVENT, PERMISSIONS.WRITE_EVENT, PERMISSIONS.READ_TASK, PERMISSIONS.WRITE_TASK],
  PARTICIPANT: [PERMISSIONS.READ_EVENT, PERMISSIONS.READ_TASK],
  GUEST: [PERMISSIONS.READ_EVENT],
};

export const hasPermission = (user: User, permission: string): boolean => {
  return rolePermissions[user.role].includes(permission);
};
