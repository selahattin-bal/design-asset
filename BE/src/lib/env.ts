import { z } from 'zod';

type EnvConfig = {
  usersTable: string;
  assetsTable: string;
  jwtSecret: string;
  tokenTtlSeconds: number;
  refreshTtlSeconds: number;
  passwordResetTtlSeconds: number;
  passwordResetEmailSender: string;
  passwordResetUrlBase?: string;
};

let cachedEnv: EnvConfig | null = null;

const envSchema = z.object({
  USERS_TABLE: z.string().min(1),
  ASSETS_TABLE: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  TOKEN_TTL_SECONDS: z.coerce.number().positive().default(900),
  REFRESH_TTL_SECONDS: z.coerce.number().positive().default(604800),
  PASSWORD_RESET_TTL_SECONDS: z.coerce.number().positive().default(3600),
  PASSWORD_RESET_EMAIL_SENDER: z.string().email(),
  PASSWORD_RESET_URL_BASE: z.string().url().optional(),
});

export const getEnv = (): EnvConfig => {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = envSchema.parse({
    USERS_TABLE: process.env.USERS_TABLE,
    ASSETS_TABLE: process.env.ASSETS_TABLE,
    JWT_SECRET: process.env.JWT_SECRET,
    TOKEN_TTL_SECONDS: process.env.TOKEN_TTL_SECONDS,
    REFRESH_TTL_SECONDS: process.env.REFRESH_TTL_SECONDS,
    PASSWORD_RESET_TTL_SECONDS: process.env.PASSWORD_RESET_TTL_SECONDS,
    PASSWORD_RESET_EMAIL_SENDER: process.env.PASSWORD_RESET_EMAIL_SENDER,
    PASSWORD_RESET_URL_BASE: process.env.PASSWORD_RESET_URL_BASE,
  });

  cachedEnv = {
    usersTable: parsed.USERS_TABLE,
    assetsTable: parsed.ASSETS_TABLE,
    jwtSecret: parsed.JWT_SECRET,
    tokenTtlSeconds: parsed.TOKEN_TTL_SECONDS,
    refreshTtlSeconds: parsed.REFRESH_TTL_SECONDS,
    passwordResetTtlSeconds: parsed.PASSWORD_RESET_TTL_SECONDS,
    passwordResetEmailSender: parsed.PASSWORD_RESET_EMAIL_SENDER,
    passwordResetUrlBase: parsed.PASSWORD_RESET_URL_BASE,
  };

  return cachedEnv;
};
