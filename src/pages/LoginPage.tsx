import type { FC } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/images/logo.png';
import { authApi } from '../features/auth/services/authApi';
import { useAuthStore } from '../store/authStore';
import ErrorBanner from '../shared/components/ErrorBanner';
import { ApiError } from '../services/api/httpClient';

type LoginFormData = {
  email: string;
  motDePasse: string;
};

const LoginPage: FC = () => {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const session = await authApi.login(data.email, data.motDePasse);
      setSession(session);

      if (session.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (session.role === 'AGENT') {
        navigate('/agent/dashboard');
      } else {
        navigate('/client');
      }
    } catch (e) {
      if (e instanceof ApiError) setError(e.message);
      else setError('Connexion impossible. Verifie email/mot de passe et serveur backend.');
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
          <button type="button" className="login-home-btn" onClick={() => navigate('/')}>
            <span aria-hidden="true">←</span> Retour a l'accueil
          </button>
          <h1 className="login-title">Se connecter</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="login-form" noValidate>
            <input
              {...register('email')}
              type="email"
              placeholder="Entrez votre email"
              className="login-input"
              autoComplete="email"
            />

            <input
              {...register('motDePasse')}
              type="password"
              placeholder="Entrez votre mot de passe"
              className="login-input"
              autoComplete="current-password"
            />

            {error && <ErrorBanner message={error} />}

            <button type="submit" className="login-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="register-footer">
            <span className="register-footer__text">Je n'ai pas de compte </span>
            <button type="button" className="register-footer__link" onClick={() => navigate('/inscription')}>
              S'inscrire
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
