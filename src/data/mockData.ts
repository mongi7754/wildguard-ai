import { WildlifeSpecies, ThreatAlert, DroneStatus, RangerTeam, AnimalTracking, EnvironmentData } from '@/types/wildlife';

export const mockWildlife: WildlifeSpecies[] = [
  {
    id: '1',
    name: 'African Elephant',
    scientificName: 'Loxodonta africana',
    conservationStatus: 'EN',
    count: 47,
    lastSeen: new Date(Date.now() - 1000 * 60 * 15),
    location: { lat: -1.2921, lng: 36.8219 }
  },
  {
    id: '2',
    name: 'Lion',
    scientificName: 'Panthera leo',
    conservationStatus: 'VU',
    count: 12,
    lastSeen: new Date(Date.now() - 1000 * 60 * 45),
    location: { lat: -1.3021, lng: 36.8119 }
  },
  {
    id: '3',
    name: 'Black Rhino',
    scientificName: 'Diceros bicornis',
    conservationStatus: 'CR',
    count: 8,
    lastSeen: new Date(Date.now() - 1000 * 60 * 30),
    location: { lat: -1.2821, lng: 36.8319 }
  },
  {
    id: '4',
    name: 'Giraffe',
    scientificName: 'Giraffa camelopardalis',
    conservationStatus: 'VU',
    count: 23,
    lastSeen: new Date(Date.now() - 1000 * 60 * 5),
    location: { lat: -1.2721, lng: 36.8419 }
  },
  {
    id: '5',
    name: 'Cheetah',
    scientificName: 'Acinonyx jubatus',
    conservationStatus: 'VU',
    count: 6,
    lastSeen: new Date(Date.now() - 1000 * 60 * 60),
    location: { lat: -1.3121, lng: 36.8019 }
  }
];

export const mockAlerts: ThreatAlert[] = [
  {
    id: '1',
    type: 'poacher',
    severity: 'critical',
    title: 'Suspected Poacher Activity',
    description: 'Two individuals detected in restricted zone near rhino habitat. Armed movement patterns identified.',
    location: { lat: -1.2850, lng: 36.8250 },
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    status: 'active'
  },
  {
    id: '2',
    type: 'fire',
    severity: 'high',
    title: 'Smoke Detection - Sector 7',
    description: 'Thermal anomaly detected. Possible brush fire starting. Wind direction favorable for spread.',
    location: { lat: -1.3000, lng: 36.8150 },
    timestamp: new Date(Date.now() - 1000 * 60 * 12),
    status: 'investigating',
    assignedTo: 'Team Alpha'
  },
  {
    id: '3',
    type: 'vehicle',
    severity: 'medium',
    title: 'Unregistered Vehicle',
    description: 'Unknown vehicle detected on perimeter road. License plate not in database.',
    location: { lat: -1.2780, lng: 36.8380 },
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    status: 'investigating',
    assignedTo: 'Team Bravo'
  },
  {
    id: '4',
    type: 'acoustic',
    severity: 'high',
    title: 'Gunshot Detected',
    description: 'Single gunshot sound signature detected. Triangulating source location.',
    location: { lat: -1.2920, lng: 36.8200 },
    timestamp: new Date(Date.now() - 1000 * 60 * 8),
    status: 'active'
  },
  {
    id: '5',
    type: 'environmental',
    severity: 'low',
    title: 'Water Level Alert',
    description: 'Lake Nakuru water level dropped 15% below seasonal average.',
    location: { lat: -1.3050, lng: 36.8100 },
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    status: 'resolved'
  }
];

export const mockDrones: DroneStatus[] = [
  {
    id: 'd1',
    name: 'Eagle-1',
    status: 'active',
    battery: 78,
    location: { lat: -1.2900, lng: 36.8200 },
    altitude: 120,
    speed: 45,
    mission: 'Perimeter Patrol',
    thermalMode: true,
    nightVision: false
  },
  {
    id: 'd2',
    name: 'Hawk-2',
    status: 'active',
    battery: 45,
    location: { lat: -1.2850, lng: 36.8300 },
    altitude: 80,
    speed: 30,
    mission: 'Wildlife Tracking',
    thermalMode: false,
    nightVision: true
  },
  {
    id: 'd3',
    name: 'Falcon-3',
    status: 'charging',
    battery: 23,
    location: { lat: -1.2750, lng: 36.8150 },
    altitude: 0,
    speed: 0,
    thermalMode: false,
    nightVision: false
  },
  {
    id: 'd4',
    name: 'Osprey-4',
    status: 'idle',
    battery: 100,
    location: { lat: -1.2750, lng: 36.8150 },
    altitude: 0,
    speed: 0,
    thermalMode: false,
    nightVision: false
  }
];

export const mockRangers: RangerTeam[] = [
  {
    id: 'r1',
    name: 'Team Alpha',
    members: 4,
    status: 'responding',
    location: { lat: -1.2880, lng: 36.8220 },
    currentMission: 'Investigating fire alert'
  },
  {
    id: 'r2',
    name: 'Team Bravo',
    members: 3,
    status: 'patrol',
    location: { lat: -1.2980, lng: 36.8320 },
    currentMission: 'Northern sector patrol'
  },
  {
    id: 'r3',
    name: 'Team Charlie',
    members: 5,
    status: 'standby',
    location: { lat: -1.2750, lng: 36.8150 }
  },
  {
    id: 'r4',
    name: 'Team Delta',
    members: 4,
    status: 'off-duty',
    location: { lat: -1.2750, lng: 36.8150 }
  }
];

export const mockTracking: AnimalTracking[] = [
  {
    id: 't1',
    animalId: 'e001',
    species: 'African Elephant',
    name: 'Kibo',
    tagType: 'GPS',
    lastPing: new Date(Date.now() - 1000 * 60 * 2),
    locations: [
      { lat: -1.2900, lng: 36.8180, timestamp: new Date(Date.now() - 1000 * 60 * 60) },
      { lat: -1.2910, lng: 36.8190, timestamp: new Date(Date.now() - 1000 * 60 * 45) },
      { lat: -1.2915, lng: 36.8200, timestamp: new Date(Date.now() - 1000 * 60 * 30) },
      { lat: -1.2920, lng: 36.8210, timestamp: new Date(Date.now() - 1000 * 60 * 15) },
      { lat: -1.2921, lng: 36.8219, timestamp: new Date(Date.now() - 1000 * 60 * 2) }
    ],
    healthStatus: 'healthy',
    predictedPath: [
      { lat: -1.2925, lng: 36.8225 },
      { lat: -1.2930, lng: 36.8235 },
      { lat: -1.2935, lng: 36.8245 }
    ]
  },
  {
    id: 't2',
    animalId: 'r001',
    species: 'Black Rhino',
    name: 'Zawadi',
    tagType: 'GPS',
    lastPing: new Date(Date.now() - 1000 * 60 * 5),
    locations: [
      { lat: -1.2800, lng: 36.8300, timestamp: new Date(Date.now() - 1000 * 60 * 60) },
      { lat: -1.2810, lng: 36.8310, timestamp: new Date(Date.now() - 1000 * 60 * 30) },
      { lat: -1.2821, lng: 36.8319, timestamp: new Date(Date.now() - 1000 * 60 * 5) }
    ],
    healthStatus: 'healthy'
  }
];

export const mockEnvironment: EnvironmentData = {
  temperature: 28,
  humidity: 65,
  airQuality: 42,
  fireRisk: 'moderate',
  rainfall: 2.5,
  windSpeed: 15
};

export const dashboardStats = {
  totalWildlife: 156,
  activeAlerts: 4,
  dronesActive: 2,
  rangersOnDuty: 12,
  detectionToday: 234,
  areaMonitored: 2450
};
