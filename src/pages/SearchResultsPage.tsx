import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AssetCard } from '../components/AssetCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { listAssets, mapAssetToCardProps, type Asset } from '../services/assetService';
import { ApiError } from '../services/apiClient';
import { useI18n } from '../i18n/I18nProvider';

export function SearchResultsPage() {
  const { t } = useI18n();
  const [params] = useSearchParams();
  const query = useMemo(() => params.get('query')?.trim() ?? '', [params]);

  const translateOrFallback = (key: string, fallback: string, vars?: Record<string, string | number>) => {
    const value = t(key, vars);
    return value === key ? fallback : value;
  };

  const [results, setResults] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    listAssets({ query })
      .then(items => {
        if (isCancelled) {
          return;
        }
        setResults(items);
      })
      .catch(fetchError => {
        if (isCancelled) {
          return;
        }
        const message = fetchError instanceof ApiError
          ? fetchError.message
          : fetchError instanceof Error
            ? fetchError.message
            : 'Unable to search assets.';
        setError(message);
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [query]);

  const hasQuery = query.length > 0;
  const searchLabel = translateOrFallback('buttons.search', 'Search');

  return (
    <div className="bg-gray-50 min-h-screen py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wider text-gray-500">{t('filters.catalog')}</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{searchLabel}</h1>
            <p className="mt-2 text-sm text-gray-500">
              {hasQuery
                ? translateOrFallback('search.resultsFor', `Search results for "${query}".`, { query })
                : translateOrFallback('search.startPrompt', 'Enter a term to discover matching assets.')}
            </p>
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner label={translateOrFallback('search.loading', 'Loading search results…')} />
          </div>
        ) : !hasQuery ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center text-sm text-gray-500">
            {translateOrFallback('search.emptyState', 'Search for a model, scene, or texture to see live results.')}
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white px-6 py-12 text-center text-sm text-gray-500">
            {translateOrFallback('search.noResults', `No assets matched "${query}".`, { query })}
          </div>
        ) : (
          <section className="rounded-3xl border border-gray-200 bg-white">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-semibold text-gray-900">{translateOrFallback('search.resultsHeading', 'Matching assets')}</h2>
                <p className="text-xs text-gray-500">
                  {translateOrFallback('search.resultCount', `Showing ${results.length} result(s).`, { count: results.length })}
                </p>
              </div>
              <Link to="/" className="text-xs font-semibold text-gray-500 hover:text-gray-900">
                {t('buttons.backHome')}
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-6 pb-8 pt-6">
              {results.map(asset => (
                <Link key={asset.id} to={`/${asset.type.toLowerCase()}s/${asset.id}`} className="block">
                  <AssetCard
                    {...mapAssetToCardProps(asset, {
                      sizeOverride: 'medium',
                      aspectRatioOverride: 'square',
                    })}
                  />
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
