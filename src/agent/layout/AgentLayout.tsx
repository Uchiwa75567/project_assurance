import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import AgentSidebar from '../components/AgentSidebar';
import { useAuthStore } from '../../store/authStore';
import { usePublishAgentLocation } from '../../features/agents/hooks/usePublishAgentLocation';
import ErrorBanner from '../../shared/components/ErrorBanner';

const AgentLayout: FC = () => {
  const role = useAuthStore((s) => s.role);
  const { gpsStatus, gpsMessage } = usePublishAgentLocation(role === 'agent');

  return (
    <div className="agent-layout">
      <AgentSidebar />
      <main className="agent-main">
        {gpsStatus === 'unsupported' && <ErrorBanner message="GPS non supporte par ce navigateur." />}
        {gpsStatus !== 'ok' && gpsMessage && <ErrorBanner message={gpsMessage} />}
        <Outlet />
      </main>
    </div>
  );
};

export default AgentLayout;
