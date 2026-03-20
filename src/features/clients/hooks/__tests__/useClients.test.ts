import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import type { Mocked } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useClient, useClientMe, useClients, useCreateClient } from '../useClients';
import * as clientsApi from '../../api/clients';

vi.mock('../../api/clients');

const mockClientsApi = clientsApi as Mocked<typeof clientsApi>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useClients', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch clients list', async () => {
    const mockResponse = {
      content: [
        {
          id: '1',
          userId: 'user-1',
          numeroAssurance: 'MSA-001',
          prenom: 'John',
          nom: 'Doe',
          dateNaissance: null,
          telephone: '+221771234567',
          adresse: 'Dakar',
          numeroCni: '1234567890',
          photoUrl: null,
          typeAssurance: 'Standard',
          statut: 'ACTIVE' as const,
          createdByAgentId: 'agent-1',
          createdAt: '2026-01-01T00:00:00Z',
        },
      ],
      page: 0,
      size: 20,
      totalElements: 1,
      totalPages: 1,
      first: true,
      last: true,
    };

    vi.mocked(mockClientsApi.clientsApi.list).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useClients(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockResponse);
    expect(mockClientsApi.clientsApi.list).toHaveBeenCalledWith({});
  });

  it('should fetch clients with filter', async () => {
    const mockResponse = {
      content: [],
      page: 0,
      size: 20,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true,
    };

    vi.mocked(mockClientsApi.clientsApi.list).mockResolvedValue(mockResponse);

    const { result } = renderHook(
      () => useClients({ search: 'John', statut: 'ACTIVE' }),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockClientsApi.clientsApi.list).toHaveBeenCalledWith({
      search: 'John',
      statut: 'ACTIVE',
    });
  });
});

describe('useClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch client by id', async () => {
    const mockClient = {
      id: '1',
      userId: 'user-1',
      numeroAssurance: 'MSA-001',
      prenom: 'John',
      nom: 'Doe',
      dateNaissance: null,
      telephone: '+221771234567',
      adresse: 'Dakar',
      numeroCni: '1234567890',
      photoUrl: null,
      typeAssurance: 'Standard',
      statut: 'ACTIVE' as const,
      createdByAgentId: 'agent-1',
      createdAt: '2026-01-01T00:00:00Z',
    };

    vi.mocked(mockClientsApi.clientsApi.getById).mockResolvedValue(mockClient);

    const { result } = renderHook(() => useClient('1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockClient);
    expect(mockClientsApi.clientsApi.getById).toHaveBeenCalledWith('1');
  });

  it('should not fetch if clientId is empty', async () => {
    const { result } = renderHook(() => useClient(''), {
      wrapper: createWrapper(),
    });

    expect(result.current.isFetching).toBe(false);
    expect(mockClientsApi.clientsApi.getById).not.toHaveBeenCalled();
  });
});

describe('useClientMe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch current client', async () => {
    const mockClient = {
      id: '1',
      userId: 'user-1',
      numeroAssurance: 'MSA-001',
      prenom: 'John',
      nom: 'Doe',
      dateNaissance: null,
      telephone: '+221771234567',
      adresse: 'Dakar',
      numeroCni: '1234567890',
      photoUrl: null,
      typeAssurance: 'Standard',
      statut: 'ACTIVE' as const,
      createdByAgentId: 'agent-1',
      createdAt: '2026-01-01T00:00:00Z',
    };

    vi.mocked(mockClientsApi.clientsApi.getMe).mockResolvedValue(mockClient);

    const { result } = renderHook(() => useClientMe(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockClient);
  });
});

describe('useCreateClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create client and invalidate list', async () => {
    const newClient = {
      userId: 'user-new',
      prenom: 'Jane',
      nom: 'Doe',
      dateNaissance: null,
      telephone: '+221779999999',
      adresse: 'Dakar',
      numeroCni: '0987654321',
      photoUrl: null,
      typeAssurance: 'Premium',
      statut: 'ACTIVE' as const,
      createdByAgentId: 'agent-1',
    };

    const mockResponse = {
      id: '2',
      ...newClient,
      numeroAssurance: 'MSA-002',
      createdAt: '2026-01-02T00:00:00Z',
    };

    vi.mocked(mockClientsApi.clientsApi.create).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCreateClient(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(newClient);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockClientsApi.clientsApi.create).toHaveBeenCalledWith(newClient);
  });
});
