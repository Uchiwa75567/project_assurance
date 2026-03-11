import { httpClient } from '../../../services/api/httpClient';
import type { Partenaire } from '../types/partenaire.types';

export const partenaireApi = {
  list: () => httpClient.get<Partenaire[]>('/partenaires'),
};
