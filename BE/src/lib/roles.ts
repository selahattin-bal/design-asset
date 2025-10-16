export const USER_ROLES = [
  'ADMIN',
  'CONTENT_MANAGER',
  'CREATOR',
  'PAID_USER',
  'FREE_USER',
  'GUEST',
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const DEFAULT_USER_ROLE: UserRole = 'FREE_USER';

export const isUserRole = (value: unknown): value is UserRole =>
  typeof value === 'string' && USER_ROLES.includes(value as UserRole);
