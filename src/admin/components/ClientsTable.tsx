import type { FC } from 'react';
import type { Client } from '../types';

interface ClientsTableProps {
  clients: Client[];
}

const ClientsTable: FC<ClientsTableProps> = ({ clients }) => {
  return (
    <div className="admin-table-wrap">
      {/* Header row */}
      <div className="admin-table-header">
        <span>Numero assurance</span>
        <span>Prénom(s)</span>
        <span>Nom</span>
        <span>Type d'ass</span>
        <span>Statut</span>
      </div>

      {/* Rows */}
      {clients.map((client) => (
        <div key={client.id} className="admin-table-row">
          <div className="admin-table-row__num">
            <img
              src={client.avatar}
              alt={client.prenom}
              className="admin-table-row__avatar"
            />
            <span>{client.numeroAssurance}</span>
          </div>
          <span className="admin-table-cell">{client.prenom}</span>
          <span className="admin-table-cell">{client.nom}</span>
          <span className="admin-table-cell">{client.typeAssurance}</span>
          <span className={`admin-table-cell admin-table-cell--status admin-table-cell--${client.statut.toLowerCase()}`}>
            {client.statut}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ClientsTable;
