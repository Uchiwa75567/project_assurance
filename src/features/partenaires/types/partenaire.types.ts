export interface Partenaire {
  id: string;
  userId?: string | null;
  nom: string;
  type: string;
  adresse: string;
  telephone: string;
  latitude: number;
  longitude: number;
  distanceKm?: number | null;
  actif: boolean;
}
