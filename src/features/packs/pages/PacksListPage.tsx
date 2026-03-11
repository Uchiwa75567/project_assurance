import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { packApi } from '../services/packApi';
import PageLoader from '../../../shared/components/PageLoader';
import ErrorBanner from '../../../shared/components/ErrorBanner';

const PacksListPage: FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['packs-list'],
    queryFn: () => packApi.list(),
  });

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div className="admin-page__title">
          <img src="/admin/icon-nav-partners.svg" alt="formules" className="admin-page__title-icon" />
          <h1>Gestion des formules</h1>
        </div>
      </div>

      <div className="admin-card">
        {isLoading && <PageLoader />}
        {isError && <ErrorBanner message="Impossible de charger les formules." />}

        <div className="admin-table-header">
          <span>Code</span>
          <span>Nom</span>
          <span>Description</span>
          <span>Prix mensuel</span>
          <span>Statut</span>
        </div>

        {(data ?? []).map((pack) => (
          <div key={pack.id} className="admin-table-row">
            <span className="admin-table-cell">{pack.code}</span>
            <span className="admin-table-cell">{pack.nom}</span>
            <span className="admin-table-cell">{pack.description}</span>
            <span className="admin-table-cell">{pack.prixMensuel} {pack.devise}</span>
            <span className={`admin-table-cell admin-table-cell--status admin-table-cell--${pack.actif ? 'active' : 'inactif'}`}>
              {pack.actif ? 'Active' : 'Inactif'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PacksListPage;
