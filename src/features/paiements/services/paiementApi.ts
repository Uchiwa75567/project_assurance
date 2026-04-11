import { httpClient } from '../../../services/api/httpClient';

export interface PaydunyaInitRequest {
  clientId: string;
  packId: string;
}

export interface PaydunyaInitResponse {
  paymentUrl: string;
  transactionId: string;
  souscriptionId: string;
}

export const paiementApi = {
  initierPaydunya: (payload: PaydunyaInitRequest) =>
    httpClient.post<PaydunyaInitResponse>('/paiements/initier', payload),
};
