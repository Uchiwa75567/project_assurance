import type { FC } from 'react';

const ErrorBanner: FC<{ message: string }> = ({ message }) => {
  return <p className="agent-empty-state" style={{ color: '#b91c1c' }}>{message}</p>;
};

export default ErrorBanner;
