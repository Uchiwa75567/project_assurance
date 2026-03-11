export type ClientStatus = 'Active' | 'Inactif' | 'Suspendu';
export type AgentStatus = 'Active' | 'Inactif' | 'Suspendu';

export interface Client {
  id: string;
  numeroAssurance: string;
  prenom: string;
  nom: string;
  typeAssurance: string;
  statut: ClientStatus;
  avatar: string;
}

export interface Agent {
  id: string;
  matricule: string;
  prenom: string;
  nom: string;
  telephone: string;
  statut: AgentStatus;
  avatar: string;
}
