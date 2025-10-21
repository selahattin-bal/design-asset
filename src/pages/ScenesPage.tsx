import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AssetCard } from '../components/AssetCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { listAssets, mapAssetToCardProps, type Asset } from '../services/assetService';
import { ApiError } from '../services/apiClient';
import { useI18n } from '../i18n/I18nProvider';

export function ScenesPage() {
  const { t } = useI18n();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchAssets = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const items = await listAssets({ type: 'SCENE' });
        if (!isCancelled) {
          setAssets(items);
        }
      } catch (fetchError) {
        if (!isCancelled) {
          const message = fetchError instanceof ApiError
            ? fetchError.message
            : fetchError instanceof Error
              ? fetchError.message
              : 'Unable to load assets.';
          setError(message);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchAssets();
    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="bg-gray-50 py-12 md:py-16 min-h-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wider text-gray-500">{t('filters.catalog')}</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{t('nav.scenes')}</h1>
            <p className="mt-2 text-sm text-gray-500">{t('scenesPage.description')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
              <span>{t('filters.type')}</span>
              <select className="bg-transparent text-sm text-gray-700 focus:outline-none">
                <option>{t('filters.all')}</option>
                <option>{t('filters.interior')}</option>
                <option>{t('filters.exterior')}</option>
                <option>{t('filters.commercial')}</option>
              </select>
            </label>
            <button className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm hover:border-gray-300">{t('buttons.reset')}</button>
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        )}

        {isLoading ? (
          <LoadingSpinner label="Loading assets…" className="text-sm text-gray-500" />
        ) : assets.length === 0 ? (
          <p className="text-sm text-gray-500">No assets available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map(asset => (
              <Link key={asset.id} to={`/scenes/${asset.id}`} className="block">
                <AssetCard
                  {...mapAssetToCardProps(
                    asset,
                    {
                      sizeOverride: 'medium',
                      aspectRatioOverride: 'square',
                    },
                  )}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
