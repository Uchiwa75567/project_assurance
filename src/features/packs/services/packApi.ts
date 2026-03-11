import { httpClient } from '../../../services/api/httpClient';
import type { Pack } from '../types/pack.types';

export const packApi = {
  list: () => httpClient.get<Pack[]>('/packs'),
};
