import process from 'node:process';
import { newModelAssets, newSceneAssets, textureAssets, featuredWorkAssets } from '../src/data/homeContent';

type FetchResponse = {
  status: number;
  ok: boolean;
  text(): Promise<string>;
};

type FetchLike = (url: string, init?: { method?: string; headers?: Record<string, string>; body?: string }) => Promise<FetchResponse>;

const fetchApi: FetchLike = (globalThis as { fetch?: FetchLike }).fetch ?? (() => {
  throw new Error('Fetch API is not available in this runtime.');
});

type AssetType = 'MODEL' | 'SCENE' | 'TEXTURE' | 'FEATURED';

type DownloadOption = {
  label: string;
  size: string;
  url?: string;
};

type SourceAsset = {
  id: string;
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
  downloadOptions?: DownloadOption[];
  date?: string;
  views?: number;
  likes?: number;
};

type UpsertAssetPayload = SourceAsset & {
  type: AssetType;
  status: 'DRAFT' | 'PUBLISHED';
  visibility: 'PUBLIC' | 'PRIVATE';
};

const ensureBaseUrl = (input: string): string => {
  const trimmed = input.trim();
  if (trimmed.endsWith('/')) {
    return trimmed.slice(0, -1);
  }
  return trimmed;
};

const apiBaseUrl = ensureBaseUrl(
  process.env.API_BASE_URL ??
    process.env.VITE_API_BASE_URL ??
    'https://fxappkyrnh.execute-api.eu-north-1.amazonaws.com',
);

const accessToken =
  process.env.ADMIN_ACCESS_TOKEN ??
  process.env.ACCESS_TOKEN ??
  process.env.AUTH_TOKEN ??
  process.env.BEARER_TOKEN ??
  '';

if (!accessToken) {
  console.error('Missing admin access token. Set ADMIN_ACCESS_TOKEN (or ACCESS_TOKEN/AUTH_TOKEN/BEARER_TOKEN).');
  process.exit(1);
}

const toPayload = (asset: SourceAsset, type: AssetType): UpsertAssetPayload => ({
  id: asset.id,
  type,
  title: asset.title,
  subtitle: asset.subtitle,
  author: asset.author,
  category: asset.category,
  brand: asset.brand,
  description: asset.description,
  credits: asset.credits,
  size: asset.size,
  aspectRatio: asset.aspectRatio,
  image: asset.image,
  gallery: asset.gallery,
  downloadOptions: asset.downloadOptions?.map(option => ({
    label: option.label,
    size: option.size,
    url: option.url,
  })),
  status: 'PUBLISHED',
  visibility: 'PUBLIC',
  date: asset.date,
  views: asset.views,
  likes: asset.likes,
});

const payloads: UpsertAssetPayload[] = [
  ...newModelAssets.map(asset => toPayload(asset, 'MODEL')),
  ...newSceneAssets.map(asset => toPayload(asset, 'SCENE')),
  ...textureAssets.map(asset => toPayload(asset, 'TEXTURE')),
  ...featuredWorkAssets.map(asset => toPayload(asset, 'FEATURED')),
];

const seedAsset = async (payload: UpsertAssetPayload) => {
  const response = await fetchApi(`${apiBaseUrl}/assets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 409) {
    console.warn(`Skipping ${payload.id}: already exists.`);
    return;
  }

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Failed to seed ${payload.id} (${response.status}): ${detail || 'Unknown error'}`);
  }

  console.info(`Seeded ${payload.id}`);
};

const seedAll = async () => {
  for (const payload of payloads) {
    await seedAsset(payload);
  }
};

seedAll().catch(error => {
  console.error('Seeding failed.', error);
  process.exit(1);
});
