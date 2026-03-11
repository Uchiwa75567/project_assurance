import type { FC } from 'react';

const ConnectionBadge: FC<{ connected: boolean; connectedLabel?: string; disconnectedLabel?: string }> = ({
  connected,
  connectedLabel = 'Connecte',
  disconnectedLabel = 'Deconnecte',
}) => {
  return (
    <span
      style={{
        display: 'inline-block',
        borderRadius: 999,
        padding: '4px 10px',
        fontSize: 12,
        fontWeight: 600,
        color: connected ? '#166534' : '#991b1b',
        background: connected ? '#dcfce7' : '#fee2e2',
      }}
    >
      {connected ? connectedLabel : disconnectedLabel}
    </span>
  );
};

export default ConnectionBadge;
