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

export interface CreatePartenairePayload {
  nom: string;
  societe: string;
  adresse: string;
  telephone: string;
}
