import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Download, Eye, Heart } from 'lucide-react';
import { AssetCard } from '../components/AssetCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { getAsset, listAssets, mapAssetToCardProps, formatAssetDate, type Asset } from '../services/assetService';
import { ApiError } from '../services/apiClient';
import { useI18n } from '../i18n/I18nProvider';

export function ModelDetailPage() {
  const { id } = useParams();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [relatedAssets, setRelatedAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const { t } = useI18n();

  const gallery = asset?.gallery?.length ? asset.gallery : asset ? [asset.image] : [];
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setActiveImage(0);
  }, [id]);

  useEffect(() => {
    if (!id) {
      return;
    }

    let isCancelled = false;
    setIsLoading(true);
    setErrorMessage(null);
    setNotFound(false);

    const fetchAsset = async () => {
      try {
        const item = await getAsset(id);
        if (isCancelled) {
          return;
        }

        setAsset(item);

        try {
          const candidates = await listAssets({ type: 'MODEL' });
          if (!isCancelled) {
            setRelatedAssets(candidates.filter(candidate => candidate.id !== item.id));
          }
        } catch (relatedError) {
          if (!isCancelled) {
            console.warn('Failed to load related model assets', relatedError);
          }
        }
      } catch (fetchError) {
        if (isCancelled) {
          return;
        }

        if (fetchError instanceof ApiError && fetchError.status === 404) {
          setNotFound(true);
          return;
        }

        const message = fetchError instanceof ApiError
          ? fetchError.message
          : fetchError instanceof Error
            ? fetchError.message
            : 'Unable to load the requested model.';
        setErrorMessage(message);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchAsset();

    return () => {
      isCancelled = true;
    };
  }, [id]);

  if (notFound) {
    return <Navigate to="/models" replace />;
  }

  if (!asset) {
    if (isLoading) {
      return (
        <div className="bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 py-16 flex justify-center">
            <LoadingSpinner label="Loading model…" className="text-sm text-gray-500" />
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-16 space-y-4 text-center">
          <p className="text-sm text-gray-500">{errorMessage ?? 'Unable to display this model right now.'}</p>
          <Link to="/models" className="text-sm font-semibold text-gray-900 underline">
            {t('sections.viewAllModels')}
          </Link>
        </div>
      </div>
    );
  }

  const related = relatedAssets
    .filter(item => asset.category && item.category === asset.category)
    .slice(0, 6);
  const fallbackRelated = (related.length > 0 ? related : relatedAssets).slice(0, 6);

  const categoryTranslationMap: Record<string, string> = {
    Furniture: 'filters.furniture',
    Decoration: 'filters.decoration',
    Lighting: 'filters.lighting',
    Workspace: 'filters.workspace',
    Bedroom: 'filters.bedroom',
    Bathroom: 'filters.bathroom',
    Kitchen: 'filters.kitchen',
    Childroom: 'filters.childroom',
    Technology: 'filters.technology',
    Exterior: 'filters.exterior',
    'Other Models': 'filters.otherModels',
  };

  const translateCategory = (category?: string) => {
    if (!category) {
      return undefined;
    }

    const key = categoryTranslationMap[category];
    return key ? t(key) : category;
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <nav className="text-sm text-gray-500 mb-6">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/" className="hover:text-gray-900">
                {t('breadcrumbs.home')}
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/models" className="hover:text-gray-900">
                {t('nav.models')}
              </Link>
            </li>
            {asset.category && (
              <>
                <li>/</li>
                <li className="text-gray-700">{translateCategory(asset.category)}</li>
              </>
            )}
            <li>/</li>
            <li className="text-gray-900">{asset.title}</li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div>
            <div className="bg-white rounded-3xl shadow-sm p-6">
              <img
                src={gallery[activeImage] ?? asset.image}
                alt={asset.title}
                className="w-full rounded-2xl object-cover"
              />
            </div>
            {gallery.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-4">
                {gallery.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`overflow-hidden rounded-2xl border-2 transition-colors ${
                      activeImage === index ? 'border-gray-900' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={image} alt={`${asset.title} view ${index + 1}`} className="h-24 w-32 object-cover" />
                  </button>
                ))}
              </div>
            )}

            {asset.description && (
              <div className="mt-10 bg-white rounded-3xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">{t('detail.overview')}</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{asset.description}</p>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="bg-white rounded-3xl shadow-sm p-6">
              {asset.brand && <p className="text-sm font-semibold text-gray-500 uppercase mb-2">{asset.brand}</p>}
              <h1 className="text-2xl font-bold text-gray-900 mb-3">{asset.title}</h1>
              {asset.subtitle && <p className="text-sm text-gray-500 mb-6">{asset.subtitle}</p>}

              <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700">
                  {typeof asset.credits === 'number' ? t('asset.credits', { count: asset.credits }) : t('asset.free')}
                </span>
                {asset.views !== undefined && (
                  <span className="inline-flex items-center gap-1 text-gray-500">
                    <Eye className="h-4 w-4" />
                    {asset.views}
                  </span>
                )}
                {asset.likes !== undefined && (
                  <span className="inline-flex items-center gap-1 text-gray-500">
                    <Heart className="h-4 w-4" />
                    {asset.likes}
                  </span>
                )}
                {formatAssetDate(asset) && <span className="text-xs text-gray-400 ml-auto">{formatAssetDate(asset)}</span>}
              </div>

              <div className="space-y-3">
                {asset.downloadOptions?.map(option => (
                  <button
                    key={option.label}
                    className="w-full inline-flex items-center justify-between rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition-colors"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      {option.label}
                    </span>
                    <span className="text-xs text-gray-300">{option.size}</span>
                  </button>
                ))}
              </div>

              <div className="mt-6 text-center text-xs text-gray-500">
                {t('asset.dailyCredits', { remaining: 3, total: 3 })} ·{' '}
                <button className="underline hover:text-gray-700">{t('buttons.getMoreCredits')}</button>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('detail.share')}</h2>
              <div className="flex gap-3">
                <button className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-gray-300">{t('buttons.copyLink')}</button>
                <button className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-gray-300">{t('buttons.save')}</button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">{t('sections.youMightAlsoLike')}</h2>
            <Link to="/models" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              {t('sections.viewAllModels')}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {fallbackRelated.map(relatedAsset => (
              <Link key={relatedAsset.id} to={`/models/${relatedAsset.id}`} className="block">
                <AssetCard {...mapAssetToCardProps(relatedAsset)} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
