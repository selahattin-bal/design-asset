import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { availableLanguages, translations, type Language } from './translations';

type Variables = Record<string, string | number>;

type I18nContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, vars?: Variables) => string;
  languages: Language[];
};

const I18N_STORAGE_KEY = 'LARUUS.language';

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const getTranslation = (language: Language, key: string): string => {
  const segments = key.split('.');
  let current: unknown = translations[language];

  for (const segment of segments) {
    if (typeof current === 'object' && current !== null && segment in current) {
      current = (current as Record<string, unknown>)[segment];
    } else {
      return key;
    }
  }

  if (typeof current === 'string') {
    return current;
  }

  return key;
};

const applyVariables = (template: string, vars?: Variables): string => {
  if (!vars) {
    return template;
  }

  return template.replace(/{{(\w+)}}/g, (_, variable: string) => {
    const value = vars[variable];
    return value === undefined ? `{{${variable}}}` : String(value);
  });
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') {
      return 'en';
    }

    const stored = window.localStorage.getItem(I18N_STORAGE_KEY) as Language | null;
    if (stored && availableLanguages.includes(stored)) {
      return stored;
    }

    const navigatorLanguage = window.navigator.language.split('-')[0] as Language | undefined;
    if (navigatorLanguage && availableLanguages.includes(navigatorLanguage)) {
      return navigatorLanguage;
    }

    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(I18N_STORAGE_KEY, lang);
    } catch (error) {
      console.warn('Failed to persist language preference', error);
    }
  };

  const value = useMemo<I18nContextValue>(() => {
    const translate = (key: string, vars?: Variables) => applyVariables(getTranslation(language, key), vars);

    return {
      language,
      setLanguage,
      t: translate,
      languages: availableLanguages,
    };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }

  return context;
};
