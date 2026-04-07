import type { FC } from 'react';

type ErrorBannerProps = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'danger' | 'warning' | 'neutral';
};

const ErrorBanner: FC<ErrorBannerProps> = ({ message, actionLabel, onAction, tone = 'danger' }) => {
  return (
    <div className={`form-error-banner form-error-banner--${tone}`} role="alert" aria-live="polite">
      <p className="form-error-banner__message">{message}</p>
      {actionLabel && onAction && (
        <button type="button" className="form-error-banner__button" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default ErrorBanner;
