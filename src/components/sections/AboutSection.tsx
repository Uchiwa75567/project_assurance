import type { FC } from 'react';
import AboutImage from '../../assets/images/about-hands-circle.png';

const AboutSection: FC = () => {
  return (
    <section id="apropos" className="about">
      <div className="frame">
        <h2>
          A propos de <span>M&A Santé Assurance</span>
        </h2>

        <div className="about-grid">
          <div>
            <p className="about-text">
              M&A Santé Assurance est une solution digitale conçue pour rendre l'assurance santé plus
              simple et accessible aux populations sénégalaises. Grâce à une application mobile et une
              plateforme web sécurisée, les utilisateurs peuvent s'inscrire, payer et suivre leur
              couverture santé facilement. Le système est piloté depuis le Canada et connecté à des
              partenaires de santé locaux pour garantir fiabilité et transparence.
            </p>

            <div className="stats">
              <div className="stat stat-dark">
                <strong>+10</strong>
                <span>Structures de santé partenaires</span>
              </div>

              <div className="stat">
                <strong>24/7</strong>
                <span>Accès à votre espace santé</span>
              </div>

              <div className="stat">
                <strong>100%</strong>
                <span>Plateforme digitale sécurisée</span>
              </div>
            </div>
          </div>

          <div className="about-image-wrap">
            <img src={AboutImage} alt="MA Santé Assurance" className="about-image" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
