import type { FC } from 'react';
import type { Client } from '../types/client.types';

const ClientCard: FC<{ client: Client }> = ({ client }) => {
  return (
    <article>
      <strong>
        {client.prenom} {client.nom}
      </strong>
      <p>{client.numeroAssurance}</p>
    </article>
  );
};

export default ClientCard;
