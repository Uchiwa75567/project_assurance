import type { FC } from 'react';
import { useState, useMemo } from 'react';
import TableFilters from '../components/TableFilters';
import ClientsTable from '../components/ClientsTable';
import AdminPagination from '../components/AdminPagination';
import AjouterClientForm from '../components/AjouterClientForm';
import { mockClients } from '../data/mockClients';

const TOTAL_PAGES = 10;

const GestionClientsPage: FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [statut, setStatut] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return mockClients.filter((c) => {
      const matchSearch =
        !search ||
        c.prenom.toLowerCase().includes(search.toLowerCase()) ||
        c.nom.toLowerCase().includes(search.toLowerCase()) ||
        c.numeroAssurance.toLowerCase().includes(search.toLowerCase());
      const matchStatut = !statut || c.statut === statut;
      return matchSearch && matchStatut;
    });
  }, [search, statut]);

  return (
    <div className="admin-page">
      {/* Page heading */}
      <div className="admin-page__header">
        <div className="admin-page__title">
          <img
            src="/admin/icon-user-heading.svg"
            alt="clients"
            className="admin-page__title-icon"
          />
          <h1>Gestion des clients</h1>
        </div>
        <button
          className="admin-page__add-btn"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? 'Retour' : 'Ajouter un client'}
        </button>
      </div>

      {showForm ? (
        /* ── Add Client Form ── */
        <AjouterClientForm
          onCancel={() => setShowForm(false)}
          onSuccess={() => setShowForm(false)}
        />
      ) : (
        /* ── Clients list ── */
        <>
          <TableFilters
            search={search}
            onSearchChange={setSearch}
            statut={statut}
            onStatutChange={setStatut}
          />
          <div className="admin-card">
            <ClientsTable clients={filtered} />
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

export default GestionClientsPage;
