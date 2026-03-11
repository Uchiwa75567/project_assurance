import type { FC } from 'react';
import type { Client } from '../types/client.types';

const ClientTable: FC<{ clients: Client[] }> = ({ clients }) => {
  return (
    <div>
      {clients.map((client) => (
        <p key={client.id}>
          {client.prenom} {client.nom}
        </p>
      ))}
    </div>
  );
};

export default ClientTable;
