import { httpClient } from '../../../services/api/httpClient';
import type { Partenaire, CreatePartenairePayload } from '../types/partenaire.types';

export const partenaireApi = {
  list: (params?: { lat?: number; lon?: number }) => {
    const query = new URLSearchParams();

    if (params?.lat !== undefined) {
      query.set('lat', String(params.lat));
    }

    if (params?.lon !== undefined) {
      query.set('lon', String(params.lon));
    }

    const suffix = query.toString();
    return httpClient.get<Partenaire[]>(suffix ? `/partenaires?${suffix}` : '/partenaires');
  },
  create: (payload: CreatePartenairePayload) =>
    httpClient.post<Partenaire>('/partenaires', payload),
};
