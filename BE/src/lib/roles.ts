export const USER_ROLES = [
  'ADMIN',
  'CONTENT_MANAGER',
  'CREATOR',
  'BASIC_USER',
  'PREMIUM_USER',
  'PRO_USER',
  'FREE_USER',
  'GUEST',
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const DEFAULT_USER_ROLE: UserRole = 'FREE_USER';

type RoleCredits = {
  daily?: number;
  monthly?: number;
};

export const ROLE_CREDIT_LIMITS: Record<UserRole, RoleCredits> = {
  ADMIN: {},
  CONTENT_MANAGER: {},
  CREATOR: {},
  BASIC_USER: { monthly: 200 },
  PREMIUM_USER: { monthly: 500 },
  PRO_USER: { monthly: 1000 },
  FREE_USER: { daily: 10 },
  GUEST: {},
};

export const isPaidRole = (role: UserRole): role is 'BASIC_USER' | 'PREMIUM_USER' | 'PRO_USER' =>
  role === 'BASIC_USER' || role === 'PREMIUM_USER' || role === 'PRO_USER';

export const isUserRole = (value: unknown): value is UserRole =>
  typeof value === 'string' && USER_ROLES.includes(value as UserRole);
