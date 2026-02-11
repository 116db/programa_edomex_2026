export interface TechnicalAsset {
  id: string; // The Technical ID (e.g., CEN-DUC-GSD...)
  description: string; // User Denomination (e.g., TED PARQUE INDUSTRIAL...)
  classType: string; // Clase (e.g., TED, VT)
  coordinates: string; // Coordenadas
  completed: boolean;
}

export interface DaySchedule {
  day: number;
  assets: TechnicalAsset[];
}