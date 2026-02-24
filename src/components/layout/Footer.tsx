import type { FC } from 'react';
import FacebookIcon from '../../assets/icons/facebook.svg?react';
import TwitterIcon from '../../assets/icons/twitter.svg?react';
import LinkedInIcon from '../../assets/icons/linkedin.svg?react';

const Footer: FC = () => {
  return (
    <footer className="bg-[#090f1f] text-white">
      <div className="bg-[#001830] px-4 py-8 md:px-8 lg:px-10">
        <div className="mx-auto flex w-full max-w-[1220px] flex-col items-center justify-between gap-5 md:flex-row">
          <div>
            <h3 className="text-center text-[22px] font-semibold md:text-left md:text-[38px]">
              Décrivez votre besoin, nous construisons votre protection.
            </h3>
            <p className="mt-1 text-center text-sm text-[#c7d4e5] md:text-left">
              Nous sommes là pour facilité votre santé.
            </p>
          </div>
          <button className="rounded-full bg-white px-7 py-2.5 text-[13px] font-semibold text-[#0d4f8f]">
            Contactez-nous →
          </button>
        </div>
      </div>

      <div className="px-4 pb-8 pt-10 md:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-[1220px]">
          <div className="grid gap-9 md:grid-cols-4">
            <div>
              <p className="max-w-[220px] text-[13px] leading-relaxed text-[#c3c9d6]">
                M&A Santé Assurance - La santé simplifiée, pour tous
              </p>
              <div className="mt-5 flex gap-2.5">
                <a href="#" className="rounded bg-white/10 p-2">
                  <FacebookIcon className="h-3.5 w-3.5 [&_path]:fill-[#d3d8e2]" />
                </a>
                <a href="#" className="rounded bg-white/10 p-2">
                  <TwitterIcon className="h-3.5 w-3.5 [&_path]:fill-[#d3d8e2]" />
                </a>
                <a href="#" className="rounded bg-white/10 p-2">
                  <LinkedInIcon className="h-3.5 w-3.5 [&_path]:fill-[#d3d8e2]" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold">Services Offert</h4>
              <ul className="mt-3 space-y-2 text-[13px] text-[#c3c9d6]">
                <li>Blog</li>
                <li>Documentation</li>
                <li>Communauté</li>
                <li>FAQ</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold">Entreprise</h4>
              <ul className="mt-3 space-y-2 text-[13px] text-[#c3c9d6]">
                <li>Accueil</li>
                <li>A propos</li>
                <li>Contact</li>
                <li>Presse</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold">Restez informé</h4>
              <p className="mt-2 text-[13px] text-[#c3c9d6]">
                Recevez nos dernières actualités et offres exclusives.
              </p>
              <div className="mt-4 flex gap-2">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="w-full rounded-full bg-white/10 px-4 py-2 text-[13px] text-white outline-none placeholder:text-[#aeb8c9]"
                />
                <button className="rounded-full bg-[#1386d8] px-4 py-2 text-[12px] font-semibold">S'inscrire</button>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-4 text-[12px] text-[#c3c9d6] md:flex md:items-center md:justify-between">
            <p>© 2026 . M&A Santé Assurance Tous droits réservés.</p>
            <div className="mt-2 flex gap-5 md:mt-0">
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
