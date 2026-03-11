export type AgentStatus = 'Active' | 'Inactif' | 'Suspendu' | string;

export interface AgentSummary {
  id: string;
  matricule: string;
  prenom: string;
  nom: string;
  telephone: string;
  statut: AgentStatus;
}

export interface AgentLiveLocation {
  agentId: string;
  matricule: string;
  prenom: string;
  nom: string;
  telephone: string;
  statut: AgentStatus;
  latitude: number;
  longitude: number;
  speedKmh: number;
  moving: boolean;
  updatedAt: string;
}
