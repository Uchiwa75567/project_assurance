import type { FC } from 'react';
import type { PlanCard } from '../../shared/types/ui.types';

type PricingCardProps = PlanCard;

const PricingCard: FC<PricingCardProps> = ({
  title,
  description,
  price,
  subtitle,
  features,
  recommended = false,
  bordered = false,
}) => {
  return (
    <article className={`plan ${bordered ? 'plan-bordered' : ''}`}>
      {recommended && <div className="badge">Recommandé</div>}

      <h3>{title}</h3>
      <p className="plan-desc">{description}</p>

      <div className="plan-price">{price}</div>
      {subtitle && <p className="plan-subtitle">{subtitle}</p>}

      <ul>
        {features.map((feature, index) => (
          <li key={index}>{feature.text}</li>
        ))}
      </ul>

      <button>Découvrir le programme</button>
    </article>
  );
};

export default PricingCard;
