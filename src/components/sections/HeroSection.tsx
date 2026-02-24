import type { FC } from 'react';
import HeroBg from '../../assets/images/hero-bg.png';

const HeroSection: FC = () => {
  return (
    <section id="accueil" className="px-4 pb-8 pt-2 md:px-8 lg:px-10">
      <div className="mx-auto max-w-[1220px]">
        <div
          className="relative overflow-hidden rounded-[22px] min-h-[360px] md:min-h-[420px]"
          style={{
            backgroundImage: `url(${HeroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#031120]/90 via-[#031120]/62 to-[#031120]/20" />

          <div className="relative z-10 flex h-full max-w-[520px] flex-col justify-center px-7 py-10 md:px-12 md:py-14">
            <h1 className="text-4xl font-extrabold tracking-[0.4px] text-white md:text-[56px] md:leading-[1.02]">
              MA Santé Assurance
            </h1>
            <p className="mt-6 text-3xl font-bold leading-tight text-white md:text-[41px] md:leading-[1.04]">
              Votre couverture santé, simple et accessible.
            </p>
            <button className="mt-10 w-fit rounded-[10px] bg-white px-7 py-3 text-[19px] font-bold text-[#032a57] transition hover:bg-[#f5f7fb]">
              S’inscrire
            </button>
          </div>

          <div className="absolute -bottom-5 left-1/2 h-10 w-20 -translate-x-1/2 rounded-b-[20px] bg-[#07192b]" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
