import type { FC } from 'react';
import HeroBg from '../../assets/images/hero-bg.png';

const HeroSection: FC = () => {
  return (
    <section id="accueil" className="hero">
      <div className="frame">
        <div
          className="hero-bg"
          style={{
            backgroundImage: `url(${HeroBg})`,
          }}
        >
          <div className="hero-overlay" />

          <div className="hero-content">
            <h1>MA Santé Assurance</h1>
            <p>Votre couverture santé, simple et accessible.</p>
            <button className="btn-hero">S’inscrire</button>
          </div>

          <div className="hero-notch" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
