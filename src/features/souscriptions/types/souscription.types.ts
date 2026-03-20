export type SouscriptionStatus = 'ACTIVE' | 'EXPIREE' | 'SUSPENDUE' | string;

export interface Souscription {
  id: string;
  clientId: string;
  agentId?: string | null;
  packId: string;
  dateDebut: string;
  dateFin?: string | null;
  dateProchainPaiement?: string | null;
  statut: SouscriptionStatus;
  createdAt: string;
}
