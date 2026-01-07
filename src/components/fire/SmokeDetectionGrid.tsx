import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Radio, Satellite, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { FireSensor } from '@/types/fire';
import { motion } from 'framer-motion';

interface SmokeDetectionGridProps {
  sensors: FireSensor[];
}

const getSensorIcon = (type: string) => {
  switch (type) {
    case 'smoke_camera': return Camera;
    case 'ground_sensor': return Radio;
    case 'satellite': return Satellite;
    default: return Radio;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500/20 text-green-400';
    case 'triggered': return 'bg-red-500/20 text-red-400 animate-pulse';
    case 'offline': return 'bg-muted text-muted-foreground';
    case 'maintenance': return 'bg-yellow-500/20 text-yellow-400';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getSmokeLevel = (level: number) => {
  if (level >= 70) return { color: 'text-red-400', label: 'Critical' };
  if (level >= 40) return { color: 'text-orange-400', label: 'Warning' };
  if (level >= 20) return { color: 'text-yellow-400', label: 'Elevated' };
  return { color: 'text-green-400', label: 'Normal' };
};

const parkNames: Record<string, string> = {
  'masai-mara': 'Masai Mara',
  'amboseli': 'Amboseli',
  'tsavo-east': 'Tsavo East',
  'lake-nakuru': 'Lake Nakuru',
  'samburu': 'Samburu'
};

export const SmokeDetectionGrid = ({ sensors }: SmokeDetectionGridProps) => {
  const triggeredSensors = sensors.filter(s => s.status === 'triggered');
  const activeSensors = sensors.filter(s => s.status === 'active');

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-purple-400" />
            AI Smoke Detection Sensors
          </div>
          <div className="flex items-center gap-2 text-sm font-normal">
            <Badge variant="outline" className="bg-green-500/10 text-green-400">
              {activeSensors.length} Active
            </Badge>
            {triggeredSensors.length > 0 && (
              <Badge variant="outline" className="bg-red-500/10 text-red-400 animate-pulse">
                {triggeredSensors.length} Triggered
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sensors.map((sensor, index) => {
            const Icon = getSensorIcon(sensor.type);
            const smokeInfo = getSmokeLevel(sensor.lastReading.smokeLevel);

            return (
              <motion.div
                key={sensor.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg border ${
                  sensor.status === 'triggered' 
                    ? 'border-red-500/50 bg-red-500/5' 
                    : 'border-border/50 bg-background/50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${getStatusColor(sensor.status)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{sensor.name}</p>
                      <p className="text-xs text-muted-foreground">{parkNames[sensor.parkId]}</p>
                    </div>
                  </div>
                  {sensor.status === 'active' ? (
                    <Wifi className="h-4 w-4 text-green-400" />
                  ) : sensor.status === 'triggered' ? (
                    <AlertTriangle className="h-4 w-4 text-red-400 animate-pulse" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="text-center p-2 rounded bg-muted/30">
                    <p className={`text-lg font-bold ${smokeInfo.color}`}>
                      {sensor.lastReading.smokeLevel}%
                    </p>
                    <p className="text-xs text-muted-foreground">Smoke</p>
                  </div>
                  <div className="text-center p-2 rounded bg-muted/30">
                    <p className="text-lg font-bold text-orange-400">
                      {sensor.lastReading.temperature}°C
                    </p>
                    <p className="text-xs text-muted-foreground">Temp</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">AI Confidence</span>
                  <span className="font-mono text-cyan-400">{sensor.aiConfidence}%</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
