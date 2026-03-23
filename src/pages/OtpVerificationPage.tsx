import type { FC } from 'react';
import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '../assets/images/logo.png';
import { authApi } from '../features/auth/services/authApi';
import { ApiError } from '../services/api/httpClient';
import ErrorBanner from '../shared/components/ErrorBanner';
import { ROUTES } from '../shared/constants/routes';

const OtpVerificationPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email ?? '';

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!text) return;
    const newDigits = Array(6).fill('');
    for (let i = 0; i < 6; i++) newDigits[i] = text[i] ?? '';
    setDigits(newDigits);
    const lastFilled = Math.min(text.length - 1, 5);
    inputRefs.current[lastFilled]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < 6) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await authApi.verifyOtp(email, code);
      navigate(ROUTES.registerOtpSuccess);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Code invalide ou expiré. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    setResendSuccess(false);
    setError(null);
    try {
      await authApi.resendOtp(email);
      setResendSuccess(true);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Impossible de renvoyer le code. Réessayez plus tard.');
    } finally {
      setIsResending(false);
    }
  };

  const codeComplete = digits.join('').length === 6;

  return (
    <div className="login-page">
      {/* Left panel – same structure as LoginPage */}
      <div className="login-left">
        <img src={Logo} alt="MA Santé Assurance" className="login-logo" />
        <div className="login-illustration-wrap">
          <img src="/login-bench.svg" alt="" aria-hidden="true" className="login-bench" />
          <img src="/login-illustration.svg" alt="Médecin et patient" className="login-people" />
        </div>
        <img src="/login-shadow.svg" alt="" aria-hidden="true" className="login-shadow" />
      </div>

      {/* Right panel */}
      <div className="login-right">
        <div className="login-form-wrap otp-form-wrap">
          <h1 className="login-title otp-title">Entrez votre code OTP</h1>

          <p className="otp-subtitle">
            Nous avons envoyé un code OTP à 6 chiffres à votre adresse e-mail et à votre numéro de téléphone :{' '}
            <strong>{email || 'votre adresse e-mail'}</strong>
          </p>

          <p className="otp-label">Veuillez saisir le code ci-dessous :</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="otp-inputs" onPaste={handlePaste}>
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  className={`otp-input-box${digit ? ' otp-input-box--filled' : ''}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  aria-label={`Chiffre ${i + 1} du code OTP`}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            {error && <ErrorBanner message={error} />}

            {resendSuccess && (
              <p className="otp-resend-success" role="status">
                Code renvoyé avec succès !
              </p>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={isSubmitting || !codeComplete}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? 'Vérification…' : 'Vérifier'}
            </button>
          </form>

          <p className="otp-resend">
            Vous n&apos;avez pas reçu le code ?{' '}
            <button
              type="button"
              className="otp-resend__link"
              onClick={handleResend}
              disabled={isResending || !email}
              aria-busy={isResending}
            >
              {isResending ? 'Renvoi…' : 'Renvoyer le code OTP.'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationPage;
