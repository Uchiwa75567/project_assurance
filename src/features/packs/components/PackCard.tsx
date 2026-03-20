import type { FC } from 'react';
import type { Pack } from '../types/pack.types';

interface PackCardProps {
  pack: Pack;
  onModifier?: (pack: Pack) => void;
}

const DEFAULT_FEATURES = [
  'Consultations générales',
  'Médicaments de base',
  'Prévention (contrôle santé)',
  'Accès site web',
  'ID assurance numérique',
];

const PackCard: FC<PackCardProps> = ({ pack, onModifier }) => {
  const features = DEFAULT_FEATURES;

  const formattedPrice = new Intl.NumberFormat('fr-FR').format(pack.prix);

  return (
    <article className="pack-card" aria-label={`Formule ${pack.nom}`}>
      <h3 className="pack-card__title">{pack.nom}</h3>
      <p className="pack-card__description">{pack.description}</p>

      <p className="pack-card__price">
        {formattedPrice} <span className="pack-card__currency">FCFA</span>
      </p>

      <div className="pack-card__stats">
        <span className="pack-card__stat">
          <img src="/admin/icon-clock.svg" alt="" className="pack-card__stat-icon" aria-hidden="true" />
          8h de vidéos
        </span>
        <span className="pack-card__stat">
          <img src="/admin/icon-students.svg" alt="" className="pack-card__stat-icon" aria-hidden="true" />
          2.5K étudiants
        </span>
      </div>

      <ul className="pack-card__features" aria-label="Couvertures incluses">
        {features.map((feature) => (
          <li key={feature} className="pack-card__feature">
            <span className="pack-card__check" aria-hidden="true">✓</span>
            {feature}
          </li>
        ))}
      </ul>

      <button
        className="pack-card__modifier-btn"
        onClick={() => onModifier?.(pack)}
        aria-label={`Modifier la formule ${pack.nom}`}
      >
        Modifier
      </button>
    </article>
  );
};

export default PackCard;
