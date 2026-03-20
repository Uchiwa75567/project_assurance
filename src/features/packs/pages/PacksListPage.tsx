import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { packApi } from '../services/packApi';
import PackCard from '../components/PackCard';
import PageLoader from '../../../shared/components/PageLoader';
import ErrorBanner from '../../../shared/components/ErrorBanner';
import { plans } from '../data/plans';
import type { Pack } from '../types/pack.types';

/* Convert the static plan data into Pack-shaped objects as fallback */
const fallbackPacks: Pack[] = plans.map((plan, i) => ({
  id: `static-${i}`,
  code: `PACK-${i + 1}`,
  nom: plan.title,
  description: plan.description,
  prix: parseInt(plan.price.replace(/\D/g, ''), 10) || 3900,
  duree: 1,
  actif: true,
}));

const PacksListPage: FC = () => {
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['packs-list'],
    queryFn: () => packApi.list(),
  });

  const packs = data ?? fallbackPacks;

  const filtered = useMemo<Pack[]>(
    () =>
      packs.filter(
        (p) =>
          !search ||
          p.nom.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()),
      ),
    [packs, search],
  );

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-page__header">
        <div className="admin-page__title">
          <img
            src="/admin/icon-nav-partners.svg"
            alt="formules"
            className="admin-page__title-icon"
          />
          <h1>Gestion des formules</h1>
        </div>
      </div>

      {/* Search + Download row */}
      <div className="packs-toolbar">
        <div className="admin-filters__search packs-toolbar__search">
          <img
            src="/admin/icon-search.png"
            alt="rechercher"
            className="admin-filters__search-icon"
          />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-filters__search-input"
            aria-label="Rechercher une formule"
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

      {/* Section title */}
      <h2 className="packs-section-title">Mes Formules</h2>

      {isLoading && <PageLoader />}
      {isError && (
        <ErrorBanner message="Impossible de charger les formules." />
      )}

      {/* Cards grid */}
      <div className="packs-grid">
        {filtered.map((pack) => (
          <PackCard key={pack.id} pack={pack} />
        ))}
        {!isLoading && filtered.length === 0 && (
          <p className="admin-empty-state">Aucune formule trouvée.</p>
        )}
      </div>
    </div>
  );
};

export default PacksListPage;
