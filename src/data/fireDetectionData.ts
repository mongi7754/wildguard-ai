import { FireSensor, FireAlert, FireRiskZone, WeatherData, AnimalTracking, PoachingRiskZone, DroneFeed } from '@/types/fire';

export const fireSensors: FireSensor[] = [
  {
    id: 'FS001',
    name: 'Mara North Camera',
    type: 'smoke_camera',
    location: { lat: -1.4061, lng: 35.2563 },
    parkId: 'masai-mara',
    status: 'active',
    lastReading: { smokeLevel: 5, temperature: 32, humidity: 45, windSpeed: 12, timestamp: new Date().toISOString() },
    aiConfidence: 98
  },
  {
    id: 'FS002',
    name: 'Amboseli East Sensor',
    type: 'ground_sensor',
    location: { lat: -2.6527, lng: 37.2606 },
    parkId: 'amboseli',
    status: 'triggered',
    lastReading: { smokeLevel: 72, temperature: 38, humidity: 28, windSpeed: 18, timestamp: new Date().toISOString() },
    aiConfidence: 94
  },
  {
    id: 'FS003',
    name: 'Tsavo Satellite Zone',
    type: 'satellite',
    location: { lat: -2.8868, lng: 38.4564 },
    parkId: 'tsavo-east',
    status: 'active',
    lastReading: { smokeLevel: 15, temperature: 35, humidity: 40, windSpeed: 8, timestamp: new Date().toISOString() },
    aiConfidence: 96
  },
  {
    id: 'FS004',
    name: 'Lake Nakuru North',
    type: 'smoke_camera',
    location: { lat: -0.3136, lng: 36.0889 },
    parkId: 'lake-nakuru',
    status: 'active',
    lastReading: { smokeLevel: 3, temperature: 28, humidity: 55, windSpeed: 6, timestamp: new Date().toISOString() },
    aiConfidence: 99
  },
  {
    id: 'FS005',
    name: 'Samburu Central',
    type: 'ground_sensor',
    location: { lat: 0.5707, lng: 37.5312 },
    parkId: 'samburu',
    status: 'active',
    lastReading: { smokeLevel: 8, temperature: 34, humidity: 35, windSpeed: 14, timestamp: new Date().toISOString() },
    aiConfidence: 97
  }
];

export const fireAlerts: FireAlert[] = [
  {
    id: 'FA001',
    sensorId: 'FS002',
    type: 'smoke_detected',
    severity: 'high',
    location: { lat: -2.6527, lng: 37.2606 },
    parkId: 'amboseli',
    detectedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    aiAnalysis: {
      confidence: 94,
      spreadPrediction: 'Northeast at 2.3 km/h',
      affectedArea: 12,
      estimatedContainmentTime: '4-6 hours'
    },
    escalationStatus: [
      { step: 1, action: 'Park Rangers Notified', notifiedParties: ['Amboseli Rangers HQ'], triggeredAt: new Date(Date.now() - 14 * 60000).toISOString(), acknowledged: true, acknowledgedBy: 'Ranger Ochieng', acknowledgedAt: new Date(Date.now() - 12 * 60000).toISOString() },
      { step: 2, action: 'Fire Response Team Deployed', notifiedParties: ['KWS Fire Unit', 'Local Fire Brigade'], triggeredAt: new Date(Date.now() - 10 * 60000).toISOString(), acknowledged: true, acknowledgedBy: 'Fire Chief Maina', acknowledgedAt: new Date(Date.now() - 8 * 60000).toISOString() },
      { step: 3, action: 'Regional Command Notified', notifiedParties: ['Southern Region HQ'], triggeredAt: new Date(Date.now() - 5 * 60000).toISOString(), acknowledged: false }
    ],
    status: 'active'
  },
  {
    id: 'FA002',
    sensorId: 'FS003',
    type: 'high_temperature',
    severity: 'medium',
    location: { lat: -2.9012, lng: 38.4789 },
    parkId: 'tsavo-east',
    detectedAt: new Date(Date.now() - 45 * 60000).toISOString(),
    aiAnalysis: {
      confidence: 78,
      spreadPrediction: 'Stationary - monitoring',
      affectedArea: 3,
      estimatedContainmentTime: 'N/A - monitoring'
    },
    escalationStatus: [
      { step: 1, action: 'Automated Monitoring Active', notifiedParties: ['AI System'], triggeredAt: new Date(Date.now() - 45 * 60000).toISOString(), acknowledged: true, acknowledgedBy: 'System', acknowledgedAt: new Date(Date.now() - 45 * 60000).toISOString() }
    ],
    status: 'active'
  }
];

export const fireRiskZones: FireRiskZone[] = [
  {
    id: 'FRZ001',
    parkId: 'masai-mara',
    riskLevel: 'high',
    center: { lat: -1.5, lng: 35.1 },
    radius: 15,
    factors: { temperature: 36, humidity: 25, windSpeed: 20, vegetationDryness: 85, historicalIncidents: 8 },
    prediction: { probability: 0.72, timeframe: 'Next 48 hours', recommendation: 'Deploy additional fire patrols' }
  },
  {
    id: 'FRZ002',
    parkId: 'tsavo-east',
    riskLevel: 'extreme',
    center: { lat: -2.9, lng: 38.5 },
    radius: 25,
    factors: { temperature: 42, humidity: 18, windSpeed: 25, vegetationDryness: 92, historicalIncidents: 12 },
    prediction: { probability: 0.89, timeframe: 'Next 24 hours', recommendation: 'Pre-position fire response teams' }
  },
  {
    id: 'FRZ003',
    parkId: 'amboseli',
    riskLevel: 'moderate',
    center: { lat: -2.65, lng: 37.3 },
    radius: 10,
    factors: { temperature: 33, humidity: 35, windSpeed: 12, vegetationDryness: 65, historicalIncidents: 4 },
    prediction: { probability: 0.45, timeframe: 'Next 72 hours', recommendation: 'Standard monitoring' }
  },
  {
    id: 'FRZ004',
    parkId: 'lake-nakuru',
    riskLevel: 'low',
    center: { lat: -0.35, lng: 36.1 },
    radius: 8,
    factors: { temperature: 26, humidity: 60, windSpeed: 8, vegetationDryness: 30, historicalIncidents: 1 },
    prediction: { probability: 0.15, timeframe: 'Next 7 days', recommendation: 'Routine patrols sufficient' }
  }
];

export const weatherData: WeatherData[] = [
  {
    parkId: 'masai-mara',
    temperature: 28,
    humidity: 55,
    windSpeed: 15,
    windDirection: 'NE',
    precipitation: 0,
    visibility: 25,
    conditions: 'Partly Cloudy',
    forecast: [
      { time: '12:00', temperature: 30, conditions: 'Sunny' },
      { time: '15:00', temperature: 32, conditions: 'Sunny' },
      { time: '18:00', temperature: 26, conditions: 'Clear' }
    ]
  },
  {
    parkId: 'amboseli',
    temperature: 34,
    humidity: 30,
    windSpeed: 20,
    windDirection: 'E',
    precipitation: 0,
    visibility: 30,
    conditions: 'Clear',
    forecast: [
      { time: '12:00', temperature: 36, conditions: 'Hot' },
      { time: '15:00', temperature: 38, conditions: 'Hot' },
      { time: '18:00', temperature: 32, conditions: 'Warm' }
    ]
  },
  {
    parkId: 'tsavo-east',
    temperature: 38,
    humidity: 22,
    windSpeed: 25,
    windDirection: 'SE',
    precipitation: 0,
    visibility: 35,
    conditions: 'Hot & Dry',
    forecast: [
      { time: '12:00', temperature: 40, conditions: 'Extreme Heat' },
      { time: '15:00', temperature: 42, conditions: 'Extreme Heat' },
      { time: '18:00', temperature: 36, conditions: 'Hot' }
    ]
  }
];

export const animalTracking: AnimalTracking[] = [
  { id: 'AT001', species: 'Elephant', name: 'Tembo', collarId: 'EC-2847', location: { lat: -1.4521, lng: 35.2103 }, parkId: 'masai-mara', lastUpdate: new Date(Date.now() - 5 * 60000).toISOString(), speed: 3.2, direction: 'NW', healthStatus: 'healthy', batteryLevel: 87 },
  { id: 'AT002', species: 'Lion', name: 'Simba', collarId: 'LC-1923', location: { lat: -1.3892, lng: 35.1847 }, parkId: 'masai-mara', lastUpdate: new Date(Date.now() - 2 * 60000).toISOString(), speed: 0, direction: 'Stationary', healthStatus: 'healthy', batteryLevel: 92 },
  { id: 'AT003', species: 'Rhino', name: 'Kifaru', collarId: 'RC-0512', location: { lat: -2.6234, lng: 37.2912 }, parkId: 'amboseli', lastUpdate: new Date(Date.now() - 8 * 60000).toISOString(), speed: 1.5, direction: 'E', healthStatus: 'healthy', batteryLevel: 76 },
  { id: 'AT004', species: 'Elephant', name: 'Duma', collarId: 'EC-3156', location: { lat: -2.8912, lng: 38.4234 }, parkId: 'tsavo-east', lastUpdate: new Date(Date.now() - 3 * 60000).toISOString(), speed: 4.8, direction: 'S', healthStatus: 'concern', batteryLevel: 45 },
  { id: 'AT005', species: 'Cheetah', name: 'Haraka', collarId: 'CC-0789', location: { lat: 0.5523, lng: 37.5012 }, parkId: 'samburu', lastUpdate: new Date(Date.now() - 1 * 60000).toISOString(), speed: 0, direction: 'Stationary', healthStatus: 'healthy', batteryLevel: 95 },
  { id: 'AT006', species: 'Giraffe', name: 'Twiga', collarId: 'GC-1456', location: { lat: -0.3234, lng: 36.1023 }, parkId: 'lake-nakuru', lastUpdate: new Date(Date.now() - 12 * 60000).toISOString(), speed: 2.1, direction: 'NE', healthStatus: 'healthy', batteryLevel: 68 }
];

export const poachingRiskZones: PoachingRiskZone[] = [
  { id: 'PRZ001', parkId: 'tsavo-east', riskLevel: 85, center: { lat: -2.95, lng: 38.6 }, radius: 12, factors: ['Recent elephant sightings', 'Border proximity', 'Limited patrol coverage', 'Historical hotspot'], lastIncident: '2024-01-05', patrolRecommendation: 'Increase night patrols, deploy 2 additional drones' },
  { id: 'PRZ002', parkId: 'masai-mara', riskLevel: 65, center: { lat: -1.55, lng: 35.3 }, radius: 8, factors: ['High rhino density', 'Road access nearby', 'New moon period'], patrolRecommendation: 'Deploy thermal sensors, coordinate with Tanzania rangers' },
  { id: 'PRZ003', parkId: 'amboseli', riskLevel: 72, center: { lat: -2.7, lng: 37.35 }, radius: 10, factors: ['Elephant migration corridor', 'Seasonal water source', 'Recent suspicious activity'], lastIncident: '2024-01-12', patrolRecommendation: 'Establish checkpoint, increase aerial surveillance' },
  { id: 'PRZ004', parkId: 'samburu', riskLevel: 45, center: { lat: 0.58, lng: 37.55 }, radius: 6, factors: ['Moderate wildlife density', 'Community boundary'], patrolRecommendation: 'Standard patrols with community liaison' }
];

export const droneFeedsData: DroneFeed[] = [
  { id: 'DF001', droneId: 'DRN-Alpha-01', name: 'Mara Eye 1', location: { lat: -1.4234, lng: 35.2012 }, parkId: 'masai-mara', status: 'live', altitude: 120, battery: 78, mission: 'Wildlife Census', streamUrl: '/drone-feeds/mara-1' },
  { id: 'DF002', droneId: 'DRN-Alpha-02', name: 'Mara Eye 2', location: { lat: -1.4892, lng: 35.1567 }, parkId: 'masai-mara', status: 'live', altitude: 150, battery: 65, mission: 'Anti-Poaching Patrol', streamUrl: '/drone-feeds/mara-2' },
  { id: 'DF003', droneId: 'DRN-Beta-01', name: 'Amboseli Scout', location: { lat: -2.6512, lng: 37.2834 }, parkId: 'amboseli', status: 'live', altitude: 100, battery: 82, mission: 'Fire Watch', streamUrl: '/drone-feeds/amboseli-1' },
  { id: 'DF004', droneId: 'DRN-Gamma-01', name: 'Tsavo Guardian', location: { lat: -2.9123, lng: 38.4567 }, parkId: 'tsavo-east', status: 'offline', altitude: 0, battery: 15, mission: 'Returning to Base' },
  { id: 'DF005', droneId: 'DRN-Delta-01', name: 'Nakuru Watcher', location: { lat: -0.3567, lng: 36.0912 }, parkId: 'lake-nakuru', status: 'recording', altitude: 80, battery: 91, mission: 'Flamingo Migration' }
];
