export type CarteStatus = 'ACTIVATED' | 'EXPIRED' | string;

export interface Carte {
  id: string;
  souscriptionId: string;
  numeroCarte: string;
  dateEmission?: string | null;
  dateExpiration?: string | null;
  qrCode?: string | null;
  statut: CarteStatus;
}
