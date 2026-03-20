import { httpClient } from '../../../services/api/httpClient';
import type { Carte } from '../types/carte.types';

export const carteApi = {
  getBySouscription: (souscriptionId: string) =>
    httpClient.get<Carte>(`/cartes/souscription/${encodeURIComponent(souscriptionId)}`),
};
