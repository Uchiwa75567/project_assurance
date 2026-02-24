import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/images/logo.png';
import { useAuthStore } from '../store/authStore';

type LoginFormData = {
  numeroAssurance: string;
  motDePasse: string;
  role: 'admin' | 'client';
};

const LoginPage: FC = () => {
  const navigate = useNavigate();
  const setRole = useAuthStore((s) => s.setRole);
  const { register, handleSubmit } = useForm<LoginFormData>({
    defaultValues: { role: 'client' },
  });

  const onSubmit = (data: LoginFormData) => {
    setRole(data.role);
    if (data.role === 'admin') {
      navigate('/admin/gestion-clients');
    } else {
      // TODO: redirect client to their space
      navigate('/');
    }
  };

  return (
    <div className="login-page">
      {/* ── Left panel ── */}
      <div className="login-left">
        <img src={Logo} alt="MA Santé Assurance" className="login-logo" />

        <div className="login-illustration-wrap">
          <img
            src="/login-bench.svg"
            alt=""
            aria-hidden="true"
            className="login-bench"
          />
          <img
            src="/login-illustration.svg"
            alt="Médecin et patient"
            className="login-people"
          />
        </div>

        <img
          src="/login-shadow.svg"
          alt=""
          aria-hidden="true"
          className="login-shadow"
        />
      </div>

      {/* ── Right panel ── */}
      <div className="login-right">
        <div className="login-form-wrap">
          <h1 className="login-title">Se connecter</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="login-form" noValidate>
            {/* Role selector */}
            <div className="login-role-wrap">
              <label className="login-role-label">Vous êtes :</label>
              <select
                {...register('role')}
                className="login-select"
              >
                <option value="client">Client</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>

            <input
              {...register('numeroAssurance')}
              type="text"
              placeholder="Entrez votre numero d'assurance"
              className="login-input"
              autoComplete="username"
            />

            <input
              {...register('motDePasse')}
              type="password"
              placeholder="Entrez votre mot de passe"
              className="login-input"
              autoComplete="current-password"
            />

            <button type="submit" className="login-submit">
              Se connecter
            </button>
          </form>

          <p className="login-back">
            <button type="button" className="login-back-btn" onClick={() => navigate('/')}>
              ← Retour à l'accueil
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
