import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TableFilters from '../components/TableFilters';
import AgentsTable from '../components/AgentsTable';
import AdminPagination from '../components/AdminPagination';
import AjouterAgentForm from '../components/AjouterAgentForm';
import AdminAgentLiveTrackingPanel from '../../features/agents/components/AdminAgentLiveTrackingPanel';
import { agentApi } from '../../features/agents/services/agentApi';
import PageLoader from '../../shared/components/PageLoader';
import ErrorBanner from '../../shared/components/ErrorBanner';
import type { Agent } from '../types';

const PAGE_SIZE = 10;
const DEFAULT_AVATAR = '/admin/avatar-1.jpg';

const mapStatusLabel = (status: string) => {
  if (status === 'ACTIVE') return 'Active';
  if (status === 'SUSPENDU') return 'Suspendu';
  if (status === 'INACTIF' || status === 'Inactif') return 'Inactif';
  return 'Active';
};

const toUiAgent = (agent: {
  id: string;
  matricule: string;
  prenom: string;
  nom: string;
  telephone: string;
  statut: string;
}): Agent => ({
  id: agent.id,
  matricule: agent.matricule,
  prenom: agent.prenom,
  nom: agent.nom,
  telephone: agent.telephone,
  statut: mapStatusLabel(agent.statut) as Agent['statut'],
  avatar: DEFAULT_AVATAR,
});

const GestionAgentsPage: FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [statut, setStatut] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-agents'],
    queryFn: () => agentApi.getAgents(),
  });

  const filtered = useMemo(() => {
    const source = (data ?? []).map(toUiAgent);
    const filteredSource = source.filter((a) => {
      const matchSearch =
        !search ||
        a.prenom.toLowerCase().includes(search.toLowerCase()) ||
        a.nom.toLowerCase().includes(search.toLowerCase()) ||
        a.matricule.toLowerCase().includes(search.toLowerCase()) ||
        a.telephone.includes(search);
      const matchStatut = !statut || a.statut === statut;
      return matchSearch && matchStatut;
    });

    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredSource.slice(start, start + PAGE_SIZE);
  }, [data, search, statut, currentPage]);

  const totalPages = Math.max(Math.ceil(((data ?? []).length || 1) / PAGE_SIZE), 1);

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div className="admin-page__title">
          <img src="/admin/icon-user-heading-agents.svg" alt="agents" className="admin-page__title-icon" />
          <h1>Gestion des Agent</h1>
        </div>
        <button className="admin-page__add-btn" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Voir la liste' : 'Ajouter un Agent'}
        </button>
      </div>

      {showForm ? (
        <AjouterAgentForm
          onCancel={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            void refetch();
          }}
        />
      ) : (
        <>
          <TableFilters search={search} onSearchChange={setSearch} statut={statut} onStatutChange={setStatut} />
          <div className="admin-card">
            {isLoading && <PageLoader />}
            {isError && <ErrorBanner message="Impossible de charger les agents." />}
            <AgentsTable agents={filtered} />
            <AdminPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
          <AdminAgentLiveTrackingPanel />
        </>
      )}
    </div>
  );
};

export default GestionAgentsPage;
