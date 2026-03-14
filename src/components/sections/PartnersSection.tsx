import type { FC } from 'react';
import Partner1 from '../../assets/partners/logoipsum-1.svg?react';
import Partner2 from '../../assets/partners/logoipsum-2.svg?react';
import Partner3 from '../../assets/partners/lapsim.svg?react';
import Partner4 from '../../assets/partners/logoipsum-3.svg?react';
import Partner5 from '../../assets/partners/logoipsum-4.svg?react';

const PartnersSection: FC = () => {
  return (
    <section className="partners">
      <div className="frame">
        <h2>Nos partenaires</h2>

        <div className="partner-logos">
          <Partner1 />
          <Partner2 />
          <Partner3 />
          <Partner4 />
          <Partner5 />
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
