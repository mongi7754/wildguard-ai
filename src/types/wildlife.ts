// Wildlife and threat data types

export interface WildlifeSpecies {
  id: string;
  name: string;
  scientificName: string;
  conservationStatus: 'LC' | 'NT' | 'VU' | 'EN' | 'CR';
  count: number;
  lastSeen: Date;
  location: { lat: number; lng: number };
}

export interface ThreatAlert {
  id: string;
  type: 'poacher' | 'vehicle' | 'fire' | 'intrusion' | 'acoustic' | 'environmental';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: { lat: number; lng: number };
  timestamp: Date;
  status: 'active' | 'investigating' | 'resolved';
  assignedTo?: string;
}

export interface DroneStatus {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'charging' | 'maintenance';
  battery: number;
  location: { lat: number; lng: number };
  altitude: number;
  speed: number;
  mission?: string;
  thermalMode: boolean;
  nightVision: boolean;
}

export interface RangerTeam {
  id: string;
  name: string;
  members: number;
  status: 'patrol' | 'standby' | 'responding' | 'off-duty';
  location: { lat: number; lng: number };
  currentMission?: string;
}

export interface AnimalTracking {
  id: string;
  animalId: string;
  species: string;
  name?: string;
  tagType: 'GPS' | 'RFID' | 'Visual';
  lastPing: Date;
  locations: Array<{ lat: number; lng: number; timestamp: Date }>;
  healthStatus: 'healthy' | 'injured' | 'unknown';
  predictedPath?: Array<{ lat: number; lng: number }>;
}

export interface EnvironmentData {
  temperature: number;
  humidity: number;
  airQuality: number;
  fireRisk: 'low' | 'moderate' | 'high' | 'extreme';
  rainfall: number;
  windSpeed: number;
}

export interface DetectionResult {
  id: string;
  type: 'wildlife' | 'threat' | 'vehicle' | 'human';
  confidence: number;
  label: string;
  boundingBox: { x: number; y: number; width: number; height: number };
  timestamp: Date;
}

export interface UserRole {
  id: string;
  role: 'ranger' | 'analyst' | 'admin' | 'drone_operator';
  permissions: string[];
}
