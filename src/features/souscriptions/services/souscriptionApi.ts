import { httpClient } from '../../../services/api/httpClient';
import type { Souscription } from '../types/souscription.types';

export const souscriptionApi = {
  list: () => httpClient.get<Souscription[]>('/souscriptions'),
};
