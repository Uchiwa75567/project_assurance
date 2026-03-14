export interface Client {
  id: string;
  userId?: string | null;
  numeroAssurance: string;
  prenom: string;
  nom: string;
  dateNaissance?: string | null;
  telephone?: string;
  adresse?: string | null;
  numeroCni?: string | null;
  photoUrl?: string | null;
  typeAssurance?: string | null;
  statut: 'Active' | 'Inactif' | 'Suspendu' | string;
  createdByAgentId?: string | null;
  createdAt?: string;
}

export interface ClientsPageResult {
  content: Client[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
