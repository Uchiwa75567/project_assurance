import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../features/auth/services/authApi';
import ErrorBanner from '../shared/components/ErrorBanner';
import { ApiError } from '../services/api/httpClient';
import { ROUTES } from '../shared/constants/routes';

type RegisterFormData = {
  email: string;
  nomComplet: string;
  dateNaissance: string;
  numeroDeTelephone: string;
  numeroDIdentite: string;
  photo?: FileList;
  motDePasse: string;
};

const RegisterPage: FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit } = useForm<RegisterFormData>();

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const photoFile = data.photo?.[0];
      const photoUrl = photoFile ? (await authApi.uploadPhoto(photoFile)).imageUrl : null;

      await authApi.register({
        fullName: data.nomComplet,
        email: data.email || null,
        dateNaissance: data.dateNaissance || null,
        telephone: data.numeroDeTelephone || null,
        numeroCni: data.numeroDIdentite || null,
        photoUrl,
        password: data.motDePasse,
        role: 'CLIENT',
      });

      // Redirect to OTP verification with the email as state
      navigate(ROUTES.registerOtp, { state: { email: data.email } });
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
              placeholder="Adresse e-mail"
              className="login-input"
              autoComplete="email"
            />

            <input
              {...register('dateNaissance')}
              type="text"
              placeholder="Date de naissance"
              className="login-input"
              onFocus={(e) => (e.target.type = 'date')}
              onBlur={(e) => {
                if (!e.target.value) e.target.type = 'text';
              }}
              autoComplete="bday"
            />

            <input
              {...register('numeroDeTelephone')}
              type="tel"
              placeholder="numero de telephone"
              className="login-input"
              autoComplete="tel"
            />

            <input
              {...register('numeroDIdentite')}
              type="text"
              placeholder="Entrez votre numero d'identite"
              className="login-input"
              autoComplete="off"
            />

            <input
              {...register('photo')}
              type="file"
              accept="image/*"
              className="login-input"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (photoPreview) URL.revokeObjectURL(photoPreview);
                setPhotoPreview(file ? URL.createObjectURL(file) : null);
              }}
            />

            {photoPreview && (
              <img
                src={photoPreview}
                alt="Apercu de la photo"
                className="register-photo-preview"
              />
            )}

            <div className="password-wrap">
              <input
                {...register('motDePasse')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Entrez votre mot de passe"
                className="login-input"
                autoComplete="new-password"
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

            <button type="submit" className="login-submit">
              S'inscrire
            </button>
          </form>

          <p className="register-footer">
            <span className="register-footer__text">J'ai déjà un compte </span>
            <button type="button" className="register-footer__link" onClick={() => navigate(ROUTES.login)}>
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
