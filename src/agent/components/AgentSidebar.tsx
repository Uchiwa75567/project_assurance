import type { FC } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { authApi } from '../../features/auth/services/authApi';
import { useAuthStore } from '../../store/authStore';

interface NavItem {
  label: string;
  to: string;
  icon: string;
  iconAlt: string;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    to: '/agent/dashboard',
    icon: '/agent/icon-dashboard.svg',
    iconAlt: 'dashboard',
  },
  {
    label: 'Ajouter un client',
    to: '/agent/ajouter-client',
    icon: '/agent/icon-add-client.svg',
    iconAlt: 'ajouter client',
  },
  {
    label: 'Gestion des clients',
    to: '/agent/gestion-clients',
    icon: '/agent/icon-manage-clients.svg',
    iconAlt: 'gestion clients',
  },
];

const AgentSidebar: FC = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore logout API errors
    }
    logout();
    navigate('/connexion');
  };

  return (
    <aside className="agent-sidebar">
      <div className="agent-sidebar__logo">
        <img src="/admin/logo.png" alt="MA Santé Assurance" />
      </div>

      <nav className="agent-sidebar__nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? 'agent-nav-item agent-nav-item--active' : 'agent-nav-item'
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <span className="agent-nav-item__bar" />}
                <span
                  className={
                    isActive
                      ? 'agent-nav-item__icon-wrap agent-nav-item__icon-wrap--active'
                      : 'agent-nav-item__icon-wrap'
                  }
                >
                  <img
                    src={item.icon}
                    alt={item.iconAlt}
                    className="agent-nav-item__icon"
                  />
                </span>
                <span className="agent-nav-item__label">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="agent-sidebar__bottom">
        <div className="agent-sidebar__profile-wrap">
          <img
            src="/agent/mark-john.png"
            alt="Mark John"
            className="agent-sidebar__avatar"
          />
        </div>
        <div className="agent-sidebar__user-card">
          <p className="agent-sidebar__user-name">Mark John</p>
          <p className="agent-sidebar__user-role">Insurance officer</p>
          <button className="agent-sidebar__logout" onClick={handleLogout}>
            <span>Log out</span>
            <img src="/agent/icon-logout.svg" alt="logout" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AgentSidebar;
