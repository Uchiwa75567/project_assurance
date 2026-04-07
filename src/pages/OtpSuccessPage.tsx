import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/images/logo.png';
import { ROUTES } from '../shared/constants/routes';

const OtpSuccessPage: FC = () => {
  const navigate = useNavigate();

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
        <div className="otp-success-wrap">
          <div className="otp-success-icon-wrap" aria-hidden="true">
            <img
              src="/otp-success-check.svg"
              alt=""
              className="otp-success-icon"
            />
          </div>

          <p className="otp-success-text">Code vérifié avec succès !</p>
          <p className="otp-success-subtext">Votre code OTP a été vérifié avec succès.</p>

          <button
            type="button"
            className="login-submit otp-continuer-btn"
            onClick={() => navigate(ROUTES.client)}
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpSuccessPage;
