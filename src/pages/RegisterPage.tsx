import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../features/auth/services/authApi';
import ErrorBanner from '../shared/components/ErrorBanner';
import { ApiError } from '../services/api/httpClient';
import { ROUTES } from '../shared/constants/routes';

type RegisterFormData = {
  nomComplet: string;
  dateNaissance: string;
  numeroDeTelephone: string;
  numeroDIdentite: string;
  photo?: FileList;
  motDePasse: string;
};

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Impossible de lire la photo'));
    reader.readAsDataURL(file);
  });

const RegisterPage: FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<RegisterFormData>();

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const photoFile = data.photo?.[0];
      const photoUrl = photoFile ? await readFileAsDataUrl(photoFile) : null;

      await authApi.register({
        fullName: data.nomComplet,
        dateNaissance: data.dateNaissance || null,
        telephone: data.numeroDeTelephone || null,
        numeroCni: data.numeroDIdentite || null,
        photoUrl,
        password: data.motDePasse,
        role: 'CLIENT',
      });
      navigate(ROUTES.login);
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
