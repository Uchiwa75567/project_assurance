import { useEffect, useState } from 'react';
import { clientApi } from '../services/clientApi';
import type { Client } from '../types/client.types';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    void clientApi
      .getClients()
      .then((result) => setClients(result.content))
      .catch(() => setClients([]));
  }, []);

  return { clients };
}
