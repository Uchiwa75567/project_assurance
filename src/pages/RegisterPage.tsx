import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../features/auth/services/authApi';
import ErrorBanner from '../shared/components/ErrorBanner';
import { ApiError } from '../services/api/httpClient';
import { ROUTES } from '../shared/constants/routes';
import { formatFriendlyApiError } from '../shared/utils/apiErrorMessages';

type RegisterFormData = {
  email: string;
  nomComplet: string;
  dateNaissance: string;
  numeroDeTelephone: string;
  numeroDIdentite: string;
  photo?: FileList;
  motDePasse: string;
};

type RegisterBanner = {
  message: string;
  tone: 'danger' | 'warning' | 'neutral';
  retryable: boolean;
};

const formatBirthDateDisplay = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);

  const parts = [day, month, year].filter(Boolean);
  return parts.join('/');
};

const birthDateDisplayToIso = (value: string) => {
  const [day, month, year] = value.split('/');
  if (!day || !month || !year || year.length !== 4) {
    return '';
  }

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

const isFutureBirthDate = (isoDate: string) => {
  if (!isoDate) {
    return true;
  }

  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return true;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parsed > today;
};

const RegisterPage: FC = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<RegisterBanner | null>(null);
  const [lastAttempt, setLastAttempt] = useState<RegisterFormData | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [birthDateDisplay, setBirthDateDisplay] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({ mode: 'onTouched' });

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const applyServerFieldErrors = (message: string) => {
    const normalized = message.toLowerCase();

    const fieldRules: Array<[keyof RegisterFormData, string, string[]]> = [
      ['email', 'Cette adresse e-mail est déjà utilisée.', ['email deja utilise', 'email déjà utilisée', 'email requis']],
      ['numeroDeTelephone', 'Le numéro de téléphone est invalide.', ['numero de telephone invalide', 'numéro de telephone invalide', 'telephone invalide']],
      ['motDePasse', 'Le mot de passe est invalide ou manquant.', ['mot de passe requis', 'mot de passe invalide']],
      ['numeroDIdentite', 'Le numéro d identite est requis ou invalide.', ['numero d identite', 'numéro d identite', 'cni']],
      ['dateNaissance', 'La date de naissance est requise.', ['date de naissance', 'date requise']],
      ['photo', 'La photo fournie est invalide.', ['photo', 'image']],
    ];

    for (const [field, fieldMessage, keywords] of fieldRules) {
      if (keywords.some((keyword) => normalized.includes(keyword))) {
        setError(field, { type: 'server', message: fieldMessage });
        return true;
      }
    }

    return false;
  };

  const submitRegister = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    clearErrors();

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

      navigate(ROUTES.registerOtp, { state: { email: data.email } });
    } catch (e) {
      if (e instanceof ApiError) {
        const handled = applyServerFieldErrors(e.message);
        if (!handled) {
          setServerError(formatFriendlyApiError(e));
        }
      } else {
        setServerError(formatFriendlyApiError(e));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    setLastAttempt(data);
    await submitRegister(data);
  };

  const handleBirthDateChange = (value: string) => {
    const formatted = formatBirthDateDisplay(value);
    setBirthDateDisplay(formatted);
    const iso = birthDateDisplayToIso(formatted);
    setValue('dateNaissance', iso, { shouldDirty: true, shouldValidate: true });

    if (!formatted) {
      clearErrors('dateNaissance');
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

          {serverError && (
            <ErrorBanner
              message={serverError.message}
              tone={serverError.tone}
              actionLabel={serverError.retryable && lastAttempt ? 'Réessayer' : undefined}
              onAction={serverError.retryable && lastAttempt ? () => void submitRegister(lastAttempt) : undefined}
            />
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="login-form" noValidate>
            <div className="register-form-grid">
              <div className="register-form-col">
                <div>
                  <input
                    {...register('nomComplet', {
                      required: 'Le nom complet est obligatoire.',
                      minLength: { value: 2, message: 'Le nom complet est trop court.' },
                    })}
                    type="text"
                    placeholder="Entrez votre nom complet"
                    className={`login-input ${errors.nomComplet ? 'login-input--error' : ''}`}
                    autoComplete="name"
                  />
                  {errors.nomComplet && <p className="form-field-error">{errors.nomComplet.message}</p>}
                </div>

                <div>
                  <input
                    {...register('email', {
                      required: 'L’adresse e-mail est obligatoire.',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'L’adresse e-mail n’est pas valide.',
                      },
                    })}
                    type="email"
                    placeholder="Adresse e-mail"
                    className={`login-input ${errors.email ? 'login-input--error' : ''}`}
                    autoComplete="email"
                  />
                  {errors.email && <p className="form-field-error">{errors.email.message}</p>}
                </div>

                <div>
                  <input
                    type="hidden"
                    {...register('dateNaissance', {
                      required: 'La date de naissance est obligatoire.',
                      validate: (value) => !isFutureBirthDate(value) || 'La date de naissance ne peut pas être future.',
                    })}
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="jj/mm/aaaa"
                    value={birthDateDisplay}
                    onChange={(e) => handleBirthDateChange(e.target.value)}
                    onBlur={() => {
                      const iso = birthDateDisplayToIso(birthDateDisplay);
                      if (!iso) {
                        setError('dateNaissance', {
                          type: 'validate',
                          message: 'Utilise le format jj/mm/aaaa.',
                        });
                        return;
                      }

                      if (isFutureBirthDate(iso)) {
                        setError('dateNaissance', {
                          type: 'validate',
                          message: 'La date de naissance ne peut pas être future.',
                        });
                        return;
                      }

                      clearErrors('dateNaissance');
                    }}
                    className={`login-input ${errors.dateNaissance ? 'login-input--error' : ''}`}
                    autoComplete="bday"
                  />
                  {errors.dateNaissance && <p className="form-field-error">{errors.dateNaissance.message}</p>}
                </div>

                <div>
                  <input
                    {...register('numeroDeTelephone', {
                      required: 'Le numéro de téléphone est obligatoire.',
                      minLength: { value: 8, message: 'Le numéro de téléphone est trop court.' },
                    })}
                    type="tel"
                    placeholder="numero de telephone"
                    className={`login-input ${errors.numeroDeTelephone ? 'login-input--error' : ''}`}
                    autoComplete="tel"
                  />
                  {errors.numeroDeTelephone && <p className="form-field-error">{errors.numeroDeTelephone.message}</p>}
                </div>
              </div>

              <div className="register-form-col">
                <div>
                  <input
                    {...register('numeroDIdentite', {
                      required: "Le numéro d'identité est obligatoire.",
                    })}
                    type="text"
                    placeholder="Entrez votre numero d'identite"
                    className={`login-input ${errors.numeroDIdentite ? 'login-input--error' : ''}`}
                    autoComplete="off"
                  />
                  {errors.numeroDIdentite && <p className="form-field-error">{errors.numeroDIdentite.message}</p>}
                </div>

                <div className="password-wrap">
                  <input
                    {...register('motDePasse', {
                      required: 'Le mot de passe est obligatoire.',
                      minLength: { value: 8, message: 'Le mot de passe doit contenir au moins 8 caractères.' },
                    })}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Entrez votre mot de passe"
                    className={`login-input ${errors.motDePasse ? 'login-input--error' : ''}`}
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
                {errors.motDePasse && <p className="form-field-error">{errors.motDePasse.message}</p>}

                <div className="register-photo-block">
                  <label className="register-photo-label" htmlFor="register-photo-input">
                    Photo
                  </label>
                  <input
                    {...register('photo')}
                    id="register-photo-input"
                    type="file"
                    accept="image/*"
                    className={`login-input register-photo-input ${errors.photo ? 'login-input--error' : ''}`}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (photoPreview) URL.revokeObjectURL(photoPreview);
                      setPhotoPreview(file ? URL.createObjectURL(file) : null);
                    }}
                  />
                  {errors.photo && <p className="form-field-error">{errors.photo.message}</p>}

                  <div className="register-photo-preview-box">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Apercu de la photo" className="register-photo-preview" />
                    ) : (
                      <p className="register-photo-preview-empty">Aucune image sélectionnée</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="login-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Inscription...' : "S'inscrire"}
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
