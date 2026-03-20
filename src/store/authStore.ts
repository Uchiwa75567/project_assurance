import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthSession } from '../features/auth/types/auth.types';
import { isExpired } from '../shared/utils/jwt';

type UserRole = 'admin' | 'client' | 'agent' | 'partenaire' | null;

interface AuthState {
  role: UserRole;
  accessTokenExpiresAt: number | null;
  refreshTokenExpiresAt: number | null;
  bootstrapped: boolean;
  userId: string | null;
  fullName: string | null;
  email: string | null;
  setSession: (session: AuthSession) => void;
  setBootstrapped: (value: boolean) => void;
  hasValidSession: () => boolean;
  logout: () => void;
}

const mapRole = (role: AuthSession['role']): UserRole => {
  if (role === 'ADMIN') return 'admin';
  if (role === 'AGENT') return 'agent';
  if (role === 'PARTENAIRE') return 'partenaire';
  return 'client';
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      role: null,
      accessTokenExpiresAt: null,
      refreshTokenExpiresAt: null,
      bootstrapped: false,
      userId: null,
      fullName: null,
      email: null,
      setSession: (session) =>
        set({
          role: mapRole(session.role),
          accessTokenExpiresAt: Date.now() + session.accessTokenExpiresIn * 1000,
          refreshTokenExpiresAt: Date.now() + session.refreshTokenExpiresIn * 1000,
          userId: session.userId,
          fullName: session.fullName,
          email: session.email,
        }),
      setBootstrapped: (value) => set({ bootstrapped: value }),
      hasValidSession: () => {
        const refreshTokenExpiresAt = get().refreshTokenExpiresAt;
        return !!get().role && !isExpired(refreshTokenExpiresAt);
      },
      logout: () =>
        set({
          role: null,
          accessTokenExpiresAt: null,
          refreshTokenExpiresAt: null,
          userId: null,
          fullName: null,
          email: null,
        }),
    }),
    { name: 'ma-sante-auth' }
  )
);
