import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';

type Currency = 'usd' | 'try';

type CreditFrequency = 'month' | 'pack';
type BillingFrequency = 'monthly' | 'yearly';

type PlanConfig = {
  id: 'basic' | 'premium' | 'pro';
  price: Record<Currency, number>;
  creditOptions: number[];
  paymentType: BillingFrequency;
  creditType: CreditFrequency;
  highlight?: boolean;
};

const plans: PlanConfig[] = [
  {
    id: 'basic',
    price: { usd: 14.99, try: 399.99 },
    creditOptions: [200],
    paymentType: 'monthly',
    creditType: 'month',
  },
  {
    id: 'premium',
    price: { usd: 39.99, try: 1099.99 },
    creditOptions: [500],
    paymentType: 'monthly',
    creditType: 'month',
    highlight: true,
  },
  {
    id: 'pro',
    price: { usd: 79.99, try: 2199.99 },
    creditOptions: [1000],
    paymentType: 'monthly',
    creditType: 'month',
  },
];

const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5'] as const;
type FaqKey = (typeof faqKeys)[number];

export function PricingPage() {
  const { t, language } = useI18n();
  const [currency, setCurrency] = useState<Currency>('usd');
  const [openFaq, setOpenFaq] = useState<FaqKey | null>('q1');

  const locale = language === 'tr' ? 'tr-TR' : 'en-US';

  const formatPrice = useMemo(() => {
    return (value: number) =>
      new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency === 'usd' ? 'USD' : 'TRY',
        minimumFractionDigits: value % 1 === 0 ? 0 : 2,
        maximumFractionDigits: value % 1 === 0 ? 0 : 2,
      }).format(value);
  }, [currency, locale]);

  const creditLabelByType: Record<CreditFrequency, string> = {
    month: t('pricingPage.planLabels.creditsPerMonth'),
    pack: t('pricingPage.planLabels.creditsPerPack'),
  };

  const paymentLabelByType: Record<BillingFrequency, string> = {
    monthly: t('pricingPage.planLabels.paymentMonthly'),
    yearly: t('pricingPage.planLabels.paymentYearly'),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
            {t('pricingPage.title')}
          </h1>
          <p className="max-w-3xl mx-auto text-gray-600 text-base md:text-lg">
            {t('pricingPage.subtitle')}
          </p>
          <p className="text-sm text-gray-500">
            {t('pricingPage.notification')}
          </p>
          <div className="inline-flex rounded-full border border-gray-200 bg-gray-100 p-1">
            {(['usd', 'try'] as Currency[]).map(option => (
              <button
                key={option}
                type="button"
                onClick={() => setCurrency(option)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  currency === option
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {t(`pricingPage.currencyToggle.${option}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 justify-center">
          {plans.map(plan => {
            const name = t(`pricingPage.plans.${plan.id}.name`);
            const description = t(`pricingPage.plans.${plan.id}.description`);
            const paymentQuery = `pricingPage.plans.${plan.id}.payment`;
            const paymentKey = t(paymentQuery);
            const paymentLabel = paymentKey === paymentQuery ? paymentLabelByType[plan.paymentType] : t(paymentKey);
            const creditsQuery = `pricingPage.plans.${plan.id}.creditsLabel`;
            const creditsKey = t(creditsQuery);
            const creditLabel = creditsKey === creditsQuery ? creditLabelByType[plan.creditType] : t(creditsKey);
            const noteKey = `pricingPage.plans.${plan.id}.note`;
            const noteText = t(noteKey);
            const hasNote = noteText !== noteKey;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col gap-6 rounded-3xl border bg-white p-8 shadow-sm transition-transform hover:-translate-y-1 ${
                  plan.highlight
                    ? 'border-gray-900 shadow-xl ring-2 ring-gray-900'
                    : 'border-gray-200'
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gray-900 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                    {t('pricingPage.planLabels.badgeBestValue')}
                  </span>
                )}
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-gray-900 text-center md:text-left">{name}</h2>
                  <p className="text-sm text-gray-600 text-center md:text-left">{description}</p>
                </div>

                <div className="space-y-2 text-center md:text-left">
                  <div className="text-sm font-medium text-gray-500">{paymentLabel}</div>
                  <div className="text-3xl font-semibold text-gray-900">{formatPrice(plan.price[currency])}</div>
                  <div className="text-xs uppercase tracking-wide text-gray-400">{creditLabel}</div>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  {plan.creditOptions.map(value => (
                    <span
                      key={value}
                      className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600"
                    >
                      {value}
                    </span>
                  ))}
                </div>

                {hasNote && <p className="text-xs text-gray-500 text-center md:text-left">{noteText}</p>}

                <button
                  type="button"
                  className="mt-auto inline-flex justify-center rounded-full bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
                >
                  {t('pricingPage.actions.getStarted')}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 text-center">
            {t('pricingPage.faq.title')}
          </h2>

          <div className="space-y-4">
            {faqKeys.map(key => {
              const question = t(`pricingPage.faq.${key}.question`);
              const answer = t(`pricingPage.faq.${key}.answer`);
              const isOpen = openFaq === key;

              return (
                <div key={key} className="rounded-2xl border border-gray-200 bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : key)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                  >
                    <span className="text-sm font-medium text-gray-900">{question}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-sm text-gray-600">
                      {answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
