// Satellite IoT Types

export interface IoTSensor {
  id: string;
  name: string;
  type: 'animal_collar' | 'fire_sensor' | 'motion_sensor' | 'smoke_detector' | 'weather_station';
  status: 'online' | 'offline' | 'warning' | 'critical';
  batteryLevel: number;
  signalStrength: number;
  lastPing: Date;
  location: { lat: number; lng: number };
  parkId: string;
  data: SensorData;
}

export interface SensorData {
  temperature?: number;
  humidity?: number;
  smokeLevel?: number;
  motionDetected?: boolean;
  heartRate?: number;
  speed?: number;
  altitude?: number;
  fireRisk?: 'low' | 'moderate' | 'high' | 'extreme';
}

export interface SatelliteConnection {
  id: string;
  name: string;
  status: 'connected' | 'intermittent' | 'disconnected';
  coverage: number;
  latency: number;
  bandwidth: number;
  lastSync: Date;
}

export interface IoTAlert {
  id: string;
  sensorId: string;
  sensorType: IoTSensor['type'];
  alertType: 'fire_detected' | 'smoke_detected' | 'motion_alert' | 'low_battery' | 'signal_lost' | 'anomaly';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  location: { lat: number; lng: number };
}

export interface ParkIoTStatus {
  parkId: string;
  parkName: string;
  totalSensors: number;
  onlineSensors: number;
  alerts: number;
  fireRisk: 'low' | 'moderate' | 'high' | 'extreme';
  coverage: number;
}
