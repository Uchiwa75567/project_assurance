export type BackendUserRole = 'ADMIN' | 'AGENT' | 'CLIENT' | 'PARTENAIRE';

export interface AuthSession {
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
  userId: string;
  fullName: string;
  email: string | null;
  role: BackendUserRole;
}
