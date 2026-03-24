import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '../../../services/api/httpClient';
import { agentApi } from '../services/agentApi';
import type { AgentLiveLocation } from '../types/agent.types';

function buildWsUrl(): string {
  const explicit = import.meta.env.VITE_WS_URL;
  if (explicit) return explicit;

  try {
    const baseUrl = new URL(API_BASE_URL, window.location.origin);
    const wsProtocol = baseUrl.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${wsProtocol}//${baseUrl.host}/ws/agent-locations`;
  } catch {
    return 'ws://localhost:8080/ws/agent-locations';
  }
}

const WS_URL = buildWsUrl();

export function useAdminLiveAgents() {
  const [isConnected, setIsConnected] = useState(false);
  const [wsError, setWsError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['admin-live-agents'],
    queryFn: () => agentApi.getLiveLocations(),
  });

  useEffect(() => {
    let socket: WebSocket | null = null;

    socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      setIsConnected(true);
      setWsError(null);
    };

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as AgentLiveLocation[];
        if (Array.isArray(payload)) {
          queryClient.setQueryData(['admin-live-agents'], payload);
          setWsError(null);
        }
      } catch {
        setWsError('Payload WebSocket invalide');
      }
    };

    socket.onclose = () => {
      setIsConnected(false);
    };

    socket.onerror = () => {
      setWsError('Connexion WebSocket echouee');
    };

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [queryClient]);

  const agents = useMemo(
    () => [...(query.data ?? [])].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [query.data]
  );

  const errorMessage = wsError ?? (query.error instanceof Error ? query.error.message : null);

  return { agents, isConnected, error: errorMessage, isLoading: query.isLoading };
}
