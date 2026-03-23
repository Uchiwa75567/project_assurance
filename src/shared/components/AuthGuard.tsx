import type { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import PageLoader from './PageLoader';
import { ROUTES } from '../constants/routes';

const AuthGuard: FC<{ children: ReactNode; allow: Array<'admin' | 'agent' | 'client' | 'partenaire'> }> = ({ children, allow }) => {
  const bootstrapped = useAuthStore((s) => s.bootstrapped);
  const role = useAuthStore((s) => s.role);
  const hasValidSession = useAuthStore((s) => s.hasValidSession);

  if (!bootstrapped) {
    return <PageLoader />;
  }

  if (!hasValidSession()) {
    return <Navigate to={ROUTES.login} replace />;
  }

  if (!role || !allow.includes(role)) {
    return <Navigate to={ROUTES.login} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
