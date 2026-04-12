import { httpClient } from '../../../services/api/httpClient';
import type { AuthSession } from '../types/auth.types';

export const authApi = {
  csrf: () => httpClient.get<{ token: string }>('/auth/csrf'),
  uploadPhoto: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return httpClient.post<{ imageUrl: string; publicId: string | null }>('/uploads/photo', formData);
  },
  login: (identifier: string, password: string) =>
    httpClient.post<AuthSession>('/auth/login', { identifier, password }),
  register: (payload: {
    fullName: string;
    email?: string | null;
    dateNaissance?: string | null;
    telephone?: string | null;
    numeroCni?: string | null;
    photoUrl?: string | null;
    typeAssurance?: string | null;
    password: string;
    role: 'CLIENT' | 'AGENT' | 'ADMIN';
  }) =>
    httpClient.post<AuthSession>('/auth/register', payload),
  me: () => httpClient.get<AuthSession>('/auth/me'),
  refresh: () => httpClient.post<AuthSession>('/auth/refresh', {}),
  logout: () => httpClient.post<void>('/auth/logout', {}),
  verifyOtp: (email: string, code: string) =>
    httpClient.post<void>('/auth/verify-otp', { email, code }),
  resendOtp: (email: string) =>
    httpClient.post<void>('/auth/resend-otp', { email }),
};
