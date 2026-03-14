import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TableFilters from '../components/TableFilters';
import ClientsTable from '../components/ClientsTable';
import AdminPagination from '../components/AdminPagination';
import AjouterClientForm from '../components/AjouterClientForm';
import { clientApi } from '../../features/clients/services/clientApi';
import PageLoader from '../../shared/components/PageLoader';
import ErrorBanner from '../../shared/components/ErrorBanner';
import { ASSETS } from '../../shared/constants/assets';
import type { Client } from '../types';

const DEFAULT_AVATAR = ASSETS.defaultAvatar;

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
  photoUrl?: string | null;
  typeAssurance?: string | null;
  statut?: string;
}): Client => ({
  id: client.id,
  numeroAssurance: client.numeroAssurance,
  prenom: client.prenom,
  nom: client.nom,
  typeAssurance: client.typeAssurance ?? 'Pack Noppale Sante',
  statut: mapStatusLabel(client.statut) as Client['statut'],
  avatar: client.photoUrl || DEFAULT_AVATAR,
});

const GestionClientsPage: FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [statut, setStatut] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-clients', search, statut, currentPage],
    queryFn: () =>
      clientApi.getClients({
        search: search || undefined,
        statut: statut === 'Active' ? 'ACTIVE' : statut === 'Inactif' ? 'INACTIF' : statut === 'Suspendu' ? 'SUSPENDU' : undefined,
        page: currentPage - 1,
        size: 10,
      }),
  });

  const filtered = useMemo(() => (data?.content ?? []).map(toUiClient), [data]);

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div className="admin-page__title">
          <img src="/admin/icon-user-heading.svg" alt="clients" className="admin-page__title-icon" />
          <h1>Gestion des clients</h1>
        </div>
        <button className="admin-page__add-btn" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Retour' : 'Ajouter un client'}
        </button>
      </div>

      {showForm ? (
        <AjouterClientForm
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
            {isError && <ErrorBanner message="Impossible de charger les clients." />}
            <ClientsTable clients={filtered} />
            <AdminPagination currentPage={currentPage} totalPages={Math.max(data?.totalPages ?? 1, 1)} onPageChange={setCurrentPage} />
          </div>
        </>
      )}
    </div>
  );
};

export default GestionClientsPage;
