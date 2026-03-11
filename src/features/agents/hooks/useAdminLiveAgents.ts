import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { agentApi } from '../services/agentApi';
import type { AgentLiveLocation } from '../types/agent.types';

const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8080/ws/agent-locations';

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
