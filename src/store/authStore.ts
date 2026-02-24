import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserRole = 'admin' | 'client' | null;

interface AuthState {
  role: UserRole;
  setRole: (role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: null,
      setRole: (role) => set({ role }),
      logout: () => set({ role: null }),
    }),
    { name: 'ma-sante-auth' }
  )
);
