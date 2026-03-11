import type { FC } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../features/auth/services/authApi';
import ErrorBanner from '../shared/components/ErrorBanner';
import { ApiError } from '../services/api/httpClient';

type RegisterFormData = {
  nomComplet: string;
  email: string;
  dateNaissance: string;
  numeroAssurance: string;
  numeroDeTelephone: string;
  numeroDIdentite: string;
  motDePasse: string;
};

const RegisterPage: FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await authApi.register({
        fullName: data.nomComplet,
        email: data.email,
        password: data.motDePasse,
        role: 'CLIENT',
      });
      navigate('/connexion');
    } catch (e) {
      if (e instanceof ApiError) setError(e.message);
      else setError('Inscription impossible. Verifie que le backend est lance.');
    }
  };

  return (
    <div className="login-page register-page">
      <div className="register-left">
        <img src="/register-illustration.svg" alt="Ma Santé Assurance" className="register-illustration" />
      </div>

      <div className="login-right">
        <div className="login-form-wrap">
          <h1 className="login-title">S'inscrire</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="login-form" noValidate>
            <input
              {...register('nomComplet')}
              type="text"
              placeholder="Entrez votre nom complet"
              className="login-input"
              autoComplete="name"
            />

            <input
              {...register('email')}
              type="email"
              placeholder="Entrez votre email"
              className="login-input"
              autoComplete="email"
            />

            <input
              {...register('dateNaissance')}
              type="text"
              placeholder="Date de naissances"
              className="login-input"
              onFocus={(e) => (e.target.type = 'date')}
              onBlur={(e) => {
                if (!e.target.value) e.target.type = 'text';
              }}
              autoComplete="bday"
            />

            <input
              {...register('numeroAssurance')}
              type="text"
              placeholder="Entrez votre numero d'assurance"
              className="login-input"
              autoComplete="off"
            />

            <input
              {...register('numeroDeTelephone')}
              type="tel"
              placeholder="numéro de téléphone"
              className="login-input"
              autoComplete="tel"
            />

            <input
              {...register('numeroDIdentite')}
              type="text"
              placeholder="Entrez votre numero d'identité"
              className="login-input"
              autoComplete="off"
            />

            <input
              {...register('motDePasse')}
              type="password"
              placeholder="Entrez votre mot de passe"
              className="login-input"
              autoComplete="new-password"
            />

            {error && <ErrorBanner message={error} />}

            <button type="submit" className="login-submit">
              S'inscrire
            </button>
          </form>

          <p className="register-footer">
            <span className="register-footer__text">J'ai déjà un compte </span>
            <button type="button" className="register-footer__link" onClick={() => navigate('/connexion')}>
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
