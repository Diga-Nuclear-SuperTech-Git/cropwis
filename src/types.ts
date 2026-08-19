export type Language = 'en' | 'hi';

export type NavSection = 'dashboard' | 'disease-check' | 'weather' | 'news' | 'crop-advisory' | 'kisan-assistant';

// Disease Check Types
export interface OrganicTreatment {
  name: string;
  recipeOrMethod: string;
  applicationFrequency: string;
}

export interface ChemicalTreatment {
  chemicalName: string;
  dosage: string;
  safetyPrecautions: string;
}

export interface DiseaseAnalysisResult {
  cropName: string;
  diseaseName: string;
  hindiName?: string;
  confidenceScore: number;
  severityLevel: 'Low' | 'Moderate' | 'Severe' | 'Critical';
  symptomsIdentified: string[];
  primaryCause: 'Fungal' | 'Bacterial' | 'Viral' | 'Pest/Insect' | 'Nutrient Deficiency' | 'Environmental Stress' | 'Healthy / No Disease';
  detailedExplanation: string;
  immediateAction: string[];
  organicTreatments: OrganicTreatment[];
  chemicalTreatments: ChemicalTreatment[];
  preventativeMeasures: string[];
  yieldImpact: string;
  imageUrl?: string;
}

// Weather Types
export interface FarmAlert {
  id: string;
  level: 'critical' | 'warning' | 'advisory';
  title: string;
  description: string;
  impactOnCrops: string;
  actionRequired: string;
}

export interface DayForecast {
  day: string;
  date: string;
  tempRange: string;
  condition: string;
  rainfallRisk: string;
  sprayingAdvice: string;
  irrigationAdvice: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface WeatherData {
  location: string;
  coordinates?: { lat: number; lng: number };
  current: {
    temp: string;
    feelsLike?: string;
    condition: string;
    humidity: string;
    windSpeed: string;
    rainfallRisk: string;
    uvIndex: string;
    soilMoistureEstimate: string;
    sunHours?: string;
  };
  farmAlerts: FarmAlert[];
  weeklyFarmingOutlook: DayForecast[];
  agriTips: string[];
  groundingSources?: GroundingSource[];
  lastUpdated: string;
}

// News Types
export interface AgriNewsItem {
  id: string;
  title: string;
  summary: string;
  category: 'schemes' | 'mandi-prices' | 'weather-impact' | 'tech-innovations' | 'policy' | 'general';
  keyTakeawayForFarmers: string;
  region: string;
  date: string;
  source: string;
  sourceUrl?: string;
  tags?: string[];
}

export interface AgriNewsResponse {
  newsList: AgriNewsItem[];
  marketTrendsSummary: string;
  groundingSources?: GroundingSource[];
  lastUpdated: string;
}

// Crop Advisory Types
export interface CropRecommendation {
  rank: number;
  cropName: string;
  hindiName?: string;
  suitabilityScore: number; // 0-100
  reasonForRecommendation: string;
  expectedYield: string;
  estimatedRevenueOrRoi: string;
  growthDurationDays: string;
  waterRequirement: 'Low' | 'Medium' | 'High';
  riskLevel: 'Low' | 'Moderate' | 'High';
  idealSowingTime: string;
  keyVarieties: string[];
}

export interface FertilizerPlan {
  stage: string;
  fertilizer: string;
  applicationMethod: string;
  organicAlternative?: string;
}

export interface CropAdvisoryResponse {
  topRecommendations: CropRecommendation[];
  soilPreparationSteps: string[];
  cropRotationStrategy: string;
  companionOrIntercropping: string[];
  fertilizerAndNutrientPlan: FertilizerPlan[];
  irrigationSchedule: string;
  marketOpportunities: string;
  expertSummary: string;
  warnings?: string[];
}

export interface AdvisoryInput {
  soilType: string;
  regionState: string;
  district?: string;
  season: string;
  landSize: string;
  landUnit: 'Acres' | 'Hectares' | 'Bigha' | 'Guntha';
  irrigationType: string;
  budgetLevel: 'Low' | 'Medium' | 'High';
  currentPreviousCrop: string;
  farmingGoal: 'Maximum Profit' | 'Low Water Consumption' | 'Organic Farming' | 'Fast Harvest' | 'Soil Regeneration';
  organicPreference: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: GroundingSource[];
}
