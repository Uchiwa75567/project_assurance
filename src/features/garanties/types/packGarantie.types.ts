export interface PackGarantie {
  id: string;
  packId: string;
  garantieId: string;
  garantieLibelle: string;
  garantieDescription?: string | null;
  garantiePlafond?: number | null;
  plafondSpecifique?: number | null;
}
