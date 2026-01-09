export interface HistoricalThreat {
  id: string;
  type: 'poaching' | 'fire' | 'wildlife_conflict' | 'intrusion' | 'drought';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: { lat: number; lng: number };
  timestamp: Date;
  park: string;
  description: string;
  resolved: boolean;
  responseTime: number; // minutes
  casualties?: {
    wildlife: number;
    human: number;
  };
  financialImpact?: number;
}

// Historical threat data for playback simulation
export const historicalThreats: HistoricalThreat[] = [
  {
    id: 'threat-001',
    type: 'poaching',
    severity: 'high',
    location: { lat: -2.85, lng: 38.5 },
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    park: 'Tsavo East',
    description: 'Suspected poachers detected near elephant herd',
    resolved: true,
    responseTime: 15,
    casualties: { wildlife: 0, human: 0 }
  },
  {
    id: 'threat-002',
    type: 'fire',
    severity: 'critical',
    location: { lat: -1.42, lng: 35.18 },
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    park: 'Masai Mara',
    description: 'Bushfire outbreak in northern sector',
    resolved: true,
    responseTime: 45,
    financialImpact: 250000
  },
  {
    id: 'threat-003',
    type: 'wildlife_conflict',
    severity: 'medium',
    location: { lat: -2.68, lng: 37.28 },
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    park: 'Amboseli',
    description: 'Elephant crop raiding incident at buffer zone',
    resolved: true,
    responseTime: 30,
    casualties: { wildlife: 0, human: 0 },
    financialImpact: 45000
  },
  {
    id: 'threat-004',
    type: 'intrusion',
    severity: 'high',
    location: { lat: -0.35, lng: 36.08 },
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    park: 'Lake Nakuru',
    description: 'Unauthorized vehicle detected in restricted zone',
    resolved: true,
    responseTime: 8
  },
  {
    id: 'threat-005',
    type: 'poaching',
    severity: 'critical',
    location: { lat: -3.0, lng: 38.3 },
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    park: 'Tsavo West',
    description: 'Armed poaching gang intercepted',
    resolved: true,
    responseTime: 22,
    casualties: { wildlife: 1, human: 0 }
  },
  {
    id: 'threat-006',
    type: 'fire',
    severity: 'medium',
    location: { lat: 0.55, lng: 37.52 },
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    park: 'Samburu',
    description: 'Controlled burn near community border',
    resolved: true,
    responseTime: 12
  },
  {
    id: 'threat-007',
    type: 'drought',
    severity: 'high',
    location: { lat: -2.65, lng: 37.26 },
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    park: 'Amboseli',
    description: 'Water source critically low - wildlife stress detected',
    resolved: false,
    responseTime: 0
  },
  {
    id: 'threat-008',
    type: 'intrusion',
    severity: 'low',
    location: { lat: -1.37, lng: 36.86 },
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    park: 'Nairobi NP',
    description: 'Tourist vehicle off designated path',
    resolved: true,
    responseTime: 5
  },
  {
    id: 'threat-009',
    type: 'wildlife_conflict',
    severity: 'high',
    location: { lat: 0.15, lng: 38.18 },
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    park: 'Meru',
    description: 'Lion spotted near village livestock enclosure',
    resolved: true,
    responseTime: 18
  },
  {
    id: 'threat-010',
    type: 'poaching',
    severity: 'medium',
    location: { lat: -0.15, lng: 37.31 },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    park: 'Mount Kenya',
    description: 'Snare traps discovered and removed',
    resolved: true,
    responseTime: 35
  }
];

export const getThreatsByTimeRange = (startTime: Date, endTime: Date) => {
  return historicalThreats.filter(
    threat => threat.timestamp >= startTime && threat.timestamp <= endTime
  );
};

export const getThreatsByPark = (parkId: string) => {
  return historicalThreats.filter(
    threat => threat.park.toLowerCase().includes(parkId.toLowerCase())
  );
};

export const getThreatStats = () => {
  const total = historicalThreats.length;
  const resolved = historicalThreats.filter(t => t.resolved).length;
  const avgResponseTime = historicalThreats.reduce((acc, t) => acc + t.responseTime, 0) / total;
  const bySeverity = {
    critical: historicalThreats.filter(t => t.severity === 'critical').length,
    high: historicalThreats.filter(t => t.severity === 'high').length,
    medium: historicalThreats.filter(t => t.severity === 'medium').length,
    low: historicalThreats.filter(t => t.severity === 'low').length
  };
  
  return { total, resolved, avgResponseTime, bySeverity };
};
