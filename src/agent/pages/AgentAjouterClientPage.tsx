import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import AjouterClientForm from '../../admin/components/AjouterClientForm';

const AgentAjouterClientPage: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="agent-page">
      {/* ── Page header ── */}
      <div className="agent-page__header">
        <img
          src="/agent/icon-page-title.svg"
          alt=""
          className="agent-page__title-icon"
        />
        <h1 className="agent-page__title">Ajouter un client</h1>
      </div>

      <AjouterClientForm
        onSuccess={() => navigate('/agent/gestion-clients')}
        onCancel={() => navigate('/agent/dashboard')}
      />
    </div>
  );
};

export default AgentAjouterClientPage;
