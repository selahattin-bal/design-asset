import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Chrome } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import { signIn } from '../services/authService';
import { ApiError } from '../services/apiClient';

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

export function SignInPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState<SubmitState>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState('loading');
    setMessage('');

    try {
      const response = await signIn({ email, password });
      setState('success');
      setMessage(response.message ?? t('authPages.common.successMessage'));
      setPassword('');

      if (response.user) {
        window.localStorage.setItem('user', JSON.stringify(response.user));
      }

      navigate('/');
    } catch (error) {
      setState('error');
      if (error instanceof ApiError) {
        setMessage(error.message);
      } else {
        setMessage(t('authPages.common.errorMessage'));
      }
      if (import.meta.env.DEV) {
        console.error('Sign in failed', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-xl rounded-2xl border border-gray-200 p-8 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold text-gray-900">{t('authPages.signIn.title')}</h1>
            <p className="text-sm text-gray-600">{t('authPages.signIn.subtitle')}</p>
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

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  {t('authPages.common.passwordLabel')}
                </label>
                <Link to="/forgot-password" className="text-xs font-medium text-gray-500 hover:text-gray-900">
                  {t('authPages.signIn.forgotPassword')}
                </Link>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                minLength={8}
                value={password}
                onChange={event => setPassword(event.target.value)}
                placeholder={t('authPages.common.passwordPlaceholder')}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
              disabled={state === 'loading'}
            >
              {state === 'loading' ? t('authPages.common.loadingLabel') : t('authPages.signIn.submitLabel')}
            </button>
          </form>

          {message && (
            <p
              className={`text-sm text-center ${state === 'error' ? 'text-red-600' : 'text-emerald-600'}`}
            >
              {message}
            </p>
          )}

          <div className="flex items-center gap-4">
            <span className="flex-1 h-px bg-gray-200" />
            <span className="text-xs uppercase tracking-wider text-gray-400">{t('authPages.common.dividerLabel')}</span>
            <span className="flex-1 h-px bg-gray-200" />
          </div>

          <button
            type="button"
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Chrome className="h-5 w-5 text-gray-500" />
            {t('authPages.common.googleButton')}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          {t('authPages.signIn.secondaryPrompt')}{' '}
          <Link to="/signup" className="font-semibold text-gray-900 hover:underline">
            {t('authPages.signIn.secondaryAction')}
          </Link>
        </p>
      </div>
    </div>
  );
}
