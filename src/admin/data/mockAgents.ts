export interface Agent {
  id: string;
  matricule: string;
  prenom: string;
  nom: string;
  telephone: string;
  statut: 'Active' | 'Inactif' | 'Suspendu';
  avatar: string;
}

export const mockAgents: Agent[] = [
  {
    id: '1',
    matricule: 'MA-8218992',
    prenom: 'Prenom',
    nom: 'NOM',
    telephone: '783783434',
    statut: 'Active',
    avatar: '/admin/avatar-1.jpg',
  },
  {
    id: '2',
    matricule: 'MA-8218992',
    prenom: 'Prenom',
    nom: 'NOM',
    telephone: '781234567',
    statut: 'Active',
    avatar: '/admin/avatar-2.jpg',
  },
  {
    id: '3',
    matricule: 'MA-8218992',
    prenom: 'Prenom',
    nom: 'NOM',
    telephone: '701234567',
    statut: 'Active',
    avatar: '/admin/avatar-3.jpg',
  },
  {
    id: '4',
    matricule: 'MA-8218992',
    prenom: 'Prenom',
    nom: 'NOM',
    telephone: '761234567',
    statut: 'Active',
    avatar: '/admin/avatar-4.jpg',
  },
];
