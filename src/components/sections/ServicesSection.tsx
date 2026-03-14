import type { FC } from 'react';
import PricingCard from '../common/PricingCard';
import { plans } from '../../features/packs/data/plans';

const ServicesSection: FC = () => {
  return (
    <section id="services" className="services">
      <div className="services-inner">
        <h2>Services offerts</h2>

        <div className="plans">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
