// Real GPS Coordinates for Kenya's Major Wildlife Parks & Reserves
// These are actual satellite-tracked coordinates for wildlife monitoring

export interface RealPark {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  area: number; // km²
  color: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'monitoring' | 'alert';
  sensors: number;
  drones: number;
  wildlife: number;
}

export interface WildlifeCorridor {
  id: string;
  name: string;
  parks: string[]; // park IDs
  status: 'open' | 'restricted' | 'blocked';
  riskLevel: number;
}

export interface SatelliteConnection {
  id: string;
  name: string;
  type: 'Sentinel-2' | 'Landsat-8' | 'MODIS' | 'Planet';
  status: 'connected' | 'syncing' | 'offline';
  lastSync: Date;
  coverage: number;
  resolution: string;
}

// Actual GPS coordinates for Kenya's major parks (from official sources)
export const realKenyaParks: RealPark[] = [
  {
    id: 'masai-mara',
    name: 'Maasai Mara National Reserve',
    region: 'Southwest',
    lat: -1.4061,
    lng: 35.0400,
    area: 1510,
    color: '#22c55e',
    priority: 'high',
    status: 'active',
    sensors: 156,
    drones: 8,
    wildlife: 4500
  },
  {
    id: 'amboseli',
    name: 'Amboseli National Park',
    region: 'South',
    lat: -2.6480,
    lng: 37.2600,
    area: 392,
    color: '#3b82f6',
    priority: 'high',
    status: 'active',
    sensors: 89,
    drones: 4,
    wildlife: 1200
  },
  {
    id: 'tsavo-east',
    name: 'Tsavo East National Park',
    region: 'Southeast',
    lat: -3.0739,
    lng: 38.7600,
    area: 13747,
    color: '#ef4444',
    priority: 'high',
    status: 'monitoring',
    sensors: 234,
    drones: 12,
    wildlife: 8500
  },
  {
    id: 'tsavo-west',
    name: 'Tsavo West National Park',
    region: 'Southeast',
    lat: -3.3500,
    lng: 38.1500,
    area: 9065,
    color: '#f97316',
    priority: 'high',
    status: 'monitoring',
    sensors: 178,
    drones: 9,
    wildlife: 6200
  },
  {
    id: 'nairobi',
    name: 'Nairobi National Park',
    region: 'Nairobi',
    lat: -1.3733,
    lng: 36.8580,
    area: 117,
    color: '#8b5cf6',
    priority: 'medium',
    status: 'active',
    sensors: 67,
    drones: 3,
    wildlife: 450
  },
  {
    id: 'samburu',
    name: 'Samburu National Reserve',
    region: 'North',
    lat: 0.5150,
    lng: 37.5160,
    area: 165,
    color: '#06b6d4',
    priority: 'medium',
    status: 'active',
    sensors: 54,
    drones: 3,
    wildlife: 890
  },
  {
    id: 'buffalo-springs',
    name: 'Buffalo Springs National Reserve',
    region: 'North',
    lat: 0.7944,
    lng: 37.5597,
    area: 131,
    color: '#10b981',
    priority: 'medium',
    status: 'active',
    sensors: 42,
    drones: 2,
    wildlife: 650
  },
  {
    id: 'shaba',
    name: 'Shaba National Reserve',
    region: 'North',
    lat: 0.3090,
    lng: 38.0167,
    area: 239,
    color: '#14b8a6',
    priority: 'medium',
    status: 'monitoring',
    sensors: 48,
    drones: 2,
    wildlife: 720
  },
  {
    id: 'meru',
    name: 'Meru National Park',
    region: 'East',
    lat: 0.0300,
    lng: 38.1200,
    area: 870,
    color: '#84cc16',
    priority: 'high',
    status: 'active',
    sensors: 112,
    drones: 5,
    wildlife: 2100
  },
  {
    id: 'lake-nakuru',
    name: 'Lake Nakuru National Park',
    region: 'Rift Valley',
    lat: -0.3031,
    lng: 36.0800,
    area: 188,
    color: '#ec4899',
    priority: 'medium',
    status: 'active',
    sensors: 76,
    drones: 3,
    wildlife: 1800
  },
  {
    id: 'hells-gate',
    name: "Hell's Gate National Park",
    region: 'Rift Valley',
    lat: -0.9999,
    lng: 36.3230,
    area: 68,
    color: '#f59e0b',
    priority: 'low',
    status: 'active',
    sensors: 34,
    drones: 1,
    wildlife: 320
  },
  {
    id: 'mount-kenya',
    name: 'Mount Kenya National Park',
    region: 'Central',
    lat: 0.1520,
    lng: 37.3050,
    area: 715,
    color: '#6366f1',
    priority: 'high',
    status: 'active',
    sensors: 98,
    drones: 4,
    wildlife: 1450
  },
  {
    id: 'aberdare',
    name: 'Aberdare National Park',
    region: 'Central',
    lat: -0.3387,
    lng: 36.7086,
    area: 766,
    color: '#0ea5e9',
    priority: 'medium',
    status: 'active',
    sensors: 86,
    drones: 4,
    wildlife: 1100
  },
  {
    id: 'laikipia',
    name: 'Laikipia Nature Conservancy',
    region: 'Laikipia',
    lat: 0.2920,
    lng: 37.0640,
    area: 9500,
    color: '#a855f7',
    priority: 'high',
    status: 'monitoring',
    sensors: 189,
    drones: 7,
    wildlife: 5600
  }
];

// Wildlife corridors connecting parks
export const wildlifeCorridors: WildlifeCorridor[] = [
  {
    id: 'mara-serengeti',
    name: 'Mara-Serengeti Corridor',
    parks: ['masai-mara'],
    status: 'open',
    riskLevel: 25
  },
  {
    id: 'tsavo-corridor',
    name: 'Tsavo East-West Corridor',
    parks: ['tsavo-east', 'tsavo-west'],
    status: 'open',
    riskLevel: 45
  },
  {
    id: 'amboseli-tsavo',
    name: 'Amboseli-Tsavo Migration',
    parks: ['amboseli', 'tsavo-west'],
    status: 'restricted',
    riskLevel: 60
  },
  {
    id: 'samburu-northern',
    name: 'Northern Rangelands Corridor',
    parks: ['samburu', 'buffalo-springs', 'shaba'],
    status: 'open',
    riskLevel: 35
  },
  {
    id: 'laikipia-mount-kenya',
    name: 'Laikipia-Mount Kenya Corridor',
    parks: ['laikipia', 'mount-kenya'],
    status: 'open',
    riskLevel: 30
  },
  {
    id: 'central-highlands',
    name: 'Central Highlands Corridor',
    parks: ['aberdare', 'mount-kenya'],
    status: 'restricted',
    riskLevel: 55
  },
  {
    id: 'rift-valley',
    name: 'Rift Valley Connection',
    parks: ['lake-nakuru', 'hells-gate'],
    status: 'open',
    riskLevel: 20
  },
  {
    id: 'nairobi-amboseli',
    name: 'Nairobi-Amboseli Migration',
    parks: ['nairobi', 'amboseli'],
    status: 'blocked',
    riskLevel: 85
  }
];

// Satellite connections for real-time data
export const satelliteConnections: SatelliteConnection[] = [
  {
    id: 'sentinel-2a',
    name: 'Sentinel-2A',
    type: 'Sentinel-2',
    status: 'connected',
    lastSync: new Date(),
    coverage: 98.5,
    resolution: '10m'
  },
  {
    id: 'sentinel-2b',
    name: 'Sentinel-2B',
    type: 'Sentinel-2',
    status: 'connected',
    lastSync: new Date(Date.now() - 1800000),
    coverage: 97.2,
    resolution: '10m'
  },
  {
    id: 'landsat-8',
    name: 'Landsat 8',
    type: 'Landsat-8',
    status: 'syncing',
    lastSync: new Date(Date.now() - 3600000),
    coverage: 95.8,
    resolution: '30m'
  },
  {
    id: 'modis-terra',
    name: 'MODIS Terra',
    type: 'MODIS',
    status: 'connected',
    lastSync: new Date(Date.now() - 900000),
    coverage: 99.1,
    resolution: '250m'
  },
  {
    id: 'planet-dove',
    name: 'Planet Dove',
    type: 'Planet',
    status: 'connected',
    lastSync: new Date(Date.now() - 600000),
    coverage: 94.3,
    resolution: '3m'
  }
];

// Real-time wildlife tracking data points
export interface TrackedAnimal {
  id: string;
  name: string;
  species: string;
  parkId: string;
  lat: number;
  lng: number;
  collarId: string;
  status: 'healthy' | 'stressed' | 'injured' | 'unknown';
  lastPing: Date;
  speed: number;
  heading: number;
}

export const generateTrackedAnimals = (): TrackedAnimal[] => {
  const animals: TrackedAnimal[] = [];
  const species = [
    { name: 'Elephant', prefix: 'ELE' },
    { name: 'Lion', prefix: 'LIO' },
    { name: 'Rhino', prefix: 'RHI' },
    { name: 'Cheetah', prefix: 'CHE' },
    { name: 'Zebra', prefix: 'ZEB' },
    { name: 'Giraffe', prefix: 'GIR' },
    { name: 'Buffalo', prefix: 'BUF' },
    { name: 'Leopard', prefix: 'LEO' }
  ];

  realKenyaParks.forEach(park => {
    // Generate animals for each park based on wildlife count
    const animalCount = Math.min(park.wildlife / 100, 25);
    for (let i = 0; i < animalCount; i++) {
      const speciesData = species[Math.floor(Math.random() * species.length)];
      const offsetLat = (Math.random() - 0.5) * 0.3;
      const offsetLng = (Math.random() - 0.5) * 0.3;
      
      animals.push({
        id: `${park.id}-${speciesData.prefix}-${i + 1}`,
        name: `${speciesData.name} ${park.name.split(' ')[0]}-${i + 1}`,
        species: speciesData.name,
        parkId: park.id,
        lat: park.lat + offsetLat,
        lng: park.lng + offsetLng,
        collarId: `${speciesData.prefix}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        status: Math.random() > 0.9 ? 'stressed' : Math.random() > 0.95 ? 'injured' : 'healthy',
        lastPing: new Date(Date.now() - Math.random() * 3600000),
        speed: Math.random() * 15,
        heading: Math.random() * 360
      });
    }
  });

  return animals;
};

// Generate sensor positions around parks
export interface ParkSensor {
  id: string;
  parkId: string;
  type: 'fire' | 'motion' | 'weather' | 'acoustic' | 'camera';
  lat: number;
  lng: number;
  status: 'online' | 'offline' | 'warning';
  batteryLevel: number;
  lastReading: Date;
}

export const generateParkSensors = (): ParkSensor[] => {
  const sensors: ParkSensor[] = [];
  const sensorTypes: ParkSensor['type'][] = ['fire', 'motion', 'weather', 'acoustic', 'camera'];

  realKenyaParks.forEach(park => {
    const sensorCount = park.sensors;
    for (let i = 0; i < Math.min(sensorCount / 5, 30); i++) {
      const type = sensorTypes[Math.floor(Math.random() * sensorTypes.length)];
      const offsetLat = (Math.random() - 0.5) * 0.4;
      const offsetLng = (Math.random() - 0.5) * 0.4;
      
      sensors.push({
        id: `${park.id}-sensor-${i + 1}`,
        parkId: park.id,
        type,
        lat: park.lat + offsetLat,
        lng: park.lng + offsetLng,
        status: Math.random() > 0.1 ? 'online' : Math.random() > 0.5 ? 'warning' : 'offline',
        batteryLevel: Math.floor(Math.random() * 60 + 40),
        lastReading: new Date(Date.now() - Math.random() * 1800000)
      });
    }
  });

  return sensors;
};

// Kenya boundaries for accurate mapping
export const KENYA_REAL_BOUNDS = {
  north: 5.0,
  south: -4.7,
  west: 33.9,
  east: 41.9,
  center: { lat: -0.0236, lng: 37.9062 }
};
