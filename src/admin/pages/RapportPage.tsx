import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { clientApi } from '../../features/clients/services/clientApi';
import { agentApi } from '../../features/agents/services/agentApi';
import { partenaireApi } from '../../features/partenaires/services/partenaireApi';
import { packApi } from '../../features/packs/services/packApi';
import PageLoader from '../../shared/components/PageLoader';
import ErrorBanner from '../../shared/components/ErrorBanner';

const RapportPage: FC = () => {
  const clients = useQuery({ queryKey: ['report-clients'], queryFn: () => clientApi.getClients({ page: 0, size: 1 }) });
  const agents = useQuery({ queryKey: ['report-agents'], queryFn: () => agentApi.getAgents() });
  const partenaires = useQuery({ queryKey: ['report-partenaires'], queryFn: () => partenaireApi.list() });
  const packs = useQuery({ queryKey: ['report-packs'], queryFn: () => packApi.list() });

  const loading = clients.isLoading || agents.isLoading || partenaires.isLoading || packs.isLoading;
  const hasError = clients.isError || agents.isError || partenaires.isError || packs.isError;

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div className="admin-page__title">
          <img src="/admin/icon-pdf.svg" alt="rapport" className="admin-page__title-icon" />
          <h1>Rapport global</h1>
        </div>
      </div>

      {loading && <PageLoader />}
      {hasError && <ErrorBanner message="Impossible de charger toutes les métriques du rapport." />}

      {!loading && !hasError && (
        <div className="dash-body">
          <div className="admin-card" style={{ padding: 16 }}>
            <h3>Total clients</h3>
            <p>{clients.data?.totalElements ?? 0}</p>
          </div>
          <div className="admin-card" style={{ padding: 16 }}>
            <h3>Total agents</h3>
            <p>{agents.data?.length ?? 0}</p>
          </div>
          <div className="admin-card" style={{ padding: 16 }}>
            <h3>Total partenaires</h3>
            <p>{partenaires.data?.length ?? 0}</p>
          </div>
          <div className="admin-card" style={{ padding: 16 }}>
            <h3>Total formules</h3>
            <p>{packs.data?.length ?? 0}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RapportPage;
