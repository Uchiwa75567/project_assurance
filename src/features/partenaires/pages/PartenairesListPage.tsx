import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { partenaireApi } from '../services/partenaireApi';
import PartenairesTable from '../components/PartenairesTable';
import AjouterPartenaireForm from '../components/AjouterPartenaireForm';
import AdminPagination from '../../../admin/components/AdminPagination';
import PageLoader from '../../../shared/components/PageLoader';
import ErrorBanner from '../../../shared/components/ErrorBanner';
import type { Partenaire } from '../types/partenaire.types';

const PAGE_SIZE = 8;

const PartenairesListPage: FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [statut, setStatut] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['partenaires-list'],
    queryFn: () => partenaireApi.list(),
  });

  const filtered = useMemo<Partenaire[]>(() => {
    const source = data ?? [];
    return source.filter((p) => {
      const matchSearch =
        !search ||
        p.nom.toLowerCase().includes(search.toLowerCase()) ||
        p.adresse.toLowerCase().includes(search.toLowerCase()) ||
        p.telephone.includes(search);
      const matchStatut =
        !statut ||
        (statut === 'Active' && p.actif) ||
        (statut === 'Inactif' && !p.actif);
      return matchSearch && matchStatut;
    });
  }, [data, search, statut]);

  const totalPages = Math.max(Math.ceil(filtered.length / PAGE_SIZE), 1);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-page__header">
        <div className="admin-page__title">
          <img
            src="/admin/icon-nav-partners.svg"
            alt="partenaires"
            className="admin-page__title-icon"
          />
          <h1>Gestion des partenaires</h1>
        </div>
        {showForm ? (
          <button
            className="admin-page__add-btn"
            onClick={() => setShowForm(false)}
            aria-label="Retour à la liste"
          >
            Retour
          </button>
        ) : (
          <button
            className="admin-page__add-btn"
            onClick={() => setShowForm(true)}
            aria-label="Ajouter un partenaire"
          >
            Ajouter un Partenaire
          </button>
        )}
      </div>

      {showForm ? (
        <AjouterPartenaireForm
          onCancel={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            void refetch();
          }}
        />
      ) : (
        <>
          {/* Filters */}
          <div className="admin-filters">
            <div className="admin-filters__left">
              <span className="admin-filters__trier">Trier</span>
              <div className="admin-filters__statut">
                <select
                  value={statut}
                  onChange={(e) => {
                    setStatut(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="admin-filters__select"
                  aria-label="Filtrer par statut"
                >
                  <option value="">Statut</option>
                  <option value="Active">Active</option>
                  <option value="Inactif">Inactif</option>
                </select>
                <img
                  src="/admin/icon-dropdown.svg"
                  alt=""
                  className="admin-filters__dropdown-icon"
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="admin-filters__search">
              <img
                src="/admin/icon-search.png"
                alt="rechercher"
                className="admin-filters__search-icon"
              />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="admin-filters__search-input"
                aria-label="Rechercher un partenaire"
              />
            </div>

            <div className="admin-filters__right">
              <span className="admin-filters__telecharger">Télécharger</span>
              <button className="admin-filters__excel" aria-label="Télécharger en Excel">
                <span>Excel</span>
                <img src="/admin/icon-excel.svg" alt="Excel" />
              </button>
              <button className="admin-filters__pdf" aria-label="Télécharger en PDF">
                <span>PDF</span>
                <img src="/admin/icon-pdf.svg" alt="PDF" />
              </button>
            </div>
          </div>

          {/* Table card */}
          <div className="admin-card">
            {isLoading && <PageLoader />}
            {isError && (
              <ErrorBanner message="Impossible de charger les partenaires." />
            )}
            <PartenairesTable partenaires={paginated} />
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PartenairesListPage;
