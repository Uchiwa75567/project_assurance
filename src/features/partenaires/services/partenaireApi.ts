import { httpClient } from '../../../services/api/httpClient';
import type { Partenaire, CreatePartenairePayload } from '../types/partenaire.types';

export const partenaireApi = {
  list: () => httpClient.get<Partenaire[]>('/partenaires'),
  create: (payload: CreatePartenairePayload) =>
    httpClient.post<Partenaire>('/partenaires', payload),
};
