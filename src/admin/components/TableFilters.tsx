import type { FC } from 'react';

interface TableFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  statut: string;
  onStatutChange: (v: string) => void;
}

const TableFilters: FC<TableFiltersProps> = ({
  search,
  onSearchChange,
  statut,
  onStatutChange,
}) => {
  return (
    <div className="admin-filters">
      {/* Trier + Statut */}
      <div className="admin-filters__left">
        <span className="admin-filters__trier">Trier</span>
        <div className="admin-filters__statut">
          <select
            value={statut}
            onChange={(e) => onStatutChange(e.target.value)}
            className="admin-filters__select"
          >
            <option value="">Statut</option>
            <option value="Active">Active</option>
            <option value="Inactif">Inactif</option>
            <option value="Suspendu">Suspendu</option>
          </select>
          <img
            src="/admin/icon-dropdown.svg"
            alt="dropdown"
            className="admin-filters__dropdown-icon"
          />
        </div>
      </div>

      {/* Search */}
      <div className="admin-filters__search">
        <img src="/admin/icon-search.png" alt="search" className="admin-filters__search-icon" />
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="admin-filters__search-input"
        />
      </div>

      {/* Download */}
      <div className="admin-filters__right">
        <span className="admin-filters__telecharger">Télécharger</span>
        <button className="admin-filters__excel">
          <span>Excel</span>
          <img src="/admin/icon-excel.svg" alt="excel" />
        </button>
        <button className="admin-filters__pdf">
          <span>PDF</span>
          <img src="/admin/icon-pdf.svg" alt="pdf" />
        </button>
      </div>
    </div>
  );
};

export default TableFilters;
