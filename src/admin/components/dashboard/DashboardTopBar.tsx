import type { FC } from 'react';

interface DashboardTopBarProps {
  search: string;
  onSearchChange: (v: string) => void;
}

const DashboardTopBar: FC<DashboardTopBarProps> = ({ search, onSearchChange }) => {
  return (
    <div className="dash-topbar">
      {/* Date */}
      <div className="dash-topbar__date">
        <img src="/admin/icon-calendar-date.png" alt="calendar" className="dash-topbar__date-icon" />
        <span className="dash-topbar__date-text">2 September</span>
      </div>

      {/* Search */}
      <div className="dash-topbar__search">
        <img src="/admin/icon-search.png" alt="search" className="dash-topbar__search-icon" />
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="dash-topbar__search-input"
        />
      </div>

      {/* Notification */}
      <button className="dash-topbar__notif" aria-label="Notifications">
        <img src="/admin/icon-notification.png" alt="notification" className="dash-topbar__notif-icon" />
      </button>
    </div>
  );
};

export default DashboardTopBar;
