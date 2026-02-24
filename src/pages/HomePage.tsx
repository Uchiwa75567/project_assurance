import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/images/logo.png';
import HeroBg from '../assets/images/hero-bg.png';
import AboutHands from '../assets/images/about-hands-circle.png';
import Partner1 from '../assets/partners/logoipsum-1.svg?react';
import Partner2 from '../assets/partners/logoipsum-2.svg?react';
import Partner3 from '../assets/partners/lapsim.svg?react';
import Partner4 from '../assets/partners/logoipsum-3.svg?react';
import Partner5 from '../assets/partners/logoipsum-4.svg?react';
import PhoneIcon from '../assets/icons/phone.svg?react';
import EmailIcon from '../assets/icons/email.svg?react';
import LocationIcon from '../assets/icons/location.svg?react';
import FacebookIcon from '../assets/icons/facebook.svg?react';
import TwitterIcon from '../assets/icons/twitter.svg?react';
import LinkedInIcon from '../assets/icons/linkedin.svg?react';

const plans = [
  {
    title: 'Pack Noppalé Santé',
    description:
      'Une couverture essentielle axée sur la prévention et les soins de base, idéale pour rester en bonne santé au quotidien à moindre coût.',
    price: '3 900 FCFA',
    features: [
      'Un de aides   M. 25 K étudiants',
      'Soins de consultation',
      'Médicaments de base',
      'Prévention (contrôle santé)',
      'Accès site web',
      'ID assurance numérique',
    ],
  },
  {
    title: 'Pack Teranga Plus',
    description:
      'Une prise en charge santé haut de gamme, avec des soins complets, une assistance permanente et un service VIP dans les meilleures structures.',
    price: '12 900 FCFA',
    subtitle: 'Idéal pour familles et indépendants',
    features: ['Tout inclus', 'Hospitalisation', 'Soins dentaires', 'Vision', 'Assistance santé', 'Service VIP'],
    recommended: true,
  },
  {
    title: 'Pack Yaay ak Ndaw',
    description:
      "Un accompagnement complet pour la maman et l'enfant, de la grossesse à l'accouchement, avec un suivi médical sécurisé et prioritaire.",
    price: '9 900 FCFA',
    features: [
      'Tout le Pack Kër Yaram',
      'Suivi grossesse',
      'Examens prénataux',
      'Accouchement (plafonné)',
      'Priorité en clinique partenaire',
    ],
    recommended: true,
  },
  {
    title: 'Pack Kër Yaram',
    description:
      'Une solution pensée pour toute la famille, offrant des soins élargis et un suivi médical continu pour vous et vos proches.',
    price: '5 900 FCFA',
    features: [
      'Tout le Pack Noppalé santé',
      'Plus un Enfants inclus',
      'Soins courants',
      'Médicaments étendus',
      'Suivi médical familial',
    ],
  },
];

const HomePage: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="frame">
        <header className="header">
          <img src={Logo} alt="MA Santé Assurance" className="logo" />

          <nav className="menu" aria-label="Navigation principale">
            <a href="#accueil">Accueil</a>
            <a href="#apropos">A propos</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact</a>
          </nav>

          <button className="btn-login" onClick={() => navigate('/connexion')}>
            Se Connecter
          </button>
        </header>

        <section id="accueil" className="hero">
          <div className="hero-bg" style={{ backgroundImage: `url(${HeroBg})` }}>
            <div className="hero-overlay" />
            <div className="hero-content">
              <h1>MA Santé Assurance</h1>
              <p>Votre couverture santé, simple et accessible.</p>
              <button className="btn-hero">S'inscrire</button>
            </div>
          </div>
        </section>
      </div>

      <section id="apropos" className="about">
        <div className="frame">
          <h2>
            A PROPOS DE <span>M&A Santé Assurance</span>
          </h2>

          <div className="about-grid">
            <div>
              <p className="about-text">
                M&A Santé Assurance est une solution digitale conçue pour rendre l'assurance santé plus simple et
                accessible aux populations sénégalaises. Grâce à une application mobile et une plateforme web sécurisée,
                les utilisateurs peuvent s'inscrire, payer et suivre leur couverture santé facilement. Le système est
                piloté depuis le Canada et connecté à des partenaires de santé locaux pour garantir fiabilité et
                transparence.
              </p>

              <div className="stats">
                <article className="stat stat-dark">
                  <strong>+10</strong>
                  <span>Structures de santé partenaires</span>
                </article>
                <article className="stat">
                  <strong>24/7</strong>
                  <span>Accès à votre espace santé</span>
                </article>
                <article className="stat">
                  <strong>100%</strong>
                  <span>Plateforme digitale sécurisée</span>
                </article>
              </div>
            </div>

            <div className="about-image-wrap">
              <img src={AboutHands} alt="Mains en cercle autour du logo MA Santé Assurance" className="about-image" />
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="services">
        <div className="services-inner">
          <h2>Services offerts</h2>

          <div className="plans">
            {plans.map((plan, index) => (
              <article key={plan.title} className={`plan ${index === 1 || index === 2 ? 'plan-bordered' : ''}`}>
                {plan.recommended && <div className="badge">★ Recommandé</div>}
                <h3>{plan.title}</h3>
                <p className="plan-desc">{plan.description}</p>
                <p className="plan-price">{plan.price}</p>
                {plan.subtitle && <p className="plan-subtitle">{plan.subtitle}</p>}

                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>✓ {feature}</li>
                  ))}
                </ul>

                <button>Découvrir le programme</button>
              </article>
            ))}
          </div>
        </div>
      </section>

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

      <section id="contact" className="contact">
        <div className="frame">
          <h2>Contactez-nous</h2>
          <p className="contact-subtitle">Des questions ou des remarques ? N'hésitez pas à nous écrire !</p>

          <div className="contact-grid">
            <aside className="contact-card">
              <h3>Contact Information</h3>
              <p>Say something to start a live chat!</p>

              <ul>
                <li>
                  <PhoneIcon /> <span>+1012 3456 789</span>
                </li>
                <li>
                  <EmailIcon /> <span>demo@gmail.com</span>
                </li>
                <li>
                  <LocationIcon /> <span>132 Dartmouth Street Boston Massachusetts 02156 United States</span>
                </li>
              </ul>

              <div className="bubble-1" />
              <div className="bubble-2" />
            </aside>

            <form className="contact-form">
              <div className="row">
                <label>
                  <span>First Name</span>
                  <input type="text" />
                </label>
                <label>
                  <span>Last Name</span>
                  <input type="text" placeholder="Doe" />
                </label>
              </div>

              <div className="row">
                <label>
                  <span>Email</span>
                  <input type="email" />
                </label>
                <label>
                  <span>Phone Number</span>
                  <input type="tel" placeholder="+1 012 3456 789" />
                </label>
              </div>

              <label>
                <span>Message</span>
                <textarea rows={2} placeholder="Write your message.." />
              </label>

              <div className="actions">
                <button type="button">Send Message</button>
              </div>
            </form>
          </div>
        </div>
      </section>

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
                  <a href="#" aria-label="Facebook">
                    <FacebookIcon />
                  </a>
                  <a href="#" aria-label="Twitter">
                    <TwitterIcon />
                  </a>
                  <a href="#" aria-label="Linkedin">
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
    </div>
  );
};

export default HomePage;
