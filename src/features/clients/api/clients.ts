import { httpClient } from '../../../services/api/httpClient';

export interface Client {
  id: string;
  userId: string;
  numeroAssurance: string;
  prenom: string;
  nom: string;
  dateNaissance: string | null;
  telephone: string;
  adresse: string;
  numeroCni: string;
  photoUrl: string | null;
  typeAssurance: string;
  statut: 'ACTIVE' | 'INACTIVE' | 'SUSPENDU';
  createdByAgentId: string | null;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface ClientsFilter {
  search?: string;
  statut?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDU';
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'asc' | 'desc';
}

export interface CreateClientRequest {
  userId: string;
  prenom: string;
  nom: string;
  dateNaissance: string | null;
  telephone: string;
  adresse: string;
  numeroCni: string;
  photoUrl: string | null;
  typeAssurance: string;
  statut: 'ACTIVE' | 'INACTIVE' | 'SUSPENDU';
  createdByAgentId: string;
}

export const clientsApi = {
  list: async (filter: ClientsFilter = {}): Promise<PageResponse<Client>> => {
    const params = new URLSearchParams();
    if (filter.search) params.append('search', filter.search);
    if (filter.statut) params.append('statut', filter.statut);
    params.append('page', String(filter.page ?? 0));
    params.append('size', String(filter.size ?? 20));
    params.append('sortBy', filter.sortBy ?? 'createdAt');
    params.append('direction', filter.direction ?? 'desc');

    const response = await httpClient.get<PageResponse<Client>>(`/clients?${params.toString()}`);
    return response;
  },

  getById: async (id: string): Promise<Client> => {
    const response = await httpClient.get<Client>(`/clients/${id}`);
    return response;
  },

  getMe: async (): Promise<Client> => {
    const response = await httpClient.get<Client>('/clients/me');
    return response;
  },

  create: async (data: CreateClientRequest): Promise<Client> => {
    const response = await httpClient.post<Client>('/clients', data);
    return response;
  },

  update: async (id: string, data: Partial<CreateClientRequest>): Promise<Client> => {
    const response = await httpClient.patch<Client>(`/clients/${id}`, data);
    return response;
  },
};
