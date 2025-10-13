import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Download, Eye, Heart } from 'lucide-react';
import { AssetCard } from '../components/AssetCard';
import { textureAssets } from '../data/homeContent';
import { useI18n } from '../i18n/I18nProvider';

const textureCategoryTranslationMap: Record<string, string> = {
  Wood: 'filters.wood',
  Stone: 'filters.surface',
  Concrete: 'filters.concrete',
  Brick: 'filters.decorationAccent',
  Fabric: 'filters.fabric',
  Leather: 'filters.decoration',
};

export function TextureDetailPage() {
  const { id } = useParams();
  const texture = useMemo(() => textureAssets.find(item => item.id === id), [id]);
  const { t } = useI18n();

  const gallery = texture?.gallery?.length ? texture.gallery : texture ? [texture.image] : [];
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setActiveImage(0);
  }, [id]);

  if (!texture) {
    return <Navigate to="/textures" replace />;
  }

  const related = textureAssets
    .filter(item => item.id !== texture.id && item.category && item.category === texture.category)
    .slice(0, 6);

  const translateCategory = (category?: string) => {
    if (!category) {
      return undefined;
    }

    const key = textureCategoryTranslationMap[category];
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
              <Link to="/textures" className="hover:text-gray-900">
                {t('nav.textures')}
              </Link>
            </li>
            {texture.category && (
              <>
                <li>/</li>
                <li className="text-gray-700">{translateCategory(texture.category)}</li>
              </>
            )}
            <li>/</li>
            <li className="text-gray-900">{texture.title}</li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div>
            <div className="bg-white rounded-3xl shadow-sm p-6">
              <img
                src={gallery[activeImage] ?? texture.image}
                alt={texture.title}
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
                    <img src={image} alt={`${texture.title} view ${index + 1}`} className="h-24 w-32 object-cover" />
                  </button>
                ))}
              </div>
            )}

            {texture.description && (
              <div className="mt-10 bg-white rounded-3xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">{t('detail.overview')}</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{texture.description}</p>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="bg-white rounded-3xl shadow-sm p-6">
              {texture.brand && <p className="text-sm font-semibold text-gray-500 uppercase mb-2">{texture.brand}</p>}
              <h1 className="text-2xl font-bold text-gray-900 mb-3">{texture.title}</h1>
              {texture.subtitle && <p className="text-sm text-gray-500 mb-6">{texture.subtitle}</p>}

              <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700">
                  {typeof texture.credits === 'number' ? t('asset.credits', { count: texture.credits }) : t('asset.free')}
                </span>
                {texture.views !== undefined && (
                  <span className="inline-flex items-center gap-1 text-gray-500">
                    <Eye className="h-4 w-4" />
                    {texture.views}
                  </span>
                )}
                {texture.likes !== undefined && (
                  <span className="inline-flex items-center gap-1 text-gray-500">
                    <Heart className="h-4 w-4" />
                    {texture.likes}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {texture.downloadOptions?.map(option => (
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
            <Link to="/textures" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              {t('sections.viewAllTextures')}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(related.length ? related : textureAssets.filter(item => item.id !== texture.id).slice(0, 4)).map(({ id: relatedId, ...asset }) => (
              <Link key={relatedId} to={`/textures/${relatedId}`} className="block">
                <AssetCard {...asset} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
