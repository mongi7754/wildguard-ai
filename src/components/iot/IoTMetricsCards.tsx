import { motion } from 'framer-motion';
import { 
  Radio, 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  Flame,
  Satellite,
  Activity
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { IoTSensor, SatelliteConnection, IoTAlert, ParkIoTStatus } from '@/types/iot';

interface IoTMetricsCardsProps {
  sensors: IoTSensor[];
  connections: SatelliteConnection[];
  alerts: IoTAlert[];
  parkStatus: ParkIoTStatus[];
}

export function IoTMetricsCards({ sensors, connections, alerts, parkStatus }: IoTMetricsCardsProps) {
  const onlineSensors = sensors.filter(s => s.status === 'online').length;
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length;
  const activeSatellites = connections.filter(c => c.status === 'connected').length;
  const avgCoverage = parkStatus.reduce((acc, p) => acc + p.coverage, 0) / parkStatus.length;
  const highFireRiskParks = parkStatus.filter(p => p.fireRisk === 'high' || p.fireRisk === 'extreme').length;

  const metrics = [
    {
      title: 'Active Sensors',
      value: onlineSensors,
      total: sensors.length,
      icon: Radio,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      progress: (onlineSensors / sensors.length) * 100
    },
    {
      title: 'Satellite Uplinks',
      value: activeSatellites,
      total: connections.length,
      icon: Satellite,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      progress: (activeSatellites / connections.length) * 100
    },
    {
      title: 'Critical Alerts',
      value: criticalAlerts,
      total: alerts.length,
      icon: AlertTriangle,
      color: criticalAlerts > 0 ? 'text-red-500' : 'text-muted-foreground',
      bgColor: criticalAlerts > 0 ? 'bg-red-500/10' : 'bg-muted/10',
      progress: alerts.length > 0 ? (criticalAlerts / alerts.length) * 100 : 0,
      alert: criticalAlerts > 0
    },
    {
      title: 'Network Coverage',
      value: `${Math.round(avgCoverage)}%`,
      icon: Wifi,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      progress: avgCoverage
    },
    {
      title: 'Fire Risk Zones',
      value: highFireRiskParks,
      total: parkStatus.length,
      icon: Flame,
      color: highFireRiskParks > 0 ? 'text-orange-500' : 'text-muted-foreground',
      bgColor: highFireRiskParks > 0 ? 'bg-orange-500/10' : 'bg-muted/10',
      progress: (highFireRiskParks / parkStatus.length) * 100,
      alert: highFireRiskParks > 0
    },
    {
      title: 'Data Ingestion',
      value: '2.4k',
      subtitle: 'events/min',
      icon: Activity,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      progress: 78
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className={`p-4 bg-card/50 backdrop-blur border-primary/20 ${metric.alert ? 'border-destructive/50' : ''}`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
              </div>
              {metric.alert && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">{metric.value}</span>
                {metric.total && (
                  <span className="text-sm text-muted-foreground">/ {metric.total}</span>
                )}
                {metric.subtitle && (
                  <span className="text-xs text-muted-foreground">{metric.subtitle}</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{metric.title}</p>
            </div>

            <div className="mt-3">
              <Progress 
                value={metric.progress} 
                className={`h-1 ${metric.alert ? '[&>div]:bg-red-500' : ''}`}
              />
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
