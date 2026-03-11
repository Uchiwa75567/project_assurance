import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { partenaireApi } from '../services/partenaireApi';
import PageLoader from '../../../shared/components/PageLoader';
import ErrorBanner from '../../../shared/components/ErrorBanner';

const PartenairesListPage: FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['partenaires-list'],
    queryFn: () => partenaireApi.list(),
  });

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div className="admin-page__title">
          <img src="/admin/icon-nav-partners.svg" alt="partenaires" className="admin-page__title-icon" />
          <h1>Gestion des partenaires</h1>
        </div>
      </div>

      <div className="admin-card">
        {isLoading && <PageLoader />}
        {isError && <ErrorBanner message="Impossible de charger les partenaires." />}

        <div className="admin-table-header">
          <span>Nom</span>
          <span>Type</span>
          <span>Adresse</span>
          <span>Téléphone</span>
          <span>Statut</span>
        </div>

        {(data ?? []).map((p) => (
          <div key={p.id} className="admin-table-row">
            <span className="admin-table-cell">{p.nom}</span>
            <span className="admin-table-cell">{p.type}</span>
            <span className="admin-table-cell">{p.adresse}</span>
            <span className="admin-table-cell">{p.telephone}</span>
            <span className={`admin-table-cell admin-table-cell--status admin-table-cell--${p.actif ? 'active' : 'inactif'}`}>
              {p.actif ? 'Active' : 'Inactif'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartenairesListPage;
