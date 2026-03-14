import type { FC } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { authApi } from '../../features/auth/services/authApi';
import { useAuthStore } from '../../store/authStore';
import { ROUTES } from '../../shared/constants/routes';
import { adminNavItems } from '../../shared/constants/adminNavItems';
import { ASSETS } from '../../shared/constants/assets';

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
    navigate(ROUTES.login);
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__logo">
        <img src={ASSETS.adminLogo} alt="MA Santé Assurance" />
      </div>

      <nav className="admin-sidebar__nav">
        {adminNavItems.map((item) => (
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
              src={ASSETS.adminAvatar}
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
