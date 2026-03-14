import { ROUTES } from './routes';

export const adminNavItems = [
  {
    label: 'Dashboard',
    to: ROUTES.adminDashboard,
    icon: '/admin/icon-dashboard-grid.svg',
    iconAlt: 'dashboard',
    selfContained: false,
  },
  {
    label: 'Gestion des clients',
    to: ROUTES.adminClients,
    icon: '/admin/icon-nav-clients.svg',
    iconAlt: 'clients',
    selfContained: true,
  },
  {
    label: 'Gestion des agents',
    to: ROUTES.adminAgents,
    icon: '/admin/icon-nav-agents.svg',
    iconAlt: 'agents',
    selfContained: false,
  },
  {
    label: 'Gestion des partenaires',
    to: ROUTES.adminPartners,
    icon: '/admin/icon-nav-partners.svg',
    iconAlt: 'partenaires',
    selfContained: false,
  },
  {
    label: 'Gestion des formules',
    to: ROUTES.adminPacks,
    icon: '/admin/icon-nav-partners.svg',
    iconAlt: 'formules',
    selfContained: false,
  },
  {
    label: 'Rapport',
    to: ROUTES.adminRapport,
    icon: '/admin/icon-pdf.svg',
    iconAlt: 'rapport',
    selfContained: false,
  },
];
