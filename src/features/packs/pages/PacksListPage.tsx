import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { packApi, type PackUpdateRequest } from '../services/packApi';
import PackCard from '../components/PackCard';
import PageLoader from '../../../shared/components/PageLoader';
import ErrorBanner from '../../../shared/components/ErrorBanner';
import { plans } from '../data/plans';
import type { Pack } from '../types/pack.types';
import { formatFriendlyApiError } from '../../../shared/utils/apiErrorMessages';

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
  const [editingPack, setEditingPack] = useState<Pack | null>(null);
  const [editValues, setEditValues] = useState<PackUpdateRequest>({});
  const [editError, setEditError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['packs-list'],
    queryFn: () => packApi.list(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PackUpdateRequest }) =>
      packApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packs-list'] });
      setEditingPack(null);
      setEditValues({});
      setEditError(null);
    },
    onError: (error) => {
      const friendly = formatFriendlyApiError(error);
      setEditError(friendly.message);
    },
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

  const openEditModal = (pack: Pack) => {
    setEditingPack(pack);
    setEditValues({
      code: pack.code,
      nom: pack.nom,
      description: pack.description,
      prix: pack.prix,
      duree: pack.duree,
      actif: pack.actif,
    });
    setEditError(null);
  };

  const closeEditModal = () => {
    if (updateMutation.isPending) return;
    setEditingPack(null);
    setEditValues({});
    setEditError(null);
  };

  const handleEditChange = (field: keyof PackUpdateRequest, value: string | number | boolean) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingPack) return;

    const payload: PackUpdateRequest = {
      code: editValues.code?.trim() || editingPack.code,
      nom: editValues.nom?.trim() || editingPack.nom,
      description: editValues.description?.trim() || editingPack.description,
      prix: typeof editValues.prix === 'number' ? editValues.prix : editingPack.prix,
      duree: typeof editValues.duree === 'number' ? editValues.duree : editingPack.duree,
      actif: typeof editValues.actif === 'boolean' ? editValues.actif : editingPack.actif,
    };

    updateMutation.mutate({ id: editingPack.id, payload });
  };

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
          <PackCard key={pack.id} pack={pack} onModifier={openEditModal} />
        ))}
        {!isLoading && filtered.length === 0 && (
          <p className="admin-empty-state">Aucune formule trouvée.</p>
        )}
      </div>

      {editingPack && (
        <div className="admin-modal" role="dialog" aria-modal="true">
          <div className="admin-modal__panel">
            <div className="admin-modal__header">
              <h3>Modifier la formule</h3>
              <button
                type="button"
                className="admin-modal__close"
                onClick={closeEditModal}
                aria-label="Fermer"
              >
                ×
              </button>
            </div>

            <form className="admin-modal__form" onSubmit={handleEditSubmit}>
              <label className="admin-modal__field">
                <span>Code</span>
                <input
                  type="text"
                  value={editValues.code ?? ''}
                  onChange={(e) => handleEditChange('code', e.target.value)}
                />
              </label>

              <label className="admin-modal__field">
                <span>Nom</span>
                <input
                  type="text"
                  value={editValues.nom ?? ''}
                  onChange={(e) => handleEditChange('nom', e.target.value)}
                />
              </label>

              <label className="admin-modal__field">
                <span>Description</span>
                <textarea
                  rows={4}
                  value={editValues.description ?? ''}
                  onChange={(e) => handleEditChange('description', e.target.value)}
                />
              </label>

              <div className="admin-modal__grid">
                <label className="admin-modal__field">
                  <span>Prix (FCFA)</span>
                  <input
                    type="number"
                    min={0}
                    value={editValues.prix ?? 0}
                    onChange={(e) => handleEditChange('prix', Number(e.target.value))}
                  />
                </label>

                <label className="admin-modal__field">
                  <span>Durée (mois)</span>
                  <input
                    type="number"
                    min={1}
                    value={editValues.duree ?? 1}
                    onChange={(e) => handleEditChange('duree', Number(e.target.value))}
                  />
                </label>
              </div>

              <label className="admin-modal__toggle">
                <input
                  type="checkbox"
                  checked={editValues.actif ?? true}
                  onChange={(e) => handleEditChange('actif', e.target.checked)}
                />
                <span>Formule active</span>
              </label>

              {editError && <p className="admin-modal__error">{editError}</p>}

              <div className="admin-modal__actions">
                <button type="button" className="admin-modal__secondary" onClick={closeEditModal}>
                  Annuler
                </button>
                <button type="submit" className="admin-modal__primary" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PacksListPage;
