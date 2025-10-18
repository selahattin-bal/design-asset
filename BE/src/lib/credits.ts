import { ROLE_CREDIT_LIMITS, type UserRole } from './roles.js';

export type CreditPeriod = 'daily' | 'monthly';

export type UserCredits = {
  period: CreditPeriod;
  limit: number;
  balance: number;
  resetAt: string;
};

const toStartOfNextDay = (date: Date): Date => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  next.setDate(next.getDate() + 1);
  return next;
};

const toStartOfNextMonth = (date: Date): Date => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  next.setMonth(next.getMonth() + 1, 1);
  return next;
};

const serializeDate = (date: Date): string => date.toISOString();

export const createInitialCredits = (role: UserRole, now = new Date()): UserCredits | null => {
  const limits = ROLE_CREDIT_LIMITS[role];
  if (!limits) {
    return null;
  }

  if (typeof limits.daily === 'number') {
    const resetAt = toStartOfNextDay(now);
    return {
      period: 'daily',
      limit: limits.daily,
      balance: limits.daily,
      resetAt: serializeDate(resetAt),
    };
  }

  if (typeof limits.monthly === 'number') {
    const resetAt = toStartOfNextMonth(now);
    return {
      period: 'monthly',
      limit: limits.monthly,
      balance: limits.monthly,
      resetAt: serializeDate(resetAt),
    };
  }

  return null;
};

export const ensureCreditsForRole = (
  stored: UserCredits | undefined | null,
  role: UserRole,
  now = new Date(),
): { credits: UserCredits | null; changed: boolean } => {
  const initial = createInitialCredits(role, now);

  if (!initial) {
    return { credits: null, changed: Boolean(stored) };
  }

  if (!stored) {
    return { credits: initial, changed: true };
  }

  if (stored.period === initial.period && stored.limit === initial.limit) {
    // Existing credits align with role requirements.
    return { credits: stored, changed: false };
  }

  return { credits: initial, changed: true };
};

export const refreshCreditsIfNeeded = (
  credits: UserCredits,
  now = new Date(),
): { credits: UserCredits; changed: boolean } => {
  const resetAtDate = new Date(credits.resetAt);
  if (Number.isNaN(resetAtDate.getTime())) {
    // Reset date corrupted; restore to defaults.
    const initial = createInitialCreditsForPeriod(credits.period, credits.limit, now);
    return { credits: initial, changed: true };
  }

  if (now < resetAtDate) {
    return { credits, changed: false };
  }

  if (credits.period === 'daily') {
    const nextReset = toStartOfNextDay(now);
    return {
      credits: {
        ...credits,
        balance: credits.limit,
        resetAt: serializeDate(nextReset),
      },
      changed: true,
    };
  }

  const nextReset = toStartOfNextMonth(now);
  return {
    credits: {
      ...credits,
      balance: credits.limit,
      resetAt: serializeDate(nextReset),
    },
    changed: true,
  };
};

const createInitialCreditsForPeriod = (period: CreditPeriod, limit: number, now: Date): UserCredits => {
  if (period === 'daily') {
    return {
      period,
      limit,
      balance: limit,
      resetAt: serializeDate(toStartOfNextDay(now)),
    };
  }
  return {
    period,
    limit,
    balance: limit,
    resetAt: serializeDate(toStartOfNextMonth(now)),
  };
};
