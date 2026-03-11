import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';

const AgentsCard: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="dash-agents-card">
      <button
        className="dash-agents-card__btn"
        onClick={() => navigate('/admin/gestion-agents')}
      >
        Voir mes agents
      </button>

      <p className="dash-agents-card__subtitle">
        consultez la liste de<br />mes agents
      </p>

      <img
        src="/admin/agents-avatar-group.svg"
        alt="agents"
        className="dash-agents-card__avatars"
      />
    </div>
  );
};

export default AgentsCard;
