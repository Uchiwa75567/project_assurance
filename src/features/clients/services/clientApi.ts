import { httpClient } from '../../../services/api/httpClient';
import type { Client, ClientsPageResult } from '../types/client.types';

export const clientApi = {
  getClients: (params?: { search?: string; statut?: string; page?: number; size?: number }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.statut) query.set('statut', params.statut);
    query.set('page', String(params?.page ?? 0));
    query.set('size', String(params?.size ?? 20));

    return httpClient.get<ClientsPageResult>(`/clients?${query.toString()}`);
  },
  getMe: () => httpClient.get<Client>('/clients/me'),
  createClient: (payload: {
    userId?: string | null;
    prenom: string;
    nom: string;
    dateNaissance?: string | null;
    telephone: string;
    adresse?: string | null;
    numeroCni?: string | null;
    photoUrl?: string | null;
    typeAssurance?: string | null;
    statut?: 'ACTIVE' | 'INACTIF' | 'SUSPENDU';
    createdByAgentId?: string | null;
  }) => httpClient.post<Client>('/clients', payload),
};
