import { apiFetch, ApiError } from './apiClient';
import { getAuthorizationHeader } from './authService';

export type AssetType = 'MODEL' | 'SCENE' | 'TEXTURE' | 'FEATURED';
export type AssetStatus = 'DRAFT' | 'PUBLISHED';
export type AssetVisibility = 'PUBLIC' | 'PRIVATE';

export type AssetDownloadOption = {
  label: string;
  size: string;
  url?: string;
};

export type Asset = {
  id: string;
  type: AssetType;
  title: string;
  subtitle?: string;
  author?: string;
  category?: string;
  brand?: string;
  description?: string;
  credits?: number | 'free';
  size?: string;
  aspectRatio?: string;
  image: string;
  gallery?: string[];
  downloadOptions?: AssetDownloadOption[];
  tags?: string[];
  status: AssetStatus;
  visibility: AssetVisibility;
  date?: string;
  views?: number;
  likes?: number;
  createdAt: string;
  updatedAt: string;
};

export type UpsertAssetPayload = Partial<Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>> & {
  id?: string;
  credits?: number | 'free';
};

const cardSizes = ['small', 'medium', 'large'] as const;
const aspectRatios = ['square', 'video', 'portrait'] as const;

type CardSize = (typeof cardSizes)[number];
type CardAspectRatio = (typeof aspectRatios)[number];

const parseCardSize = (value?: string): CardSize => {
  if (!value) {
    return 'medium';
  }
  const normalized = value.toLowerCase();
  return cardSizes.includes(normalized as CardSize) ? (normalized as CardSize) : 'medium';
};

const parseAspectRatio = (value?: string): CardAspectRatio => {
  if (!value) {
    return 'square';
  }
  const normalized = value.toLowerCase();
  return aspectRatios.includes(normalized as CardAspectRatio)
    ? (normalized as CardAspectRatio)
    : 'square';
};

const formatDateString = (value?: string | null) => {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return trimmed;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed);
};

type AssetResponse = {
  item: Asset;
};

type AssetListResponse = {
  items?: Asset[];
  count?: number;
  scannedCount?: number;
};

const requireAuthorizationHeader = (): string => {
  const authorization = getAuthorizationHeader();
  if (!authorization) {
    throw new ApiError(401, 'Authorization required. Please sign in again.');
  }
  return authorization;
};

type ListAssetsOptions = {
  type?: AssetType;
  query?: string;
};

const buildAssetsPath = (options?: ListAssetsOptions) => {
  if (!options) {
    return '/assets';
  }

  const params = new URLSearchParams();
  if (options.type) {
    params.set('type', options.type);
  }
  if (options.query) {
    params.set('query', options.query);
  }

  const queryString = params.toString();
  return queryString ? `/assets?${queryString}` : '/assets';
};

export const listAssets = async (options?: ListAssetsOptions): Promise<Asset[]> => {
  const response = await apiFetch<AssetListResponse>(buildAssetsPath(options));
  return response?.items ?? [];
};

type MapAssetToCardOptions = {
  sizeOverride?: CardSize;
  aspectRatioOverride?: CardAspectRatio;
};

export const mapAssetToCardProps = (asset: Asset, options?: MapAssetToCardOptions) => ({
  image: asset.image,
  title: asset.title,
  subtitle: asset.subtitle ?? asset.category ?? asset.type.toLowerCase(),
  author: asset.author ?? asset.brand,
  views: asset.views ?? 0,
  likes: asset.likes ?? 0,
  date: asset.date ?? formatDateString(asset.updatedAt ?? asset.createdAt),
  credits: asset.credits ?? 'free',
  size: options?.sizeOverride ?? parseCardSize(asset.size),
  aspectRatio: options?.aspectRatioOverride ?? parseAspectRatio(asset.aspectRatio),
});

export const formatAssetDate = (asset: Asset) =>
  formatDateString(asset.date ?? asset.updatedAt ?? asset.createdAt);

export const getAsset = async (id: string): Promise<Asset> => {
  const response = await apiFetch<AssetResponse>(`/assets/${encodeURIComponent(id)}`);
  return response.item;
};

export const createAsset = async (payload: UpsertAssetPayload): Promise<Asset> => {
  const authorization = requireAuthorizationHeader();
  const response = await apiFetch<AssetResponse>('/assets', {
    method: 'POST',
    headers: { Authorization: authorization },
    body: JSON.stringify(payload),
  });
  return response.item;
};

export const updateAsset = async (id: string, payload: UpsertAssetPayload): Promise<Asset> => {
  const authorization = requireAuthorizationHeader();
  const response = await apiFetch<AssetResponse>(`/assets/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { Authorization: authorization },
    body: JSON.stringify(payload),
  });
  return response.item;
};

export const deleteAsset = async (id: string): Promise<void> => {
  const authorization = requireAuthorizationHeader();
  await apiFetch(`/assets/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { Authorization: authorization },
  });
};
