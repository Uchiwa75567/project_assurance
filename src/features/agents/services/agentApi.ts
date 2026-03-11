import { httpClient } from '../../../services/api/httpClient';
import type { AgentLiveLocation, AgentSummary } from '../types/agent.types';

export const agentApi = {
  getAgents: () => httpClient.get<AgentSummary[]>('/agents'),
  createOrUpdateAgent: (payload: {
    id: string;
    matricule: string;
    prenom: string;
    nom: string;
    telephone: string;
    statut: string;
  }) => httpClient.post<AgentSummary>('/agents', payload),
  getLiveLocations: () => httpClient.get<AgentLiveLocation[]>('/agents/live-locations'),
  updateLocation: (agentId: string, payload: { latitude: number; longitude: number; speedKmh: number }) =>
    httpClient.post<AgentLiveLocation>(`/agents/${agentId}/location`, payload),
};
