import { Card, CardContent } from '@/components/ui/card';
import { Flame, Camera, AlertTriangle, Shield, TrendingUp, Radio } from 'lucide-react';
import { motion } from 'framer-motion';

interface FireMetricsCardsProps {
  totalSensors: number;
  activeSensors: number;
  triggeredSensors: number;
  activeAlerts: number;
  riskZonesHigh: number;
  avgAiConfidence: number;
}

export const FireMetricsCards = ({
  totalSensors,
  activeSensors,
  triggeredSensors,
  activeAlerts,
  riskZonesHigh,
  avgAiConfidence
}: FireMetricsCardsProps) => {
  const metrics = [
    {
      label: 'Total Sensors',
      value: totalSensors,
      icon: Radio,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    {
      label: 'Active Monitoring',
      value: activeSensors,
      icon: Camera,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Sensors Triggered',
      value: triggeredSensors,
      icon: AlertTriangle,
      color: triggeredSensors > 0 ? 'text-red-400' : 'text-muted-foreground',
      bgColor: triggeredSensors > 0 ? 'bg-red-500/10' : 'bg-muted/10',
      pulse: triggeredSensors > 0
    },
    {
      label: 'Active Fire Alerts',
      value: activeAlerts,
      icon: Flame,
      color: activeAlerts > 0 ? 'text-orange-400' : 'text-muted-foreground',
      bgColor: activeAlerts > 0 ? 'bg-orange-500/10' : 'bg-muted/10',
      pulse: activeAlerts > 0
    },
    {
      label: 'High Risk Zones',
      value: riskZonesHigh,
      icon: Shield,
      color: riskZonesHigh > 0 ? 'text-yellow-400' : 'text-green-400',
      bgColor: riskZonesHigh > 0 ? 'bg-yellow-500/10' : 'bg-green-500/10'
    },
    {
      label: 'AI Confidence',
      value: `${avgAiConfidence}%`,
      icon: TrendingUp,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className={`bg-card/50 backdrop-blur border-border/50 ${metric.pulse ? 'animate-pulse' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
