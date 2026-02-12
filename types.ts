export interface Emission {
  id: string;
  source: string;
  concentration: number;
  massFlowRate: number;
  timestamp: string;
}

export interface TechnicalAsset {
  id: string; // The Technical ID (e.g., CEN-DUC-GSD...)
  description: string; // User Denomination (e.g., TED PARQUE INDUSTRIAL...)
  classType: string; // Clase (e.g., TED, VT)
  coordinates: string; // Coordenadas
  completed: boolean;
  observations?: string;
  emissions?: Emission[];
}

export interface DaySchedule {
  day: number;
  assets: TechnicalAsset[];
}