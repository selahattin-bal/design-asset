import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { getEnv } from './env.js';
import type { UserRole } from './roles.js';

type TokenPayload = {
  sub: string;
  email: string;
  role: UserRole;
  scope: 'access' | 'refresh';
};

type Tokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
};

export const hashPassword = (password: string): string => bcrypt.hashSync(password, 10);
export const verifyPassword = (password: string, hash: string): boolean => bcrypt.compareSync(password, hash);

export const createTokens = (userId: string, email: string, role: UserRole): Tokens => {
  const env = getEnv();
  const accessPayload: TokenPayload = { sub: userId, email, role, scope: 'access' };
  const refreshPayload: TokenPayload = { sub: userId, email, role, scope: 'refresh' };

  const accessToken = jwt.sign(accessPayload, env.jwtSecret, { expiresIn: env.tokenTtlSeconds });
  const refreshToken = jwt.sign(refreshPayload, env.jwtSecret, { expiresIn: env.refreshTtlSeconds });

  return {
    accessToken,
    refreshToken,
    expiresIn: env.tokenTtlSeconds,
    refreshExpiresIn: env.refreshTtlSeconds,
  };
};

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token, { json: true });
  } catch (error) {
    console.error('Failed to decode token', error);
    return null;
  }
};
