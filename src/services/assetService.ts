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

export const listAssets = async (): Promise<Asset[]> => {
  const response = await apiFetch<AssetListResponse>('/assets');
  return response?.items ?? [];
};

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
