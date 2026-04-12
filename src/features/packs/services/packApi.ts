import { httpClient } from '../../../services/api/httpClient';
import type { Pack } from '../types/pack.types';

export type PackUpdateRequest = Partial<Pick<Pack, 'code' | 'nom' | 'description' | 'prix' | 'duree' | 'actif'>>;

export const packApi = {
  list: () => httpClient.get<Pack[]>('/packs'),
  update: (id: string, payload: PackUpdateRequest) => httpClient.patch<Pack>(`/packs/${id}`, payload),
};
