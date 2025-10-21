import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, Facebook, Instagram, Twitter, Youtube, Bookmark, ShoppingCart } from 'lucide-react';
import { Link, NavLink, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { HeaderSearch } from './components/HeaderSearch';
import { HomePage } from './pages/HomePage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { ModelsPage } from './pages/ModelsPage';
import { ModelDetailPage } from './pages/ModelDetailPage';
import { ScenesPage } from './pages/ScenesPage';
import { SceneDetailPage } from './pages/SceneDetailPage';
import { TexturesPage } from './pages/TexturesPage';
import { TextureDetailPage } from './pages/TextureDetailPage';
import { PricingPage } from './pages/PricingPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { AccountSettingsPage } from './pages/AccountSettingsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { useI18n } from './i18n/I18nProvider';
import { availableLanguages } from './i18n/translations';
import { clearTokens, getStoredTokens } from './services/authService';

type StoredUser = {
  id: string;
  email: string;
  createdAt?: string;
  role?: string;
  credits?: {
    period: 'daily' | 'monthly';
    limit: number;
    balance: number;
    resetAt: string;
  };
};

function App() {
  const { t, language, setLanguage } = useI18n();
  const navigate = useNavigate();
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'models' | 'scenes' | null>(null);
  const languageMenuRef = useRef<HTMLDivElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const dropdownCloseTimerRef = useRef<number | null>(null);
  const tokenExpiryTimerRef = useRef<number | null>(null);
  const location = useLocation();

  const readUserFromStorage = useCallback((): StoredUser | null => {
    try {
      const storedUser = window.localStorage.getItem('user');
      return storedUser ? (JSON.parse(storedUser) as StoredUser) : null;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to parse stored user info', error);
      }
      return null;
    }
  }, []);

  const [user, setUser] = useState<StoredUser | null>(() => readUserFromStorage());

  const categories = [
    'filters.furniture',
    'filters.decoration',
    'filters.childroom',
    'filters.technology',
    'filters.bathroom',
    'filters.lighting',
    'filters.kitchen',
    'filters.otherModels',
    'filters.exterior',
  ];
  const sceneCategories = ['filters.interior', 'filters.exterior'];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1 transition-colors ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}`;

  const languageLabels: Record<typeof availableLanguages[number], string> = {
    en: 'language.english',
    tr: 'language.turkish',
  };

  useEffect(() => {
    if (!languageMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [languageMenuOpen]);

  useEffect(() => {
    if (!profileMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileMenuOpen]);

  useEffect(() => {
    if (dropdownCloseTimerRef.current) {
      window.clearTimeout(dropdownCloseTimerRef.current);
      dropdownCloseTimerRef.current = null;
    }

    setOpenDropdown(null);
    // Close menus whenever the visible route changes
    setLanguageMenuOpen(false);
    setProfileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    return () => {
      if (dropdownCloseTimerRef.current) {
        window.clearTimeout(dropdownCloseTimerRef.current);
      }
    };
  }, []);

  const handleLogout = useCallback((options?: { redirectTo?: string; reason?: 'expired' | 'manual' }) => {
    window.localStorage.removeItem('user');
    clearTokens();
    setUser(null);
    setProfileMenuOpen(false);
    if (tokenExpiryTimerRef.current) {
      window.clearTimeout(tokenExpiryTimerRef.current);
      tokenExpiryTimerRef.current = null;
    }
    if (options?.redirectTo) {
      navigate(options.redirectTo, {
        replace: true,
        state: options.reason ? { reason: options.reason } : undefined,
      });
    }
  }, [navigate]);

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(readUserFromStorage());
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [readUserFromStorage]);

  useEffect(() => {
    setUser(readUserFromStorage());
  }, [location.key, readUserFromStorage]);

  const scheduleTokenExpiryCheck = useCallback(() => {
    if (tokenExpiryTimerRef.current) {
      window.clearTimeout(tokenExpiryTimerRef.current);
      tokenExpiryTimerRef.current = null;
    }

    const tokens = getStoredTokens();
    if (!tokens) {
      return;
    }

    const msUntilExpiry = tokens.expiresAt - Date.now();
    if (msUntilExpiry <= 0) {
      handleLogout({
        redirectTo: location.pathname.startsWith('/admin') ? '/signin' : undefined,
        reason: 'expired',
      });
      return;
    }

    tokenExpiryTimerRef.current = window.setTimeout(() => {
      handleLogout({
        redirectTo: location.pathname.startsWith('/admin') ? '/signin' : undefined,
        reason: 'expired',
      });
    }, msUntilExpiry);
  }, [handleLogout, location.pathname]);

  useEffect(() => {
    scheduleTokenExpiryCheck();
    return () => {
      if (tokenExpiryTimerRef.current) {
        window.clearTimeout(tokenExpiryTimerRef.current);
        tokenExpiryTimerRef.current = null;
      }
    };
  }, [scheduleTokenExpiryCheck, user?.id]);

  const userInitial = user?.email?.[0]?.toUpperCase() ?? '?';
  const userHandle = user?.email?.split('@')[0] ?? '';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {user?.role !== 'ADMIN' && (
        <header className="bg-gray-950 text-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-6 h-20">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold tracking-wide">
                LARUUS
              </Link>
            </div>

            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-300">
              <div
                className="relative"
                onMouseEnter={() => {
                  if (dropdownCloseTimerRef.current) {
                    window.clearTimeout(dropdownCloseTimerRef.current);
                    dropdownCloseTimerRef.current = null;
                  }
                  setOpenDropdown('models');
                }}
                onMouseLeave={() => {
                  dropdownCloseTimerRef.current = window.setTimeout(() => setOpenDropdown(null), 150);
                }}
              >
                <NavLink to="/models" className={navLinkClass}>
                  {t('nav.models')}
                  <ChevronDown className="h-4 w-4" />
                </NavLink>
                {/* Dropdown menu for 3D Models */}
                <div
                  onMouseEnter={() => {
                    if (dropdownCloseTimerRef.current) {
                      window.clearTimeout(dropdownCloseTimerRef.current);
                      dropdownCloseTimerRef.current = null;
                    }
                    setOpenDropdown('models');
                  }}
                  onMouseLeave={() => {
                    dropdownCloseTimerRef.current = window.setTimeout(() => setOpenDropdown(null), 150);
                  }}
                  className={`absolute left-0 top-full z-20 mt-3 w-[760px] rounded-3xl bg-gray-900/95 backdrop-blur shadow-2xl border border-gray-800 p-8 ${openDropdown === 'models' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-opacity duration-200`}
                >
                  <div className="flex flex-col gap-8">
                    <div>
                      <div className="text-base font-semibold text-white mb-5">{t('nav.models')}</div>
                      <div className="grid grid-cols-3 gap-8">
                        {[categories.slice(0, 3), categories.slice(3, 6), categories.slice(6)].map((column, columnIndex) => (
                          <div key={columnIndex} className="space-y-3">
                            {column.map(catKey => (
                              <a
                                key={catKey}
                                href="#"
                                className="block text-sm font-medium text-gray-300 hover:text-white transition-colors"
                              >
                                {t(catKey)}
                              </a>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-800">
                      <Link
                        to="/models"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:translate-x-1 transition-transform"
                      >
                        {t('nav.allModels')}
                        <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="relative"
                onMouseEnter={() => {
                  if (dropdownCloseTimerRef.current) {
                    window.clearTimeout(dropdownCloseTimerRef.current);
                    dropdownCloseTimerRef.current = null;
                  }
                  setOpenDropdown('scenes');
                }}
                onMouseLeave={() => {
                  dropdownCloseTimerRef.current = window.setTimeout(() => setOpenDropdown(null), 150);
                }}
              >
                <NavLink to="/scenes" className={navLinkClass}>
                  {t('nav.scenes')}
                  <ChevronDown className="h-4 w-4" />
                </NavLink>
                <div
                  onMouseEnter={() => {
                    if (dropdownCloseTimerRef.current) {
                      window.clearTimeout(dropdownCloseTimerRef.current);
                      dropdownCloseTimerRef.current = null;
                    }
                    setOpenDropdown('scenes');
                  }}
                  onMouseLeave={() => {
                    dropdownCloseTimerRef.current = window.setTimeout(() => setOpenDropdown(null), 150);
                  }}
                  className={`absolute left-0 top-full z-20 mt-3 w-[760px] rounded-3xl bg-gray-900/95 backdrop-blur shadow-2xl border border-gray-800 p-8 ${openDropdown === 'scenes' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-opacity duration-200`}
                >
                  <div className="flex flex-col gap-8">
                    <div>
                      <div className="text-base font-semibold text-white mb-5">{t('nav.scenes')}</div>
                      <div className="grid grid-cols-2 gap-6 max-w-md">
                        {sceneCategories.map((sceneKey, index) => (
                          <a
                            key={sceneKey}
                            href="#"
                            className={`block rounded-2xl border border-gray-800 px-6 py-4 text-sm font-medium transition-colors ${index === 0 ? 'bg-gray-800 text-white' : 'text-gray-300 hover:text-white hover:border-gray-700 hover:bg-gray-800/70'}`}
                          >
                            {t(sceneKey)}
                          </a>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-800">
                      <Link
                        to="/scenes"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:translate-x-1 transition-transform"
                      >
                        {t('nav.allScenes')}
                        <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <NavLink to="/textures" className={navLinkClass}>
                {t('nav.textures')}
              </NavLink>
              <NavLink to="/pricing" className={navLinkClass}>
                {t('nav.pricing')}
              </NavLink>
              {user?.role === 'ADMIN' && (
                <NavLink to="/admin" className={navLinkClass}>
                  {t('nav.dashboard')}
                </NavLink>
              )}
            </nav>

            <div className="hidden md:flex flex-1 justify-center">
              <div className="relative w-full max-w-2xl">
                <HeaderSearch />
              </div>
            </div>

            <div className="ml-auto flex items-center gap-4">
              {user ? (
                <>
                  <Link
                    to="/my-assets"
                    className="hidden md:inline-flex items-center gap-2 rounded-full border border-gray-800 px-4 py-2 text-sm font-medium text-gray-200 hover:border-gray-700 hover:text-white transition-colors"
                  >
                    <Bookmark className="h-4 w-4" />
                    {t('nav.myAssets')}
                  </Link>
                  <Link
                    to="/cart"
                    className="hidden md:inline-flex items-center gap-2 rounded-full border border-gray-800 px-4 py-2 text-sm font-medium text-gray-200 hover:border-gray-700 hover:text-white transition-colors"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {t('nav.cart')}
                  </Link>
                  <div className="relative" ref={profileMenuRef}>
                          <button
                            type="button"
                            onClick={() => setProfileMenuOpen(prev => !prev)}
                            className="inline-flex items-center gap-2 rounded-full border border-gray-800 bg-gray-900/80 px-2.5 py-1.5 text-sm font-medium text-gray-100 hover:border-gray-700 hover:text-white transition-colors"
                          >
                            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 text-base font-semibold">
                        {userInitial}
                        <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 border border-gray-900" />
                      </span>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {profileMenuOpen && (
                      <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-gray-900/95 border border-gray-800 shadow-2xl backdrop-blur z-30">
                        <div className="px-4 py-3 border-b border-gray-800">
                          <p className="text-sm font-semibold text-white">{userHandle || user?.email}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <nav className="py-2">
                          <Link
                            to="/account"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                          >
                            {t('profile.accountSettings')}
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleLogout({ redirectTo: '/signin', reason: 'manual' })}
                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                          >
                            {t('profile.signOut')}
                          </button>
                        </nav>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-gray-200 hover:text-white transition-colors"
                  >
                    {t('auth.signIn')}
                  </Link>
                  <Link
                    to="/signup"
                    className="hidden md:inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-black bg-white hover:bg-gray-200 transition-colors"
                  >
                    {t('auth.signUp')}
                  </Link>
                </>
              )}

              <div className="relative" ref={languageMenuRef}>
                <button
                  type="button"
                  onClick={() => setLanguageMenuOpen(prev => !prev)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-200 border border-gray-800 hover:border-gray-700 hover:text-white transition-colors"
                >
                  {t(languageLabels[language])}
                  <ChevronDown className={`h-4 w-4 transition-transform ${languageMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {languageMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 rounded-xl bg-gray-900/95 backdrop-blur border border-gray-800 shadow-xl overflow-hidden z-50">
                    {availableLanguages.map(lang => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => {
                          if (lang === language) {
                            setLanguageMenuOpen(false);
                            return;
                          }
                          setLanguage(lang);
                          setLanguageMenuOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                          lang === language ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        {t(languageLabels[lang])}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button className="md:hidden p-2 text-gray-300">
                <Menu className="h-6 w-6" />
              </button>
            </div>
            </div>
          </div>
        </header>
      )}
      <main className={`${user?.role === 'ADMIN' ? '' : 'flex-1'}`}>
        <Routes>
          <Route
            path="/"
            element={user?.role === 'ADMIN' ? <Navigate to="/admin" replace /> : <HomePage />}
          />
          <Route path="/models" element={<ModelsPage />} />
          <Route path="/models/:id" element={<ModelDetailPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/scenes" element={<ScenesPage />} />
          <Route path="/scenes/:id" element={<SceneDetailPage />} />
          <Route path="/textures" element={<TexturesPage />} />
          <Route path="/textures/:id" element={<TextureDetailPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/account" element={<AccountSettingsPage />} />
          <Route
            path="/admin"
            element={user?.role === 'ADMIN' ? <AdminDashboardPage /> : <Navigate to="/" replace />}
          />
        </Routes>
      </main>

      {user?.role !== 'ADMIN' && (
        <footer className="bg-gray-950 text-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-12 mb-12 text-center sm:text-left">
            <div className="min-w-[160px]">
              <h3 className="font-semibold mb-4">{t('footer.resources')}</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/models" className="hover:text-white">{t('nav.models')}</Link></li>
                <li><Link to="/scenes" className="hover:text-white">{t('nav.scenes')}</Link></li>
                <li><Link to="/textures" className="hover:text-white">{t('nav.textures')}</Link></li>
                <li><Link to="/pricing" className="hover:text-white">{t('nav.pricing')}</Link></li>
                <li><a href="#" className="hover:text-white">{t('nav.brands')}</a></li>
              </ul>
            </div>
            <div className="min-w-[160px]">
              <h3 className="font-semibold mb-4">{t('footer.company')}</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">{t('footer.about')}</a></li>
                <li><a href="#" className="hover:text-white">{t('footer.contact')}</a></li>
                <li><a href="#" className="hover:text-white">{t('footer.careers')}</a></li>
                <li><a href="#" className="hover:text-white">{t('footer.press')}</a></li>
              </ul>
            </div>
            <div className="min-w-[160px]">
              <h3 className="font-semibold mb-4">{t('footer.legal')}</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">{t('footer.terms')}</a></li>
                <li><a href="#" className="hover:text-white">{t('footer.privacy')}</a></li>
                <li><a href="#" className="hover:text-white">{t('footer.cookies')}</a></li>
                <li><a href="#" className="hover:text-white">{t('footer.licenses')}</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-2xl font-bold tracking-wide">LARUUS</div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-white">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            <p className="text-xs text-gray-500">{t('footer.copyright', { year: new Date().getFullYear() })}</p>
          </div>
        </div>
        </footer>
      )}
    </div>
  );
}

export default App;
