import type { FC } from 'react';
import { useEffect } from 'react';

export type RechargeCardFeature = {
  id: string;
  label: string;
};

type RechargeModalStep = 'summary' | 'wave';

type RechargeCardModalProps = {
  open: boolean;
  step: RechargeModalStep;
  title: string;
  priceLabel: string;
  amountText: string;
  features: RechargeCardFeature[];
  isSubmitting?: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onProceedToWave: () => void;
  onPayNow: () => void;
};

type PaymentGlyphProps = {
  strokeColor?: string;
  className?: string;
};

const PaymentGlyph = ({ strokeColor = '#F2F2F2', className }: PaymentGlyphProps) => {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M21 11.0031H20.824L19.001 5.6701L3.354 11.0031L3 11.0001M2.5 11.0041H3L14.146 2.1001L16.963 6.0501"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="square"
      />
      <path
        d="M14.5 16C14.5 16.663 14.2366 17.2989 13.7678 17.7678C13.2989 18.2366 12.663 18.5 12 18.5C11.337 18.5 10.7011 18.2366 10.2322 17.7678C9.76339 17.2989 9.5 16.663 9.5 16C9.5 15.337 9.76339 14.7011 10.2322 14.2322C10.7011 13.7634 11.337 13.5 12 13.5C12.663 13.5 13.2989 13.7634 13.7678 14.2322C14.2366 14.7011 14.5 15.337 14.5 16Z"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="square"
      />
      <path
        d="M21.5 11V21H2.5V11H21.5Z"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="square"
      />
      <path
        d="M2.5 11H4.5C4.5 11.5304 4.28929 12.0391 3.91421 12.4142C3.53914 12.7893 3.03043 13 2.5 13V11ZM21.5 11H19.5C19.5 11.5304 19.7107 12.0391 20.0858 12.4142C20.4609 12.7893 20.9696 13 21.5 13V11ZM2.5 21H4.502C4.50226 20.737 4.45066 20.4766 4.35014 20.2336C4.24963 19.9905 4.10217 19.7697 3.91621 19.5838C3.73026 19.3978 3.50946 19.2504 3.26644 19.1499C3.02343 19.0493 2.76298 18.9977 2.5 18.998V21ZM21.5 21H19.5C19.5 20.4696 19.7107 19.9609 20.0858 19.5858C20.4609 19.2107 20.9696 19 21.5 19V21Z"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  );
};

const ChevronDownIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M4.5 7.25L9 11.75L13.5 7.25"
      stroke="#D4D8E1"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RechargeCardModal: FC<RechargeCardModalProps> = ({
  open,
  step,
  title,
  priceLabel,
  amountText,
  features,
  isSubmitting = false,
  errorMessage = null,
  onClose,
  onProceedToWave,
  onPayNow,
}) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className={`client-recharge-modal client-recharge-modal--${step}`} role="presentation" onClick={onClose}>
      <section
        className="client-recharge-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="client-recharge-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="client-recharge-modal__header">
          <h2 id="client-recharge-modal-title" className="client-recharge-modal__title">
            {title}
          </h2>
          <button
            type="button"
            className="client-recharge-modal__close"
            onClick={onClose}
            aria-label="Fermer la fenêtre"
            title="Fermer"
            disabled={isSubmitting}
          >
            ×
          </button>
        </header>

        <div className="client-recharge-modal__body">
          {step === 'summary' ? (
            <div className="client-recharge-modal__content client-recharge-modal__content--summary">
              <div className="client-recharge-modal__price-card">
                <div className="client-recharge-modal__price-copy">
                  <span className="client-recharge-modal__price-label">Tarification</span>
                  <strong className="client-recharge-modal__price-value">{priceLabel}</strong>
                </div>
                <div className="client-recharge-modal__price-badge" aria-hidden="true">
                  <PaymentGlyph />
                </div>
              </div>

              {errorMessage ? (
                <p className="client-recharge-modal__error" role="alert">
                  {errorMessage}
                </p>
              ) : null}

              <ul className="client-recharge-modal__features" aria-label="Garanties du pack">
                {features.map((feature) => (
                  <li key={feature.id} className="client-recharge-modal__feature">
                    <span className="client-recharge-modal__check" aria-hidden="true">
                      ✓
                    </span>
                    <span className="client-recharge-modal__feature-label">{feature.label}</span>
                  </li>
                ))}
              </ul>

              <div className="client-recharge-modal__actions client-recharge-modal__actions--summary">
                <button
                  type="button"
                  className="client-recharge-modal__pay"
                  onClick={onProceedToWave}
                  disabled={isSubmitting}
                >
                  Payer maintenant
                </button>

                <button
                  type="button"
                  className="client-recharge-modal__later"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Payer Plutard
                </button>
              </div>
            </div>
          ) : (
            <div className="client-recharge-modal__content client-recharge-modal__content--wave">
              <div className="client-recharge-modal__price-card">
                <div className="client-recharge-modal__price-copy">
                  <span className="client-recharge-modal__price-label">Tarification</span>
                  <strong className="client-recharge-modal__price-value">{priceLabel}</strong>
                </div>
                <div className="client-recharge-modal__price-badge" aria-hidden="true">
                  <PaymentGlyph />
                </div>
              </div>

              {errorMessage ? (
                <p className="client-recharge-modal__error" role="alert">
                  {errorMessage}
                </p>
              ) : null}

              <div className="client-recharge-modal__method" aria-label="Moyen de paiement Wave">
                <div className="client-recharge-modal__method-logo" aria-hidden="true">
                  <img src="/wave.png" alt="" />
                </div>
                <div className="client-recharge-modal__method-copy">
                  <span className="client-recharge-modal__method-label">Payer avec wave</span>
                </div>
                <span className="client-recharge-modal__method-caret" aria-hidden="true">
                  <ChevronDownIcon />
                </span>
              </div>

              <label className="client-recharge-modal__amount">
                <span className="client-recharge-modal__amount-icon" aria-hidden="true">
                  <PaymentGlyph strokeColor="#071432" />
                </span>
                <input
                  className="client-recharge-modal__amount-input"
                  type="text"
                  inputMode="numeric"
                  readOnly
                  aria-label="Montant à payer"
                  value={amountText}
                  placeholder="12 900"
                />
                <span className="client-recharge-modal__amount-currency">FCFA</span>
              </label>

              <div className="client-recharge-modal__actions client-recharge-modal__actions--wave">
                <button
                  type="button"
                  className="client-recharge-modal__pay"
                  onClick={onPayNow}
                  disabled={isSubmitting}
                >
                  Payer
                </button>

                <button
                  type="button"
                  className="client-recharge-modal__later"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Payer Plutard
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default RechargeCardModal;
