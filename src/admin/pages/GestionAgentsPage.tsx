import type { FC } from 'react';
import { useState, useMemo } from 'react';
import TableFilters from '../components/TableFilters';
import AgentsTable from '../components/AgentsTable';
import AdminPagination from '../components/AdminPagination';
import AjouterAgentForm from '../components/AjouterAgentForm';
import { mockAgents } from '../data/mockAgents';

const TOTAL_PAGES = 10;

const GestionAgentsPage: FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [statut, setStatut] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return mockAgents.filter((a) => {
      const matchSearch =
        !search ||
        a.prenom.toLowerCase().includes(search.toLowerCase()) ||
        a.nom.toLowerCase().includes(search.toLowerCase()) ||
        a.matricule.toLowerCase().includes(search.toLowerCase()) ||
        a.telephone.includes(search);
      const matchStatut = !statut || a.statut === statut;
      return matchSearch && matchStatut;
    });
  }, [search, statut]);

  return (
    <div className="admin-page">
      {/* Page heading */}
      <div className="admin-page__header">
        <div className="admin-page__title">
          <img
            src="/admin/icon-user-heading-agents.svg"
            alt="agents"
            className="admin-page__title-icon"
          />
          <h1>Gestion des Agent</h1>
        </div>
        <button
          className="admin-page__add-btn"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? 'Voir la liste' : 'Ajouter un Agent'}
        </button>
      </div>

      {showForm ? (
        /* ── Add Agent Form ── */
        <AjouterAgentForm
          onCancel={() => setShowForm(false)}
          onSuccess={() => setShowForm(false)}
        />
      ) : (
        /* ── Agents list ── */
        <>
          <TableFilters
            search={search}
            onSearchChange={setSearch}
            statut={statut}
            onStatutChange={setStatut}
          />
          <div className="admin-card">
            <AgentsTable agents={filtered} />
            <AdminPagination
              currentPage={currentPage}
              totalPages={TOTAL_PAGES}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default GestionAgentsPage;
