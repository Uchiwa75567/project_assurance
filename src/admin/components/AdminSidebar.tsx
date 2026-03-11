import type { FC } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { authApi } from '../../features/auth/services/authApi';
import { useAuthStore } from '../../store/authStore';

interface NavItem {
  label: string;
  to: string;
  icon: string;
  iconAlt: string;
  /** true = icon file already includes its own gray rounded background */
  selfContained: boolean;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    to: '/admin/dashboard',
    icon: '/admin/icon-dashboard-grid.svg',
    iconAlt: 'dashboard',
    selfContained: false,
  },
  {
    label: 'Gestion des clients',
    to: '/admin/gestion-clients',
    icon: '/admin/icon-nav-clients.svg',
    iconAlt: 'clients',
    selfContained: true,
  },
  {
    label: 'Gestion des agents',
    to: '/admin/gestion-agents',
    icon: '/admin/icon-nav-agents.svg',
    iconAlt: 'agents',
    selfContained: false,
  },
  {
    label: 'Gestion des partenaires',
    to: '/admin/gestion-partenaires',
    icon: '/admin/icon-nav-partners.svg',   // raw monochrome cross-in-square icon
    iconAlt: 'partenaires',
    selfContained: false,
  },
  {
    label: 'Gestion des formules',
    to: '/admin/gestion-formules',
    icon: '/admin/icon-nav-partners.svg',   // same cross-in-square for formules
    iconAlt: 'formules',
    selfContained: false,
  },
  {
    label: 'Rapport',
    to: '/admin/rapport',
    icon: '/admin/icon-pdf.svg',
    iconAlt: 'rapport',
    selfContained: false,
  },
];

const AdminSidebar: FC = () => {
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
    <aside className="admin-sidebar">
      <div className="admin-sidebar__logo">
        <img src="/admin/logo.png" alt="MA Santé Assurance" />
      </div>

      <nav className="admin-sidebar__nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? 'admin-nav-item admin-nav-item--active' : 'admin-nav-item'
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <span className="admin-nav-item__bar" />}

                {item.selfContained ? (
                  /* Self-contained icon: already has gray rounded bg */
                  <img
                    src={item.icon}
                    alt={item.iconAlt}
                    className="admin-nav-item__icon admin-nav-item__icon--contained"
                  />
                ) : (
                  /* Raw monochrome icon: wrap in gray tile; invert to white when active */
                  <span
                    className={
                      isActive
                        ? 'admin-nav-item__icon-wrap admin-nav-item__icon-wrap--active'
                        : 'admin-nav-item__icon-wrap'
                    }
                  >
                    <img
                      src={item.icon}
                      alt={item.iconAlt}
                      className={
                        isActive
                          ? 'admin-nav-item__icon admin-nav-item__icon--raw admin-nav-item__icon--raw-active'
                          : 'admin-nav-item__icon admin-nav-item__icon--raw'
                      }
                    />
                  </span>
                )}

                <span className="admin-nav-item__label">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar__bottom">
        <div className="admin-sidebar__user-card">
          <div className="admin-sidebar__profile">
            <img
              src="/admin/mark-john.png"
              alt="Mark John"
              className="admin-sidebar__avatar"
            />
            <p className="admin-sidebar__user-name">Mark John</p>
            <p className="admin-sidebar__user-role">Insurance officer</p>
          </div>

          <button className="admin-sidebar__logout" onClick={handleLogout}>
            <span>Logout</span>
            <img src="/admin/icon-logout.svg" alt="logout" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
