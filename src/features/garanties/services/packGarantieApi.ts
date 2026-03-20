import { httpClient } from '../../../services/api/httpClient';
import type { PackGarantie } from '../types/packGarantie.types';

export const packGarantieApi = {
  listByPack: (packId: string) =>
    httpClient.get<PackGarantie[]>(`/pack-garanties?packId=${encodeURIComponent(packId)}`),
};
