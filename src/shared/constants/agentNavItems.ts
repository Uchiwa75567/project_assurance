import { ROUTES } from './routes';

export const agentNavItems = [
  {
    label: 'Dashboard',
    to: ROUTES.agentDashboard,
    icon: '/agent/icon-dashboard.svg',
    iconAlt: 'dashboard',
  },
  {
    label: 'Ajouter un client',
    to: ROUTES.agentAddClient,
    icon: '/agent/icon-add-client.svg',
    iconAlt: 'ajouter client',
  },
  {
    label: 'Gestion des clients',
    to: ROUTES.agentManageClients,
    icon: '/agent/icon-manage-clients.svg',
    iconAlt: 'gestion clients',
  },
];
