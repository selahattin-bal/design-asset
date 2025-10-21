import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';

const DEBOUNCE_MS = 2000;

export function HeaderSearch() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState('');
  const debounceTimerRef = useRef<number | null>(null);

  const placeholder = t('searchPlaceholder');
  const submitLabel = t('buttons.search');

  const performNavigate = useCallback((term: string, options?: { replace?: boolean }) => {
    const trimmed = term.trim();

    if (!trimmed) {
      if (location.pathname === '/search') {
        navigate('/search', { replace: options?.replace });
      }
      return;
    }

    const currentQuery = new URLSearchParams(location.search).get('query')?.trim() ?? '';
    if (trimmed === currentQuery) {
      return;
    }

    navigate(`/search?query=${encodeURIComponent(trimmed)}`, { replace: options?.replace });
  }, [location.pathname, location.search, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const currentQuery = params.get('query') ?? '';
    setValue(currentQuery);
  }, [location.search]);

  useEffect(() => {
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    debounceTimerRef.current = window.setTimeout(() => {
      performNavigate(value, { replace: true });
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [performNavigate, value]);

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        if (debounceTimerRef.current) {
          window.clearTimeout(debounceTimerRef.current);
          debounceTimerRef.current = null;
        }
        performNavigate(value);
      }}
      className="relative w-full"
    >
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
      <input
        type="search"
        value={value}
        onChange={event => setValue(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full bg-gray-900/90 border border-gray-800 py-3 pl-12 pr-24 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gray-200 px-4 py-1.5 text-xs font-semibold text-gray-900 hover:bg-white"
      >
        {submitLabel}
      </button>
    </form>
  );
}