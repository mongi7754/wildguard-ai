// Drone Patrol Routes and Coverage Data for Kenya Wildlife Monitoring

export interface DronePatrolRoute {
  id: string;
  droneId: string;
  droneName: string;
  parkId: string;
  status: 'active' | 'returning' | 'standby' | 'charging';
  routeType: 'perimeter' | 'grid' | 'hotspot' | 'emergency' | 'surveillance';
  waypoints: { lat: number; lng: number; altitude: number }[];
  currentPosition: { lat: number; lng: number; altitude: number; heading: number };
  speed: number; // km/h
  battery: number;
  coverageRadius: number; // km
  missionStart: Date;
  estimatedEnd: Date;
  thermalEnabled: boolean;
  nightVision: boolean;
}

export interface DroneFleet {
  parkId: string;
  drones: DronePatrolRoute[];
  totalCoverage: number;
  activePatrols: number;
}

// Generate patrol routes for each park
export const generateDronePatrols = (): DronePatrolRoute[] => {
  const routes: DronePatrolRoute[] = [];
  
  // Masai Mara patrols
  routes.push({
    id: 'patrol-mm-1',
    droneId: 'DRN-MM-001',
    droneName: 'Mara Eagle-1',
    parkId: 'masai-mara',
    status: 'active',
    routeType: 'perimeter',
    waypoints: [
      { lat: -1.35, lng: 34.98, altitude: 150 },
      { lat: -1.32, lng: 35.08, altitude: 150 },
      { lat: -1.40, lng: 35.12, altitude: 150 },
      { lat: -1.48, lng: 35.05, altitude: 150 },
      { lat: -1.45, lng: 34.95, altitude: 150 },
      { lat: -1.35, lng: 34.98, altitude: 150 }
    ],
    currentPosition: { lat: -1.38, lng: 35.02, altitude: 150, heading: 45 },
    speed: 45,
    battery: 78,
    coverageRadius: 2.5,
    missionStart: new Date(Date.now() - 3600000),
    estimatedEnd: new Date(Date.now() + 5400000),
    thermalEnabled: true,
    nightVision: true
  });

  routes.push({
    id: 'patrol-mm-2',
    droneId: 'DRN-MM-002',
    droneName: 'Mara Hawk-2',
    parkId: 'masai-mara',
    status: 'active',
    routeType: 'hotspot',
    waypoints: [
      { lat: -1.42, lng: 35.04, altitude: 120 },
      { lat: -1.44, lng: 35.06, altitude: 120 },
      { lat: -1.43, lng: 35.08, altitude: 120 }
    ],
    currentPosition: { lat: -1.43, lng: 35.05, altitude: 120, heading: 180 },
    speed: 30,
    battery: 65,
    coverageRadius: 1.8,
    missionStart: new Date(Date.now() - 1800000),
    estimatedEnd: new Date(Date.now() + 3600000),
    thermalEnabled: true,
    nightVision: false
  });

  // Tsavo East patrols
  routes.push({
    id: 'patrol-te-1',
    droneId: 'DRN-TE-001',
    droneName: 'Tsavo Guardian-1',
    parkId: 'tsavo-east',
    status: 'active',
    routeType: 'grid',
    waypoints: [
      { lat: -2.95, lng: 38.65, altitude: 200 },
      { lat: -3.00, lng: 38.75, altitude: 200 },
      { lat: -3.10, lng: 38.80, altitude: 200 },
      { lat: -3.15, lng: 38.70, altitude: 200 },
      { lat: -3.05, lng: 38.60, altitude: 200 }
    ],
    currentPosition: { lat: -3.05, lng: 38.72, altitude: 200, heading: 270 },
    speed: 55,
    battery: 82,
    coverageRadius: 3.0,
    missionStart: new Date(Date.now() - 4500000),
    estimatedEnd: new Date(Date.now() + 7200000),
    thermalEnabled: true,
    nightVision: true
  });

  routes.push({
    id: 'patrol-te-2',
    droneId: 'DRN-TE-002',
    droneName: 'Tsavo Sentinel-2',
    parkId: 'tsavo-east',
    status: 'active',
    routeType: 'perimeter',
    waypoints: [
      { lat: -3.20, lng: 38.85, altitude: 180 },
      { lat: -3.25, lng: 38.90, altitude: 180 },
      { lat: -3.30, lng: 38.82, altitude: 180 },
      { lat: -3.22, lng: 38.78, altitude: 180 }
    ],
    currentPosition: { lat: -3.24, lng: 38.86, altitude: 180, heading: 135 },
    speed: 48,
    battery: 71,
    coverageRadius: 2.2,
    missionStart: new Date(Date.now() - 2700000),
    estimatedEnd: new Date(Date.now() + 4500000),
    thermalEnabled: true,
    nightVision: true
  });

  // Amboseli patrols
  routes.push({
    id: 'patrol-ab-1',
    droneId: 'DRN-AB-001',
    droneName: 'Amboseli Scout-1',
    parkId: 'amboseli',
    status: 'active',
    routeType: 'surveillance',
    waypoints: [
      { lat: -2.62, lng: 37.22, altitude: 130 },
      { lat: -2.65, lng: 37.28, altitude: 130 },
      { lat: -2.68, lng: 37.30, altitude: 130 },
      { lat: -2.70, lng: 37.25, altitude: 130 }
    ],
    currentPosition: { lat: -2.66, lng: 37.26, altitude: 130, heading: 90 },
    speed: 40,
    battery: 88,
    coverageRadius: 2.0,
    missionStart: new Date(Date.now() - 1200000),
    estimatedEnd: new Date(Date.now() + 6000000),
    thermalEnabled: true,
    nightVision: false
  });

  // Samburu patrols
  routes.push({
    id: 'patrol-sb-1',
    droneId: 'DRN-SB-001',
    droneName: 'Samburu Raptor-1',
    parkId: 'samburu',
    status: 'active',
    routeType: 'perimeter',
    waypoints: [
      { lat: 0.48, lng: 37.48, altitude: 140 },
      { lat: 0.52, lng: 37.54, altitude: 140 },
      { lat: 0.55, lng: 37.50, altitude: 140 },
      { lat: 0.50, lng: 37.46, altitude: 140 }
    ],
    currentPosition: { lat: 0.51, lng: 37.51, altitude: 140, heading: 315 },
    speed: 42,
    battery: 75,
    coverageRadius: 1.8,
    missionStart: new Date(Date.now() - 2400000),
    estimatedEnd: new Date(Date.now() + 5400000),
    thermalEnabled: true,
    nightVision: true
  });

  // Meru patrols
  routes.push({
    id: 'patrol-mr-1',
    droneId: 'DRN-MR-001',
    droneName: 'Meru Falcon-1',
    parkId: 'meru',
    status: 'active',
    routeType: 'hotspot',
    waypoints: [
      { lat: 0.02, lng: 38.08, altitude: 160 },
      { lat: 0.05, lng: 38.14, altitude: 160 },
      { lat: 0.00, lng: 38.18, altitude: 160 }
    ],
    currentPosition: { lat: 0.03, lng: 38.12, altitude: 160, heading: 60 },
    speed: 38,
    battery: 92,
    coverageRadius: 2.2,
    missionStart: new Date(Date.now() - 900000),
    estimatedEnd: new Date(Date.now() + 7200000),
    thermalEnabled: true,
    nightVision: false
  });

  // Laikipia patrols
  routes.push({
    id: 'patrol-lk-1',
    droneId: 'DRN-LK-001',
    droneName: 'Laikipia Watcher-1',
    parkId: 'laikipia',
    status: 'active',
    routeType: 'grid',
    waypoints: [
      { lat: 0.25, lng: 37.00, altitude: 180 },
      { lat: 0.30, lng: 37.08, altitude: 180 },
      { lat: 0.35, lng: 37.12, altitude: 180 },
      { lat: 0.28, lng: 37.05, altitude: 180 }
    ],
    currentPosition: { lat: 0.29, lng: 37.06, altitude: 180, heading: 225 },
    speed: 50,
    battery: 68,
    coverageRadius: 2.8,
    missionStart: new Date(Date.now() - 3300000),
    estimatedEnd: new Date(Date.now() + 5700000),
    thermalEnabled: true,
    nightVision: true
  });

  // Lake Nakuru patrol
  routes.push({
    id: 'patrol-ln-1',
    droneId: 'DRN-LN-001',
    droneName: 'Nakuru Osprey-1',
    parkId: 'lake-nakuru',
    status: 'active',
    routeType: 'surveillance',
    waypoints: [
      { lat: -0.28, lng: 36.05, altitude: 110 },
      { lat: -0.32, lng: 36.10, altitude: 110 },
      { lat: -0.35, lng: 36.08, altitude: 110 }
    ],
    currentPosition: { lat: -0.30, lng: 36.08, altitude: 110, heading: 150 },
    speed: 35,
    battery: 85,
    coverageRadius: 1.5,
    missionStart: new Date(Date.now() - 1500000),
    estimatedEnd: new Date(Date.now() + 4800000),
    thermalEnabled: false,
    nightVision: false
  });

  // Mount Kenya patrol
  routes.push({
    id: 'patrol-mk-1',
    droneId: 'DRN-MK-001',
    droneName: 'Kenya Summit-1',
    parkId: 'mount-kenya',
    status: 'active',
    routeType: 'perimeter',
    waypoints: [
      { lat: 0.12, lng: 37.28, altitude: 200 },
      { lat: 0.18, lng: 37.32, altitude: 200 },
      { lat: 0.20, lng: 37.35, altitude: 200 },
      { lat: 0.15, lng: 37.30, altitude: 200 }
    ],
    currentPosition: { lat: 0.16, lng: 37.31, altitude: 200, heading: 30 },
    speed: 45,
    battery: 72,
    coverageRadius: 2.5,
    missionStart: new Date(Date.now() - 2100000),
    estimatedEnd: new Date(Date.now() + 6300000),
    thermalEnabled: true,
    nightVision: true
  });

  // Tsavo West patrol
  routes.push({
    id: 'patrol-tw-1',
    droneId: 'DRN-TW-001',
    droneName: 'Tsavo West Ranger-1',
    parkId: 'tsavo-west',
    status: 'active',
    routeType: 'hotspot',
    waypoints: [
      { lat: -3.32, lng: 38.12, altitude: 170 },
      { lat: -3.38, lng: 38.18, altitude: 170 },
      { lat: -3.40, lng: 38.14, altitude: 170 }
    ],
    currentPosition: { lat: -3.36, lng: 38.15, altitude: 170, heading: 120 },
    speed: 42,
    battery: 79,
    coverageRadius: 2.3,
    missionStart: new Date(Date.now() - 1800000),
    estimatedEnd: new Date(Date.now() + 5100000),
    thermalEnabled: true,
    nightVision: true
  });

  return routes;
};

// Calculate total drone coverage statistics
export const calculateFleetStats = (patrols: DronePatrolRoute[]) => {
  const activePatrols = patrols.filter(p => p.status === 'active');
  const totalCoverage = activePatrols.reduce((sum, p) => sum + Math.PI * p.coverageRadius * p.coverageRadius, 0);
  const avgBattery = activePatrols.reduce((sum, p) => sum + p.battery, 0) / (activePatrols.length || 1);
  
  return {
    totalDrones: patrols.length,
    activePatrols: activePatrols.length,
    totalCoverageKm2: Math.round(totalCoverage * 10) / 10,
    averageBattery: Math.round(avgBattery),
    thermalActive: activePatrols.filter(p => p.thermalEnabled).length,
    nightVisionActive: activePatrols.filter(p => p.nightVision).length
  };
};
