const defaultBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

type FetchOptions = RequestInit & { parse?: 'json' | 'text' };

const buildUrl = (path: string): string => {
  if (/^https?:/i.test(path)) {
    return path;
  }

  if (!defaultBaseUrl) {
    return path;
  }

  if (path.startsWith('/')) {
    return `${defaultBaseUrl}${path}`;
  }

  return `${defaultBaseUrl}/${path}`;
};

export const apiFetch = async <TResponse = unknown>(
  path: string,
  options: FetchOptions = {},
): Promise<TResponse> => {
  const { parse = 'json', headers, ...rest } = options;
  const response = await fetch(buildUrl(path), {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });

  if (response.status === 204) {
    return undefined as TResponse;
  }

  const text = await response.text();
  const parseAsJson = parse === 'json';
  let data: unknown;

  if (text) {
    if (parseAsJson) {
      try {
        data = JSON.parse(text) as TResponse;
      } catch (error) {
        throw new ApiError(response.status, 'Failed to parse response payload.', { error });
      }
    } else {
      data = text as TResponse;
    }
  }

  if (!response.ok) {
    const message = (data as Record<string, unknown> | undefined)?.message;
    throw new ApiError(response.status, typeof message === 'string' ? message : 'Request failed.', data);
  }

  return data as TResponse;
};
