import type { FC } from 'react';
import FacebookIcon from '../../assets/icons/facebook.svg?react';
import TwitterIcon from '../../assets/icons/twitter.svg?react';
import LinkedInIcon from '../../assets/icons/linkedin.svg?react';

const Footer: FC = () => {
  return (
    <footer className="footer">
      <div className="footer-cta">
        <div className="frame footer-cta-inner">
          <div>
            <h3>Décrivez votre besoin, nous construisons votre protection.</h3>
            <p>Nous sommes là pour facilité votre santé.</p>
          </div>
          <button>Contactez-nous →</button>
        </div>
      </div>

      <div className="footer-main">
        <div className="frame">
          <div className="footer-grid">
            <div>
              <p className="brand-text">M&A Santé Assurance - La santé simplifiée, pour tous</p>
              <div className="socials">
                <a href="#">
                  <FacebookIcon />
                </a>
                <a href="#">
                  <TwitterIcon />
                </a>
                <a href="#">
                  <LinkedInIcon />
                </a>
              </div>
            </div>

            <div>
              <h4>Services Offert</h4>
              <ul>
                <li>Blog</li>
                <li>Documentation</li>
                <li>Communauté</li>
                <li>FAQ</li>
              </ul>
            </div>

            <div>
              <h4>Entreprise</h4>
              <ul>
                <li>Accueil</li>
                <li>A propos</li>
                <li>Contact</li>
                <li>Presse</li>
              </ul>
            </div>
          </div>

          <div className="newsletter">
            <h4>Restez informé</h4>
            <p>Recevez nos dernières actualités et offres exclusives.</p>
            <div className="newsletter-row">
              <input type="email" placeholder="Votre email" />
              <button>S'inscrire</button>
            </div>
          </div>

          <div className="legal">
            <p>© 2026 . M&A Santé Assurance Tous droits réservés.</p>
            <div>
              <span>Politique de confidentialité</span>
              <span>CGV</span>
              <span>Mentions légales</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
