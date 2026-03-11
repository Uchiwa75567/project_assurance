import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { clientApi } from '../../features/clients/services/clientApi';
import PageLoader from '../../shared/components/PageLoader';
import ErrorBanner from '../../shared/components/ErrorBanner';

const DEFAULT_AVATAR = '/admin/avatar-1.jpg';

const statusLabel = (value?: string | null) => {
  if (value === 'ACTIVE') return 'Active';
  if (value === 'INACTIF') return 'Inactif';
  if (value === 'SUSPENDU') return 'Suspendu';
  return value ?? 'Active';
};

const AgentGestionClientsPage: FC = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['agent-clients', search],
    queryFn: () => clientApi.getClients({ search: search || undefined, page: 0, size: 50 }),
  });

  const filtered = useMemo(() => data?.content ?? [], [data]);

  return (
    <div className="agent-page">
      <div className="agent-page__header">
        <img src="/agent/icon-page-title.svg" alt="" className="agent-page__title-icon" />
        <h1 className="agent-page__title">Gestion des clients</h1>

        <button className="admin-page__add-btn" style={{ marginLeft: 'auto' }} onClick={() => navigate('/agent/ajouter-client')}>
          + Ajouter un client
        </button>
      </div>

      <div className="agent-search-bar">
        <input
          type="text"
          placeholder="Rechercher un client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="agent-search-bar__input"
        />
      </div>

      <div className="agent-activities">
        {isLoading && <PageLoader />}
        {isError && <ErrorBanner message="Impossible de charger les clients." />}

        <div className="admin-table-header agent-table-header">
          <span>Client</span>
          <span>Prénom(s)</span>
          <span>Nom</span>
          <span>Type d'ass</span>
          <span>Statut</span>
        </div>

        {filtered.map((client) => (
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

        {!isLoading && !isError && filtered.length === 0 && <p className="agent-empty-state">Aucun client trouvé.</p>}
      </div>
    </div>
  );
};

export default AgentGestionClientsPage;
