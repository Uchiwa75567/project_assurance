import type { FC } from 'react';
import AboutImage from '../../assets/images/logo.png';

const AboutSection: FC = () => {
  return (
    <section id="apropos" className="px-4 pb-10 pt-10 md:px-8 lg:px-10">
      <div className="mx-auto max-w-[1220px]">
        <h2 className="text-[28px] font-extrabold uppercase tracking-[-0.8px] text-[#070b14] md:text-[49px] md:leading-none">
          A propos de <span className="text-[#0d74cf]">M&A Santé Assurance</span>
        </h2>

        <div className="mt-8 grid gap-7 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <p className="max-w-[670px] text-[14px] leading-[1.55] text-[#151b25] md:text-[18px]">
              M&A Santé Assurance est une solution digitale conçue pour rendre l'assurance santé plus
              simple et accessible aux populations sénégalaises. Grâce à une application mobile et une
              plateforme web sécurisée, les utilisateurs peuvent s'inscrire, payer et suivre leur
              couverture santé facilement. Le système est piloté depuis le Canada et connecté à des
              partenaires de santé locaux pour garantir fiabilité et transparence.
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-[#06152f] px-5 py-5 text-center text-white">
                <p className="text-4xl font-extrabold text-[#0d74cf]">+10</p>
                <p className="mt-2 text-sm font-medium leading-snug">Structures de santé partenaires</p>
              </div>

              <div className="rounded-2xl bg-white px-5 py-5 text-center shadow-[0_2px_8px_rgba(6,21,47,0.08)]">
                <p className="text-4xl font-extrabold text-[#06152f]">24/7</p>
                <p className="mt-2 text-sm font-medium leading-snug text-[#102540]">Accès à votre espace santé</p>
              </div>

              <div className="rounded-2xl bg-white px-5 py-5 text-center shadow-[0_2px_8px_rgba(6,21,47,0.08)]">
                <p className="text-4xl font-extrabold text-[#06152f]">100%</p>
                <p className="mt-2 text-sm font-medium leading-snug text-[#102540]">Plateforme digitale sécurisée</p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_4px_16px_rgba(6,21,47,0.1)]">
            <img
              src={AboutImage}
              alt="MA Santé Assurance"
              className="h-full min-h-[280px] w-full object-cover mix-blend-screen"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
