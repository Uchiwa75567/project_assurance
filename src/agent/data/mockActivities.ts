export interface Activity {
  id: string;
  avatar: string;
  prenom: string;
  nom: string;
  typeAssurance: string;
  statut: string;
}

export const mockActivities: Activity[] = [
  {
    id: '1',
    avatar: '/agent/avatar-1.jpg',
    prenom: 'Prenom',
    nom: 'NOM',
    typeAssurance: 'Pack Noppalé Santé',
    statut: 'En attente',
  },
  {
    id: '2',
    avatar: '/agent/avatar-2.jpg',
    prenom: 'Prenom',
    nom: 'NOM',
    typeAssurance: 'Pack Yaay ak Ndaw',
    statut: 'En attente',
  },
  {
    id: '3',
    avatar: '/agent/avatar-3.jpg',
    prenom: 'Prenom',
    nom: 'NOM',
    typeAssurance: 'Pack Kër Yaram',
    statut: 'En attente',
  },
];
