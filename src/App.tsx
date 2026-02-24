import type { FC } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminLayout from './admin/layout/AdminLayout';
import GestionClientsPage from './admin/pages/GestionClientsPage';
import GestionAgentsPage from './admin/pages/GestionAgentsPage';
import { useAuthStore } from './store/authStore';

const RequireAdmin: FC<{ children: React.ReactNode }> = ({ children }) => {
  const role = useAuthStore((s) => s.role);
  if (role !== 'admin') return <Navigate to="/connexion" replace />;
  return <>{children}</>;
};

const App: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/connexion" element={<LoginPage />} />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<Navigate to="gestion-clients" replace />} />
        <Route path="gestion-clients" element={<GestionClientsPage />} />
        {/* Placeholder routes – add pages later */}
        <Route path="overview" element={<GestionClientsPage />} />
        <Route path="gestion-agents" element={<GestionAgentsPage />} />
        <Route path="gestion-partenaires" element={<GestionClientsPage />} />
        <Route path="gestion-formules" element={<GestionClientsPage />} />
        <Route path="rapport" element={<GestionClientsPage />} />
      </Route>
    </Routes>
  );
};

export default App;
