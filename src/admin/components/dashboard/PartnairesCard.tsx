import type { FC } from 'react';

const partners = [
  { id: '1', name: 'Lorem Ipsum lorem' },
  { id: '2', name: 'Lorem Ipsum lorem' },
  { id: '3', name: 'Lorem Ipsum lorem' },
  { id: '4', name: 'Lorem Ipsum lorem' },
  { id: '5', name: 'Lorem Ipsum lorem' },
  { id: '6', name: 'Lorem Ipsum lorem' },
  { id: '7', name: 'Lorem Ipsum lorem' },
  { id: '8', name: 'Lorem Ipsum lorem' },
];

const PartnairesCard: FC = () => {
  return (
    <div className="dash-partners-card">
      {/* Header */}
      <div className="dash-partners-card__header">
        <span className="dash-partners-card__title-pill">Partenaires</span>
        <img src="/admin/icon-hospital.svg" alt="hospital" className="dash-partners-card__hospital-icon" />
      </div>

      {/* List */}
      <ul className="dash-partners-card__list">
        {partners.map((p) => (
          <li key={p.id} className="dash-partners-card__item">
            <span className="dash-partners-card__item-name">{p.name}</span>
            <button className="dash-partners-card__item-menu" aria-label="options">
              <img src="/admin/icon-three-dots.svg" alt="menu" className="dash-partners-card__dots" />
            </button>
          </li>
        ))}
      </ul>

      {/* Footer button */}
      <button className="dash-partners-card__voir-btn">voir tous</button>
    </div>
  );
};

export default PartnairesCard;
