import { IoTSensor, SatelliteConnection, IoTAlert, ParkIoTStatus } from '@/types/iot';

export const mockSensors: IoTSensor[] = [
  // Maasai Mara Sensors
  {
    id: 'sensor-001',
    name: 'Elephant Collar - Tembo',
    type: 'animal_collar',
    status: 'online',
    batteryLevel: 87,
    signalStrength: 95,
    lastPing: new Date(),
    location: { lat: -1.4833, lng: 35.1333 },
    parkId: 'maasai-mara',
    data: { heartRate: 45, speed: 2.5, temperature: 36.5 }
  },
  {
    id: 'sensor-002',
    name: 'Lion Collar - Simba',
    type: 'animal_collar',
    status: 'online',
    batteryLevel: 72,
    signalStrength: 88,
    lastPing: new Date(Date.now() - 300000),
    location: { lat: -1.5012, lng: 35.1456 },
    parkId: 'maasai-mara',
    data: { heartRate: 72, speed: 0, temperature: 38.2 }
  },
  {
    id: 'sensor-003',
    name: 'Fire Sensor - Sector A',
    type: 'fire_sensor',
    status: 'online',
    batteryLevel: 95,
    signalStrength: 100,
    lastPing: new Date(),
    location: { lat: -1.4567, lng: 35.1678 },
    parkId: 'maasai-mara',
    data: { temperature: 28, humidity: 45, fireRisk: 'moderate' }
  },
  {
    id: 'sensor-004',
    name: 'Smoke Detector - North Gate',
    type: 'smoke_detector',
    status: 'warning',
    batteryLevel: 23,
    signalStrength: 76,
    lastPing: new Date(Date.now() - 600000),
    location: { lat: -1.4123, lng: 35.1890 },
    parkId: 'maasai-mara',
    data: { smokeLevel: 15, temperature: 32 }
  },
  // Amboseli Sensors
  {
    id: 'sensor-005',
    name: 'Elephant Collar - Kilimanjaro',
    type: 'animal_collar',
    status: 'online',
    batteryLevel: 91,
    signalStrength: 92,
    lastPing: new Date(),
    location: { lat: -2.6527, lng: 37.2606 },
    parkId: 'amboseli',
    data: { heartRate: 48, speed: 1.2, temperature: 36.8 }
  },
  {
    id: 'sensor-006',
    name: 'Weather Station - Central',
    type: 'weather_station',
    status: 'online',
    batteryLevel: 100,
    signalStrength: 98,
    lastPing: new Date(),
    location: { lat: -2.6450, lng: 37.2500 },
    parkId: 'amboseli',
    data: { temperature: 31, humidity: 52, fireRisk: 'low' }
  },
  {
    id: 'sensor-007',
    name: 'Motion Sensor - Boundary',
    type: 'motion_sensor',
    status: 'critical',
    batteryLevel: 8,
    signalStrength: 45,
    lastPing: new Date(Date.now() - 1800000),
    location: { lat: -2.6789, lng: 37.2890 },
    parkId: 'amboseli',
    data: { motionDetected: true }
  },
  // Tsavo Sensors
  {
    id: 'sensor-008',
    name: 'Fire Sensor - Red Zone',
    type: 'fire_sensor',
    status: 'critical',
    batteryLevel: 85,
    signalStrength: 90,
    lastPing: new Date(),
    location: { lat: -2.9833, lng: 38.4667 },
    parkId: 'tsavo-east',
    data: { temperature: 42, humidity: 18, fireRisk: 'extreme' }
  },
  {
    id: 'sensor-009',
    name: 'Rhino Collar - Kifaru',
    type: 'animal_collar',
    status: 'online',
    batteryLevel: 65,
    signalStrength: 82,
    lastPing: new Date(Date.now() - 120000),
    location: { lat: -3.0123, lng: 38.4890 },
    parkId: 'tsavo-east',
    data: { heartRate: 38, speed: 0.5, temperature: 37.1 }
  },
  {
    id: 'sensor-010',
    name: 'Smoke Detector - Mudanda',
    type: 'smoke_detector',
    status: 'online',
    batteryLevel: 78,
    signalStrength: 88,
    lastPing: new Date(),
    location: { lat: -3.0456, lng: 38.5123 },
    parkId: 'tsavo-east',
    data: { smokeLevel: 2, temperature: 35 }
  },
  // Lake Nakuru Sensors
  {
    id: 'sensor-011',
    name: 'Flamingo Tracker - Colony A',
    type: 'animal_collar',
    status: 'online',
    batteryLevel: 94,
    signalStrength: 96,
    lastPing: new Date(),
    location: { lat: -0.3667, lng: 36.0833 },
    parkId: 'lake-nakuru',
    data: { heartRate: 180, speed: 0, temperature: 40.2 }
  },
  {
    id: 'sensor-012',
    name: 'Weather Station - Lakeside',
    type: 'weather_station',
    status: 'online',
    batteryLevel: 100,
    signalStrength: 100,
    lastPing: new Date(),
    location: { lat: -0.3590, lng: 36.0750 },
    parkId: 'lake-nakuru',
    data: { temperature: 26, humidity: 68, fireRisk: 'low' }
  },
  // Samburu Sensors
  {
    id: 'sensor-013',
    name: 'Grevy Zebra Collar - Stripe',
    type: 'animal_collar',
    status: 'offline',
    batteryLevel: 0,
    signalStrength: 0,
    lastPing: new Date(Date.now() - 86400000),
    location: { lat: 0.5833, lng: 37.5333 },
    parkId: 'samburu',
    data: { heartRate: 0, speed: 0, temperature: 0 }
  },
  {
    id: 'sensor-014',
    name: 'Fire Sensor - Northern Range',
    type: 'fire_sensor',
    status: 'warning',
    batteryLevel: 45,
    signalStrength: 72,
    lastPing: new Date(Date.now() - 900000),
    location: { lat: 0.6012, lng: 37.5567 },
    parkId: 'samburu',
    data: { temperature: 38, humidity: 25, fireRisk: 'high' }
  }
];

export const mockSatelliteConnections: SatelliteConnection[] = [
  {
    id: 'sat-001',
    name: 'Starlink-KE-001',
    status: 'connected',
    coverage: 98,
    latency: 25,
    bandwidth: 150,
    lastSync: new Date()
  },
  {
    id: 'sat-002',
    name: 'Iridium-SAT-042',
    status: 'connected',
    coverage: 95,
    latency: 780,
    bandwidth: 2.4,
    lastSync: new Date(Date.now() - 30000)
  },
  {
    id: 'sat-003',
    name: 'Inmarsat-AFR-007',
    status: 'intermittent',
    coverage: 72,
    latency: 650,
    bandwidth: 1.8,
    lastSync: new Date(Date.now() - 120000)
  },
  {
    id: 'sat-004',
    name: 'Swarm-IoT-156',
    status: 'connected',
    coverage: 88,
    latency: 2500,
    bandwidth: 0.5,
    lastSync: new Date(Date.now() - 60000)
  }
];

export const mockIoTAlerts: IoTAlert[] = [
  {
    id: 'alert-001',
    sensorId: 'sensor-008',
    sensorType: 'fire_sensor',
    alertType: 'fire_detected',
    severity: 'critical',
    message: 'Extreme fire risk detected in Tsavo East - Red Zone. Temperature 42°C, Humidity 18%',
    timestamp: new Date(),
    acknowledged: false,
    location: { lat: -2.9833, lng: 38.4667 }
  },
  {
    id: 'alert-002',
    sensorId: 'sensor-007',
    sensorType: 'motion_sensor',
    alertType: 'motion_alert',
    severity: 'critical',
    message: 'Unauthorized motion detected near Amboseli boundary. Possible intrusion.',
    timestamp: new Date(Date.now() - 300000),
    acknowledged: false,
    location: { lat: -2.6789, lng: 37.2890 }
  },
  {
    id: 'alert-003',
    sensorId: 'sensor-004',
    sensorType: 'smoke_detector',
    alertType: 'low_battery',
    severity: 'warning',
    message: 'Smoke detector at Maasai Mara North Gate running low on battery (23%)',
    timestamp: new Date(Date.now() - 600000),
    acknowledged: true,
    location: { lat: -1.4123, lng: 35.1890 }
  },
  {
    id: 'alert-004',
    sensorId: 'sensor-013',
    sensorType: 'animal_collar',
    alertType: 'signal_lost',
    severity: 'critical',
    message: 'Signal lost from Grevy Zebra collar "Stripe" in Samburu. Last ping 24 hours ago.',
    timestamp: new Date(Date.now() - 86400000),
    acknowledged: false,
    location: { lat: 0.5833, lng: 37.5333 }
  },
  {
    id: 'alert-005',
    sensorId: 'sensor-014',
    sensorType: 'fire_sensor',
    alertType: 'anomaly',
    severity: 'warning',
    message: 'High fire risk detected in Samburu Northern Range. Recommend patrol dispatch.',
    timestamp: new Date(Date.now() - 900000),
    acknowledged: false,
    location: { lat: 0.6012, lng: 37.5567 }
  }
];

export const mockParkIoTStatus: ParkIoTStatus[] = [
  {
    parkId: 'maasai-mara',
    parkName: 'Maasai Mara',
    totalSensors: 4,
    onlineSensors: 3,
    alerts: 1,
    fireRisk: 'moderate',
    coverage: 92
  },
  {
    parkId: 'amboseli',
    parkName: 'Amboseli',
    totalSensors: 3,
    onlineSensors: 2,
    alerts: 1,
    fireRisk: 'low',
    coverage: 78
  },
  {
    parkId: 'tsavo-east',
    parkName: 'Tsavo East',
    totalSensors: 3,
    onlineSensors: 3,
    alerts: 1,
    fireRisk: 'extreme',
    coverage: 86
  },
  {
    parkId: 'lake-nakuru',
    parkName: 'Lake Nakuru',
    totalSensors: 2,
    onlineSensors: 2,
    alerts: 0,
    fireRisk: 'low',
    coverage: 98
  },
  {
    parkId: 'samburu',
    parkName: 'Samburu',
    totalSensors: 2,
    onlineSensors: 0,
    alerts: 2,
    fireRisk: 'high',
    coverage: 36
  }
];
