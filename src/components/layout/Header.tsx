import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/logo.png';
import { navLinks } from '../../shared/constants/navLinks';
import { ROUTES } from '../../shared/constants/routes';

const Header: FC = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <a href="#accueil">
        <img src={Logo} alt="MA Santé Assurance" className="logo" />
      </a>

      <nav className="menu">
        {navLinks.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>

      <button onClick={() => navigate(ROUTES.login)} className="btn-login">
        Se Connecter
      </button>
    </header>
  );
};

export default Header;
