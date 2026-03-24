import type { FC } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/images/logo.png';
import { authApi } from '../features/auth/services/authApi';
import { useAuthStore } from '../store/authStore';
import ErrorBanner from '../shared/components/ErrorBanner';
import { ApiError } from '../services/api/httpClient';
import { ROUTES } from '../shared/constants/routes';

type LoginFormData = {
  identifiant: string;
  motDePasse: string;
};

const LoginPage: FC = () => {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const session = await authApi.login(data.identifiant, data.motDePasse);
      setSession(session);

      if (session.role === 'ADMIN') {
        navigate(ROUTES.adminDashboard);
      } else if (session.role === 'AGENT') {
        navigate(ROUTES.agentDashboard);
      } else {
        navigate(ROUTES.client);
      }
    } catch (e) {
      if (e instanceof ApiError) setError(e.message);
      else setError("Connexion impossible. Verifie l'identifiant et le mot de passe.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <img src={Logo} alt="MA Santé Assurance" className="login-logo" />

        <div className="login-illustration-wrap">
          <img src="/login-bench.svg" alt="" aria-hidden="true" className="login-bench" />
          <img src="/login-illustration.svg" alt="Médecin et patient" className="login-people" />
        </div>

        <img src="/login-shadow.svg" alt="" aria-hidden="true" className="login-shadow" />
      </div>

      <div className="login-right">
        <div className="login-form-wrap">
          <button type="button" className="login-home-btn" onClick={() => navigate(ROUTES.home)}>
            <span aria-hidden="true">←</span> Retour a l'accueil
          </button>
          <h1 className="login-title">Se connecter</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="login-form" noValidate>
            <input
              {...register('identifiant')}
              type="text"
              placeholder="Email ou numero d'assurance"
              className="login-input"
              autoComplete="username"
            />

            <div className="password-wrap">
              <input
                {...register('motDePasse')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Entrez votre mot de passe"
                className="login-input"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {error && <ErrorBanner message={error} />}

            <button type="submit" className="login-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="register-footer">
            <span className="register-footer__text">Je n'ai pas de compte </span>
            <button type="button" className="register-footer__link" onClick={() => navigate(ROUTES.register)}>
              S'inscrire
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
