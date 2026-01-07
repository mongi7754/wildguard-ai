export interface FireSensor {
  id: string;
  name: string;
  type: 'smoke_camera' | 'ground_sensor' | 'satellite';
  location: { lat: number; lng: number };
  parkId: string;
  status: 'active' | 'triggered' | 'offline' | 'maintenance';
  lastReading: {
    smokeLevel: number; // 0-100
    temperature: number;
    humidity: number;
    windSpeed: number;
    timestamp: string;
  };
  aiConfidence?: number;
}

export interface FireAlert {
  id: string;
  sensorId: string;
  type: 'smoke_detected' | 'high_temperature' | 'fire_confirmed' | 'fire_spreading';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: { lat: number; lng: number };
  parkId: string;
  detectedAt: string;
  aiAnalysis: {
    confidence: number;
    spreadPrediction: string;
    affectedArea: number; // hectares
    estimatedContainmentTime: string;
  };
  escalationStatus: EscalationStep[];
  status: 'active' | 'contained' | 'extinguished' | 'false_alarm';
}

export interface EscalationStep {
  step: number;
  action: string;
  notifiedParties: string[];
  triggeredAt: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export interface FireRiskZone {
  id: string;
  parkId: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'extreme';
  center: { lat: number; lng: number };
  radius: number; // km
  factors: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    vegetationDryness: number;
    historicalIncidents: number;
  };
  prediction: {
    probability: number;
    timeframe: string;
    recommendation: string;
  };
}

export interface WeatherData {
  parkId: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  precipitation: number;
  visibility: number;
  conditions: string;
  forecast: {
    time: string;
    temperature: number;
    conditions: string;
  }[];
}

export interface AnimalTracking {
  id: string;
  species: string;
  name: string;
  collarId: string;
  location: { lat: number; lng: number };
  parkId: string;
  lastUpdate: string;
  speed: number; // km/h
  direction: string;
  healthStatus: 'healthy' | 'concern' | 'critical';
  batteryLevel: number;
}

export interface PoachingRiskZone {
  id: string;
  parkId: string;
  riskLevel: number; // 0-100
  center: { lat: number; lng: number };
  radius: number;
  factors: string[];
  lastIncident?: string;
  patrolRecommendation: string;
}

export interface DroneFeed {
  id: string;
  droneId: string;
  name: string;
  location: { lat: number; lng: number };
  parkId: string;
  status: 'live' | 'offline' | 'recording';
  altitude: number;
  battery: number;
  mission: string;
  streamUrl?: string;
}
