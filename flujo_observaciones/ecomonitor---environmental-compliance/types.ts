
export interface Emission {
  id: string;
  source: string;
  concentration: number;
  massFlowRate: number;
  timestamp: string;
}

export interface ReportState {
  observations: string;
  emissions: Emission[];
}
