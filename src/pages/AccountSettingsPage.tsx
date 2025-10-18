import type { ComponentType } from 'react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  CreditCard,
  BadgeDollarSign,
  Wallet,
  ClipboardList,
  ShoppingBag,
  Settings,
  Lock,
} from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';

type StoredUserCredits = {
  period: 'daily' | 'monthly';
  limit: number;
  balance: number;
  resetAt: string;
};

type StoredUser = {
  id: string;
  email: string;
  createdAt?: string;
  role?: string;
  credits?: StoredUserCredits;
};

type SectionId =
  | 'plan'
  | 'billing'
  | 'payment-methods'
  | 'collections'
  | 'purchases'
  | 'profile';

type SidebarItem = {
  id: SectionId;
  label: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
  to: string;
};

const readStoredUser = (): StoredUser | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const raw = window.localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to parse stored user', error);
    }
    return null;
  }
};

export function AccountSettingsPage() {
  const { t, language } = useI18n();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<StoredUser | null>(() => readStoredUser());
  const activeSection = (searchParams.get('section') as SectionId | null) ?? 'plan';

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const handleStorage = () => {
      setUser(readStoredUser());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const userInitial = user?.email?.[0]?.toUpperCase() ?? '?';
  const userName = user?.email?.split('@')[0] ?? t('account.profile.anonymous');
  const locale = language === 'tr' ? 'tr-TR' : 'en-US';
  const credits = user?.credits ?? null;

  const planValue = credits
    ? credits.period === 'daily'
      ? t('account.sidebar.plan.dailyCredits', { limit: credits.limit })
      : t('account.sidebar.plan.monthlyCredits', { limit: credits.limit })
    : t('account.sidebar.plan.valueFree');

  const quickLinks: SidebarItem[] = [
    {
      id: 'plan',
      label: t('account.sidebar.plan.label'),
      value: planValue,
      icon: CreditCard,
      to: '/pricing',
    },
    {
      id: 'billing',
      label: t('account.sidebar.billing.label'),
      value: t('account.sidebar.billing.value'),
      icon: BadgeDollarSign,
      to: '/account?section=billing',
    },
    {
      id: 'payment-methods',
      label: t('account.sidebar.paymentMethods.label'),
      value: t('account.sidebar.paymentMethods.value'),
      icon: Wallet,
      to: '/account?section=payment-methods',
    },
  ];

  const activityLinks: SidebarItem[] = [
    {
      id: 'collections',
      label: t('account.sidebar.collections.label'),
      value: t('account.sidebar.collections.value'),
      icon: ClipboardList,
      to: '/account?section=collections',
    },
    {
      id: 'purchases',
      label: t('account.sidebar.purchases.label'),
      value: t('account.sidebar.purchases.value'),
      icon: ShoppingBag,
      to: '/account?section=purchases',
    },
    {
      id: 'profile',
      label: t('account.sidebar.editProfile.label'),
      value: t('account.sidebar.editProfile.value'),
      icon: Settings,
      to: '/account?section=profile',
    },
  ];

  const renderActiveContent = () => {
    if (activeSection === 'profile') {
      const resetLabel = credits
        ? t('account.content.creditSummaryReset', {
            date: new Intl.DateTimeFormat(locale, {
              dateStyle: 'medium',
              timeStyle: 'short',
            }).format(new Date(credits.resetAt)),
          })
        : null;

      return (
        <div className="space-y-6">
          {credits && (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                  <CreditCard className="h-5 w-5" />
                </span>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">{t('account.content.creditSummaryTitle')}</h3>
                  <p className="text-sm text-gray-600">
                    {t('account.content.creditSummaryBalance', {
                      balance: credits.balance,
                      limit: credits.limit,
                    })}
                  </p>
                  {resetLabel && <p className="text-xs text-gray-400">{resetLabel}</p>}
                </div>
              </div>
            </div>
          )}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-900">{t('account.content.profileTitle')}</h2>
            <p className="mt-2 text-sm text-gray-600">{t('account.content.profileSubtitle')}</p>
            <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3 text-left">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-gray-700 shadow-sm">
                    <Settings className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t('account.content.profileDetailsTitle')}</p>
                    <p className="text-xs text-gray-500">{t('account.content.profileDetailsSubtitle')}</p>
                  </div>
                </div>
                <Link
                  to="/account?section=profile"
                  className="inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {t('account.content.profileEditCta')}
                </Link>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white">
                <Lock className="h-5 w-5" />
              </span>
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{t('account.content.resetPasswordTitle')}</h3>
                  <p className="mt-1 text-sm text-gray-600">{t('account.content.resetPasswordSubtitle')}</p>
                </div>
                <Link
                  to="/forgot-password"
                  className="inline-flex items-center justify-center rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
                >
                  {t('account.content.resetPasswordCta')}
                </Link>
                <p className="text-xs text-gray-400">{t('account.content.resetPasswordHint')}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[320px,1fr]">
        <aside className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 text-center">
            <div className="inline-flex h-28 w-28 items-center justify-center rounded-full bg-gray-900 text-white text-3xl font-semibold">
              {userInitial}
            </div>
            <div className="mt-6 space-y-1">
              <p className="text-xl font-semibold text-gray-900">{userName}</p>
              <p className="text-sm text-gray-500">{t('account.profile.roleLabel')}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
            <Link
              to="/pricing"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-gray-900 px-6 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
            >
              {t('account.profile.upgradeCta')}
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-1">
            {quickLinks.map(({ id, label, value, icon: Icon, to }) => {
              const isActive = activeSection === id;
              return (
              <Link
                key={id}
                to={to}
                className={`flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition-colors ${
                  isActive ? 'bg-gray-900 text-white shadow-lg hover:bg-gray-900/90' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      isActive ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-900'}`}>{label}</p>
                    <p className={`text-xs ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>{value}</p>
                  </div>
                </div>
                <svg
                  className={`h-4 w-4 ${isActive ? 'text-gray-300' : 'text-gray-300'}`}
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            );
            })}
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-1">
            {activityLinks.map(({ id, label, value, icon: Icon, to }) => {
              const isActive = activeSection === id;
              return (
              <Link
                key={id}
                to={to}
                className={`flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition-colors ${
                  isActive ? 'bg-gray-900 text-white shadow-lg hover:bg-gray-900/90' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      isActive ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-900'}`}>{label}</p>
                    <p className={`text-xs ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>{value}</p>
                  </div>
                </div>
                <svg
                  className={`h-4 w-4 ${isActive ? 'text-gray-300' : 'text-gray-300'}`}
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            );
            })}
          </div>
        </aside>

        <main className="space-y-6">
          {renderActiveContent()}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
            <h3 className="text-lg font-semibold text-gray-900">{t('account.content.activityTitle')}</h3>
            <p className="mt-2 text-sm text-gray-600">{t('account.content.activitySubtitle')}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {activityLinks.map(({ id, label, value, icon: Icon }) => (
                <div key={`${id}-card`} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-700 shadow-sm">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{label}</p>
                      <p className="text-xs text-gray-500">{value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
