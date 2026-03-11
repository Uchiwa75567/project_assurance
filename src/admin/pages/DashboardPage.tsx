import type { FC } from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import DashboardTopBar from '../components/dashboard/DashboardTopBar';
import StatisticsChart from '../components/dashboard/StatisticsChart';
import AgentsCard from '../components/dashboard/AgentsCard';
import PartnairesCard from '../components/dashboard/PartnairesCard';
import { clientApi } from '../../features/clients/services/clientApi';
import PageLoader from '../../shared/components/PageLoader';
import ErrorBanner from '../../shared/components/ErrorBanner';
import type { Client } from '../types';

const PREVIEW_COUNT = 5;
const DEFAULT_AVATAR = '/admin/avatar-1.jpg';

const mapStatusLabel = (status: string | undefined) => {
  if (status === 'ACTIVE') return 'Active';
  if (status === 'INACTIF') return 'Inactif';
  if (status === 'SUSPENDU') return 'Suspendu';
  return status ?? 'Active';
};

const toUiClient = (client: {
  id: string;
  numeroAssurance: string;
  prenom: string;
  nom: string;
  typeAssurance?: string | null;
  statut?: string;
}): Client => ({
  id: client.id,
  numeroAssurance: client.numeroAssurance,
  prenom: client.prenom,
  nom: client.nom,
  typeAssurance: client.typeAssurance ?? 'Pack Noppale Sante',
  statut: mapStatusLabel(client.statut) as Client['statut'],
  avatar: DEFAULT_AVATAR,
});

const DashboardPage: FC = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard-preview-clients'],
    queryFn: () => clientApi.getClients({ page: 0, size: PREVIEW_COUNT }),
  });

  const previewClients = (data?.content ?? []).map(toUiClient);

  return (
    <div className="dash-page">
      <DashboardTopBar search={search} onSearchChange={setSearch} />

      <div className="dash-body">
        <div className="dash-left">
          <h2 className="dash-section-title">Statistics</h2>

          <StatisticsChart />

          <div className="dash-voir-plus-row">
            <button className="dash-voir-plus-btn" onClick={() => navigate('/admin/gestion-clients')}>
              Voir plus
            </button>
          </div>

          <div className="admin-card dash-clients-table-card">
            {isLoading && <PageLoader />}
            {isError && <ErrorBanner message="Impossible de charger les clients." />}

            <div className="admin-table-header">
              <span>Numero assurance</span>
              <span>Prénom(s)</span>
              <span>Nom</span>
              <span>Type d'ass</span>
              <span>Statut</span>
            </div>

            {previewClients.map((client) => (
              <div key={client.id} className="admin-table-row">
                <div className="admin-table-row__num">
                  <img src={client.avatar} alt={client.prenom} className="admin-table-row__avatar" />
                  <span className="admin-table-cell">{client.numeroAssurance}</span>
                </div>
                <span className="admin-table-cell">{client.prenom}</span>
                <span className="admin-table-cell">{client.nom}</span>
                <span className="admin-table-cell">{client.typeAssurance}</span>
                <span className="admin-table-cell admin-table-cell--status admin-table-cell--active">{client.statut}</span>
              </div>
            ))}

            {!isLoading && !isError && previewClients.length === 0 && (
              <p className="agent-empty-state">Aucun client disponible.</p>
            )}
          </div>
        </div>

        <div className="dash-right">
          <AgentsCard />
          <PartnairesCard />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
