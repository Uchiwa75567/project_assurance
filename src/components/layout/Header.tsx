import type { FC } from 'react';
import Logo from '../../assets/images/logo.png';

const Header: FC = () => {
  return (
    <header className="px-4 pt-3 md:px-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-[1220px] items-center justify-between gap-4 py-1">
        <a href="#accueil" className="flex items-center">
          <img
            src={Logo}
            alt="MA Santé Assurance"
            className="h-14 w-20 object-cover object-left mix-blend-screen md:h-16 md:w-24"
          />
        </a>

        <nav className="hidden items-center gap-8 text-[13px] font-medium text-black md:flex">
          <a href="#accueil">Accueil</a>
          <a href="#apropos">A propos</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav>

        <button className="rounded-xl bg-[#032a57] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#04376f] md:px-6">
          Se Connecter
        </button>
      </div>
    </header>
  );
};

export default Header;
