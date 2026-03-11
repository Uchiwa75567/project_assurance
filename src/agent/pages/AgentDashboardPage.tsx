import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import AgentStatisticsChart from '../components/AgentStatisticsChart';
import { clientApi } from '../../features/clients/services/clientApi';
import PageLoader from '../../shared/components/PageLoader';
import ErrorBanner from '../../shared/components/ErrorBanner';

const DEFAULT_AVATAR = '/admin/avatar-1.jpg';
const NOW_TS = Date.now();

const statusLabel = (value?: string | null) => {
  if (value === 'ACTIVE') return 'Active';
  if (value === 'INACTIF') return 'Inactif';
  if (value === 'SUSPENDU') return 'Suspendu';
  return value ?? 'Active';
};

const AgentDashboardPage: FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['agent-dashboard-clients'],
    queryFn: () => clientApi.getClients({ page: 0, size: 20 }),
  });

  const clients = data?.content ?? [];
  const thisWeekCount = clients.filter((client) => {
    if (!client.createdAt) return false;
    const createdAt = new Date(client.createdAt).getTime();
    return NOW_TS - createdAt <= 7 * 24 * 60 * 60 * 1000;
  }).length;

  return (
    <div className="agent-page">
      <div className="agent-page__header">
        <img src="/agent/icon-page-title.svg" alt="" className="agent-page__title-icon" />
        <h1 className="agent-page__title">Gestion des clients</h1>
      </div>

      <p className="agent-dash-section-title">Statistics</p>

      <div className="agent-dash-stats-row">
        <div className="agent-dash-chart-wrap">
          <AgentStatisticsChart />
        </div>

        <div className="agent-dash-stat-cards">
          <div className="agent-stat-card">
            <div className="agent-stat-card__row">
              <div className="agent-stat-card__left">
                <p className="agent-stat-card__label">Total Clients Inscrit</p>
                <p className="agent-stat-card__value">{clients.length}</p>
              </div>
              <div className="agent-stat-card__right">
                <img src="/agent/icon-chart-line.svg" alt="" className="agent-stat-card__legend-icon" />
                <span className="agent-stat-card__legend-label">Client</span>
              </div>
            </div>
          </div>

          <div className="agent-stat-card">
            <div className="agent-stat-card__row">
              <div className="agent-stat-card__left">
                <p className="agent-stat-card__label">inscrit de la semaine</p>
                <p className="agent-stat-card__value">{thisWeekCount}</p>
              </div>
              <div className="agent-stat-card__right">
                <img src="/agent/icon-chart-line.svg" alt="" className="agent-stat-card__legend-icon" />
                <span className="agent-stat-card__legend-label">Client</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="agent-activities">
        <p className="agent-activities__title">Activités Recentes</p>

        {isLoading && <PageLoader />}
        {isError && <ErrorBanner message="Impossible de charger les activités clients." />}

        <div className="admin-table-header agent-table-header">
          <span>Client</span>
          <span>Prénom(s)</span>
          <span>Nom</span>
          <span>Type d'ass</span>
          <span>Statut</span>
        </div>

        {clients.slice(0, 8).map((client) => (
          <div key={client.id} className="admin-table-row">
            <div className="admin-table-row__num">
              <img src={DEFAULT_AVATAR} alt={client.prenom} className="admin-table-row__avatar" />
            </div>
            <span className="admin-table-cell">{client.prenom}</span>
            <span className="admin-table-cell">{client.nom}</span>
            <span className="admin-table-cell agent-table-cell--pack">{client.typeAssurance ?? 'Pack Noppale Sante'}</span>
            <span className="admin-table-cell agent-table-cell--en-attente">{statusLabel(client.statut)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentDashboardPage;
