import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AssetCard } from '../components/AssetCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { listAssets, mapAssetToCardProps, type Asset } from '../services/assetService';
import { ApiError } from '../services/apiClient';
import { useI18n } from '../i18n/I18nProvider';

export function HomePage() {
  const { t } = useI18n();
  const [modelAssets, setModelAssets] = useState<Asset[]>([]);
  const [sceneAssets, setSceneAssets] = useState<Asset[]>([]);
  const [textureAssets, setTextureAssets] = useState<Asset[]>([]);
  const [featuredAssets, setFeaturedAssets] = useState<Asset[]>([]);
  type SectionKey = 'models' | 'scenes' | 'textures' | 'featured';
  const [loadingMap, setLoadingMap] = useState<Record<SectionKey, boolean>>({
    models: true,
    scenes: true,
    textures: true,
    featured: true,
  });
  const [errorMap, setErrorMap] = useState<Record<SectionKey, string | null>>({
    models: null,
    scenes: null,
    textures: null,
    featured: null,
  });

  useEffect(() => {
    let isCancelled = false;

    const sections: Array<{ key: SectionKey; type: Asset['type']; setter: (items: Asset[]) => void }> = [
      { key: 'models', type: 'MODEL', setter: setModelAssets },
      { key: 'scenes', type: 'SCENE', setter: setSceneAssets },
      { key: 'textures', type: 'TEXTURE', setter: setTextureAssets },
      { key: 'featured', type: 'FEATURED', setter: setFeaturedAssets },
    ];

    sections.forEach(({ key, type, setter }) => {
      setLoadingMap(prev => ({ ...prev, [key]: true }));
      setErrorMap(prev => ({ ...prev, [key]: null }));

      listAssets({ type })
        .then(items => {
          if (isCancelled) {
            return;
          }
          setter(items);
          setLoadingMap(prev => ({ ...prev, [key]: false }));
        })
        .catch(fetchError => {
          if (isCancelled) {
            return;
          }

          const message = fetchError instanceof ApiError
            ? fetchError.message
            : fetchError instanceof Error
              ? fetchError.message
              : 'Unable to load assets.';
          setErrorMap(prev => ({ ...prev, [key]: message }));
          setLoadingMap(prev => ({ ...prev, [key]: false }));
        });
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <>
      <section className="relative bg-gradient-to-br from-gray-50 to-gray-100 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('hero.titleLine1')}
              <br />
              <span className="text-gray-600">{t('hero.titleLine2')}</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{t('sections.newModels')}</h2>
            <Link to="/models" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              {t('buttons.viewAll')}
            </Link>
          </div>
          {errorMap.models && (
            <div className="mb-4 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {errorMap.models}
            </div>
          )}
          {loadingMap.models ? (
            <LoadingSpinner label="Loading assets…" className="text-sm text-gray-500" />
          ) : modelAssets.length === 0 ? (
            <p className="text-sm text-gray-500">No assets available yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {modelAssets.slice(0, 8).map(asset => (
                <Link key={asset.id} to={`/models/${asset.id}`} className="block">
                  <AssetCard {...mapAssetToCardProps(asset)} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{t('sections.newScenes')}</h2>
            <Link to="/scenes" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              {t('buttons.viewAll')}
            </Link>
          </div>
          {errorMap.scenes && (
            <div className="mb-4 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {errorMap.scenes}
            </div>
          )}
          {loadingMap.scenes ? (
            <LoadingSpinner label="Loading assets…" className="text-sm text-gray-500" />
          ) : sceneAssets.length === 0 ? (
            <p className="text-sm text-gray-500">No assets available yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sceneAssets.slice(0, 6).map(asset => (
                <Link key={asset.id} to={`/scenes/${asset.id}`} className="block">
                  <AssetCard
                    {...mapAssetToCardProps(asset, { sizeOverride: 'small', aspectRatioOverride: 'square' })}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{t('sections.newTextures')}</h2>
            <Link to="/textures" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              {t('buttons.viewAll')}
            </Link>
          </div>
          {errorMap.textures && (
            <div className="mb-4 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {errorMap.textures}
            </div>
          )}
          {loadingMap.textures ? (
            <LoadingSpinner label="Loading assets…" className="text-sm text-gray-500" />
          ) : textureAssets.length === 0 ? (
            <p className="text-sm text-gray-500">No assets available yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {textureAssets.slice(0, 6).map(asset => (
                <Link key={asset.id} to={`/textures/${asset.id}`} className="block">
                  <AssetCard
                    {...mapAssetToCardProps(asset, { sizeOverride: 'small', aspectRatioOverride: 'square' })}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{t('sections.featuredWorks')}</h2>
            <Link to="/scenes" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              {t('buttons.viewAll')}
            </Link>
          </div>
          {errorMap.featured && (
            <div className="mb-4 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {errorMap.featured}
            </div>
          )}
          {loadingMap.featured ? (
            <LoadingSpinner label="Loading assets…" className="text-sm text-gray-500" />
          ) : featuredAssets.length === 0 ? (
            <p className="text-sm text-gray-500">No assets available yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {featuredAssets.slice(0, 3).map(asset => (
                <AssetCard key={asset.id} {...mapAssetToCardProps(asset)} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
