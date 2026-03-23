import type { FC } from 'react';
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AuthGuard from '../../shared/components/AuthGuard';
import PageLoader from '../../shared/components/PageLoader';
import { ROUTES } from '../../shared/constants/routes';

const HomePage = lazy(() => import('../../pages/HomePage'));
const LoginPage = lazy(() => import('../../pages/LoginPage'));
const RegisterPage = lazy(() => import('../../pages/RegisterPage'));
const OtpVerificationPage = lazy(() => import('../../pages/OtpVerificationPage'));
const OtpSuccessPage = lazy(() => import('../../pages/OtpSuccessPage'));
const ClientSpacePage = lazy(() => import('../../client/pages/ClientSpacePage'));
const DashboardPage = lazy(() => import('../../admin/pages/DashboardPage'));
const GestionClientsPage = lazy(() => import('../../admin/pages/GestionClientsPage'));
const GestionAgentsPage = lazy(() => import('../../admin/pages/GestionAgentsPage'));
const PartenairesListPage = lazy(() => import('../../features/partenaires/pages/PartenairesListPage'));
const PacksListPage = lazy(() => import('../../features/packs/pages/PacksListPage'));
const RapportPage = lazy(() => import('../../admin/pages/RapportPage'));
const AgentDashboardPage = lazy(() => import('../../agent/pages/AgentDashboardPage'));
const AgentAjouterClientPage = lazy(() => import('../../agent/pages/AgentAjouterClientPage'));
const AgentGestionClientsPage = lazy(() => import('../../agent/pages/AgentGestionClientsPage'));
const AdminLayout = lazy(() => import('../../admin/layout/AdminLayout'));
const AgentLayout = lazy(() => import('../../agent/layout/AgentLayout'));

const AppRouter: FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path={ROUTES.home} element={<HomePage />} />
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.register} element={<RegisterPage />} />
        <Route path={ROUTES.registerOtp} element={<OtpVerificationPage />} />
        <Route path={ROUTES.registerOtpSuccess} element={<OtpSuccessPage />} />

        <Route
          path={ROUTES.client}
          element={
            <AuthGuard allow={['client']}>
              <ClientSpacePage />
            </AuthGuard>
          }
        />

        <Route
          path={ROUTES.agent}
          element={
            <AuthGuard allow={['agent']}>
              <AgentLayout />
            </AuthGuard>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AgentDashboardPage />} />
          <Route path="ajouter-client" element={<AgentAjouterClientPage />} />
          <Route path="gestion-clients" element={<AgentGestionClientsPage />} />
        </Route>

        <Route
          path={ROUTES.admin}
          element={
            <AuthGuard allow={['admin']}>
              <AdminLayout />
            </AuthGuard>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="gestion-clients" element={<GestionClientsPage />} />
          <Route path="overview" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="gestion-agents" element={<GestionAgentsPage />} />
          <Route path="gestion-partenaires" element={<PartenairesListPage />} />
          <Route path="gestion-formules" element={<PacksListPage />} />
          <Route path="rapport" element={<RapportPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
