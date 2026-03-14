export type BackendUserRole = 'ADMIN' | 'AGENT' | 'CLIENT';

export interface AuthSession {
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
  userId: string;
  fullName: string;
  email: string | null;
  role: BackendUserRole;
}
