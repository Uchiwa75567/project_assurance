export type ClientStatus = 'Active' | 'Inactif' | 'Suspendu';

export interface Client {
  id: string;
  numeroAssurance: string;
  prenom: string;
  nom: string;
  typeAssurance: string;
  statut: ClientStatus;
  avatar: string;
}
