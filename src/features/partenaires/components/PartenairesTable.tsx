import type { FC } from 'react';
import type { Partenaire } from '../types/partenaire.types';
import { ASSETS } from '../../../shared/constants/assets';

interface PartenairesTableProps {
  partenaires: Partenaire[];
}

const PartenairesTable: FC<PartenairesTableProps> = ({ partenaires }) => {
  return (
    <div className="admin-table-wrap">
      {/* Header */}
      <div className="admin-table-header admin-table-header--partenaires">
        <span>Partenaire</span>
        <span>Responsable</span>
        <span>Adresse</span>
        <span>Statut</span>
      </div>

      {/* Rows */}
      {partenaires.length === 0 && (
        <p className="admin-empty-state">Aucun partenaire trouvé.</p>
      )}
      {partenaires.map((p) => (
        <div key={p.id} className="admin-table-row admin-table-row--partenaires">
          <div className="admin-table-row__num">
            <img
              src={ASSETS.defaultAvatar}
              alt={p.nom}
              className="admin-table-row__avatar"
            />
            <span className="admin-table-cell">{p.nom}</span>
          </div>
          <span className="admin-table-cell">{p.type || '—'}</span>
          <span className="admin-table-cell">{p.adresse}</span>
          <span className="admin-table-cell">{p.telephone}</span>
        </div>
      ))}
    </div>
  );
};

export default PartenairesTable;
