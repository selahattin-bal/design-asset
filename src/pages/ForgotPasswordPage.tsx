import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import { requestPasswordReset } from '../services/authService';
import { ApiError } from '../services/apiClient';

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

export function ForgotPasswordPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [state, setState] = useState<SubmitState>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState('loading');
    setMessage('');

    try {
      const response = await requestPasswordReset({ email });
      setState('success');
      setMessage(t('authPages.forgotPassword.successMessage'));
      if (import.meta.env.DEV && response.message) {
        console.info('Password reset request accepted', response.message);
      }
    } catch (error) {
      setState('error');
      if (error instanceof ApiError) {
        setMessage(error.message);
      } else {
        setMessage(t('authPages.common.errorMessage'));
      }
      if (import.meta.env.DEV) {
        console.error('Password reset request failed', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-xl rounded-2xl border border-gray-200 p-8 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold text-gray-900">{t('authPages.forgotPassword.title')}</h1>
            <p className="text-sm text-gray-600">{t('authPages.forgotPassword.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                {t('authPages.common.emailLabel')}
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={event => setEmail(event.target.value)}
                placeholder={t('authPages.common.emailPlaceholder')}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
              disabled={state === 'loading'}
            >
              {state === 'loading' ? t('authPages.common.loadingLabel') : t('authPages.forgotPassword.submitLabel')}
            </button>
          </form>

          {message && (
            <p className={`text-sm text-center ${state === 'error' ? 'text-red-600' : 'text-emerald-600'}`}>
              {message}
            </p>
          )}

          <div className="text-center">
            <Link to="/signin" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              {t('authPages.forgotPassword.backToSignIn')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
