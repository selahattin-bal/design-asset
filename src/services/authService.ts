import { apiFetch, ApiError } from './apiClient';

const TOKENS_STORAGE_KEY = 'ilmiora.auth.tokens';

type AuthRequest = {
  email: string;
  password: string;
};

type AuthResponse = {
  message?: string;
  user?: {
    id: string;
    email: string;
    createdAt?: string;
  };
  tokens?: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    refreshExpiresIn: number;
  };
};

type StoredTokens = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  refreshExpiresAt: number;
};

const persistTokens = (tokens?: AuthResponse['tokens']) => {
  if (!tokens) {
    return;
  }

  const now = Date.now();
  const payload: StoredTokens = {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresAt: now + tokens.expiresIn * 1000,
    refreshExpiresAt: now + tokens.refreshExpiresIn * 1000,
  };

  window.localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(payload));
};

export const clearTokens = () => {
  window.localStorage.removeItem(TOKENS_STORAGE_KEY);
};

export const getStoredTokens = (): StoredTokens | null => {
  try {
    const raw = window.localStorage.getItem(TOKENS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredTokens) : null;
  } catch (error) {
    console.error('Failed to parse stored tokens', error);
    return null;
  }
};

export const signUp = async (payload: AuthRequest): Promise<AuthResponse> => {
  try {
    const response = await apiFetch<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    persistTokens(response.tokens);
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Unable to sign up.');
  }
};

export const signIn = async (payload: AuthRequest): Promise<AuthResponse> => {
  try {
    const response = await apiFetch<AuthResponse>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    persistTokens(response.tokens);
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Unable to sign in.');
  }
};

export const getAuthorizationHeader = (): string | null => {
  const tokens = getStoredTokens();
  if (!tokens || Date.now() >= tokens.expiresAt) {
    return null;
  }
  return `Bearer ${tokens.accessToken}`;
};

export type { AuthResponse };
