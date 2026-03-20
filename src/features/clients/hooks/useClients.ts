import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientsApi, type ClientsFilter, type CreateClientRequest } from '../api/clients';

export const CLIENTS_QUERY_KEY = ['clients'];

export function useClients(filter: ClientsFilter = {}) {
  return useQuery({
    queryKey: [...CLIENTS_QUERY_KEY, filter],
    queryFn: () => clientsApi.list(filter),
  });
}

export function useClient(clientId: string) {
  return useQuery({
    queryKey: ['client', clientId],
    queryFn: () => clientsApi.getById(clientId),
    enabled: !!clientId,
  });
}

export function useClientMe() {
  return useQuery({
    queryKey: ['client', 'me'],
    queryFn: () => clientsApi.getMe(),
    retry: false,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClientRequest) => clientsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateClientRequest> }) =>
      clientsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['client', id] });
    },
  });
}
