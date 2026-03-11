import { useEffect } from 'react';
import { authApi } from '../../features/auth/services/authApi';
import { useAuthStore } from '../../store/authStore';

const AuthBootstrap = () => {
  const role = useAuthStore((s) => s.role);
  const setSession = useAuthStore((s) => s.setSession);
  const setBootstrapped = useAuthStore((s) => s.setBootstrapped);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const current = await authApi.me();
        setSession(current);
      } catch {
        if (!role) {
          setBootstrapped(true);
          return;
        }
        try {
          const refreshed = await authApi.refresh();
          setSession(refreshed);
        } catch {
          logout();
        }
      } finally {
        setBootstrapped(true);
      }
    };

    void bootstrap();
  }, [role, setSession, setBootstrapped, logout]);

  return null;
};

export default AuthBootstrap;
