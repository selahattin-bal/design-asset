import { Link } from 'react-router-dom';
import { AssetCard } from '../components/AssetCard';
import { newSceneAssets } from '../data/homeContent';
import { useI18n } from '../i18n/I18nProvider';

export function ScenesPage() {
  const { t } = useI18n();

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newSceneAssets.map(({ id, ...asset }) => (
            <Link key={id} to={`/scenes/${id}`} className="block">
              <AssetCard {...asset} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
