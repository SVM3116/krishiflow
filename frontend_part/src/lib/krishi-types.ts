export type SoilType = "Red" | "Black Cotton" | "Loam" | "Sandy" | "Clay";
export type Water = "Low" | "Medium" | "High";
export type Season = "Kharif" | "Rabi" | "Zaid";

export interface FarmInput {
  farmName: string;
  landArea: number;
  district: string;
  state: string;
  soilType: SoilType;
  water: Water;
  season: Season;
  budget: number;
}

export interface ZoneSeason {
  cropPair: [string, string];
  plantingMonth: string;
  harvestMonths: string[];
  expectedIncome: number;
  expectedRevenue?: number;
  expectedExpense?: number;
}

export interface Zone {
  id: string;
  name: string;
  area: number;
  color: string;
  seasons: {
    kharif: ZoneSeason;
    rabi: ZoneSeason;
    zaid: ZoneSeason;
  };
}

export interface MonthlyIncome {
  month: string;
  traditional: number;
  krishiflow: number;
  revenue?: number;
  expenses?: number;
  zoneBreakdown?: Record<string, {
    revenue: number;
    expenses: number;
    netProfit: number;
  }>;
}

export interface CropRecommendation {
  crop: string;
  partner: string;
  why: string;
  traditionalWisdom: string;
  yieldPerAcre: string;
  marketPrice: string;
}

export interface Scores {
  incomeStability: number;
  sustainability: number;
  biodiversity: number;
  riskMitigation: number;
}

export interface WeatherDay {
  day: string;
  temp: number;
  rain: number;
  icon: string;
  condition: string;
}

export interface TimelineItem {
  month: string;
  zone: string;
  action: string;
  detail: string;
}

export interface MonitorUpdate {
  id: string;
  createdAt: string;
  zoneId: string;
  status: "Good" | "Normal" | "Needs Attention";
  updateType: "Stage Log" | "Input Applied" | "Stress Alert";
  description: string;
  appliedInputs?: string[];
}

export interface FarmPlan {
  id: string;
  createdAt: string;
  input: FarmInput;
  zones: Zone[];
  monthly: MonthlyIncome[];
  recommendations: CropRecommendation[];
  scores: Scores;
  weather: WeatherDay[];
  advisory: string;
  timeline: TimelineItem[];
  totals: { annualRevenue: number; netProfit: number; activeMonths: number };
  isActive?: boolean;
  activationMonth?: string;
  monitorUpdates?: MonitorUpdate[];
  completedTasks?: string[];
  completedTimelineItems?: string[];
}