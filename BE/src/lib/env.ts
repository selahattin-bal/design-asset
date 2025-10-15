import { z } from 'zod';

type EnvConfig = {
  usersTable: string;
  jwtSecret: string;
  tokenTtlSeconds: number;
  refreshTtlSeconds: number;
  allowedOrigins: string[];
};

let cachedEnv: EnvConfig | null = null;

const envSchema = z.object({
  USERS_TABLE: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  TOKEN_TTL_SECONDS: z.coerce.number().positive().default(900),
  REFRESH_TTL_SECONDS: z.coerce.number().positive().default(604800),
  ALLOWED_ORIGINS: z.string().optional(),
});

export const getEnv = (): EnvConfig => {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = envSchema.parse({
    USERS_TABLE: process.env.USERS_TABLE,
    JWT_SECRET: process.env.JWT_SECRET,
    TOKEN_TTL_SECONDS: process.env.TOKEN_TTL_SECONDS,
    REFRESH_TTL_SECONDS: process.env.REFRESH_TTL_SECONDS,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  });

  cachedEnv = {
    usersTable: parsed.USERS_TABLE,
    jwtSecret: parsed.JWT_SECRET,
    tokenTtlSeconds: parsed.TOKEN_TTL_SECONDS,
    refreshTtlSeconds: parsed.REFRESH_TTL_SECONDS,
    allowedOrigins: parsed.ALLOWED_ORIGINS
      ? parsed.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()).filter(Boolean)
      : [],
  };

  return cachedEnv;
};
