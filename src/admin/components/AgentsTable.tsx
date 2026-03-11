import type { FC } from 'react';
import type { Agent } from '../types';

interface AgentsTableProps {
  agents: Agent[];
}

const AgentsTable: FC<AgentsTableProps> = ({ agents }) => {
  return (
    <div className="admin-table-wrap">
      {/* Header row */}
      <div className="admin-table-header admin-table-header--agents">
        <span>Matricule</span>
        <span>Prénom(s)</span>
        <span>Nom</span>
        <span>Numero de téléphone</span>
        <span>Statut</span>
      </div>

      {/* Rows */}
      {agents.map((agent) => (
        <div key={agent.id} className="admin-table-row admin-table-row--agents">
          <div className="admin-table-row__num">
            <img
              src={agent.avatar}
              alt={agent.prenom}
              className="admin-table-row__avatar"
            />
            <span>{agent.matricule}</span>
          </div>
          <span className="admin-table-cell">{agent.prenom}</span>
          <span className="admin-table-cell">{agent.nom}</span>
          <span className="admin-table-cell">{agent.telephone}</span>
          <span className={`admin-table-cell admin-table-cell--status admin-table-cell--${agent.statut.toLowerCase()}`}>
            {agent.statut}
          </span>
        </div>
      ))}
    </div>
  );
};

export default AgentsTable;
