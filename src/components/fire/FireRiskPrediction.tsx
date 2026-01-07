import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Flame, Thermometer, Droplets, Wind, TreeDeciduous, AlertTriangle } from 'lucide-react';
import { FireRiskZone } from '@/types/fire';
import { motion } from 'framer-motion';

interface FireRiskPredictionProps {
  riskZones: FireRiskZone[];
}

const getRiskColor = (level: string) => {
  switch (level) {
    case 'extreme': return 'bg-red-500/20 text-red-400 border-red-500/50';
    case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
    case 'moderate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    case 'low': return 'bg-green-500/20 text-green-400 border-green-500/50';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getRiskBgGradient = (level: string) => {
  switch (level) {
    case 'extreme': return 'from-red-500/10 to-red-600/5';
    case 'high': return 'from-orange-500/10 to-orange-600/5';
    case 'moderate': return 'from-yellow-500/10 to-yellow-600/5';
    case 'low': return 'from-green-500/10 to-green-600/5';
    default: return 'from-muted/10 to-muted/5';
  }
};

const parkNames: Record<string, string> = {
  'masai-mara': 'Masai Mara',
  'amboseli': 'Amboseli',
  'tsavo-east': 'Tsavo East',
  'lake-nakuru': 'Lake Nakuru',
  'samburu': 'Samburu'
};

export const FireRiskPrediction = ({ riskZones }: FireRiskPredictionProps) => {
  const sortedZones = [...riskZones].sort((a, b) => b.prediction.probability - a.prediction.probability);

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Flame className="h-5 w-5 text-orange-400" />
          AI Fire Risk Predictions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedZones.map((zone, index) => (
          <motion.div
            key={zone.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border bg-gradient-to-r ${getRiskBgGradient(zone.riskLevel)}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="font-medium">{parkNames[zone.parkId] || zone.parkId}</span>
                <Badge className={getRiskColor(zone.riskLevel)}>
                  {zone.riskLevel.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <span className="font-mono">{(zone.prediction.probability * 100).toFixed(0)}%</span>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Fire Probability</span>
                <span>{zone.prediction.timeframe}</span>
              </div>
              <Progress 
                value={zone.prediction.probability * 100} 
                className="h-2"
              />
            </div>

            <div className="grid grid-cols-5 gap-2 mb-3">
              <div className="flex flex-col items-center p-2 rounded bg-background/50">
                <Thermometer className="h-4 w-4 text-red-400 mb-1" />
                <span className="text-xs font-mono">{zone.factors.temperature}°C</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded bg-background/50">
                <Droplets className="h-4 w-4 text-blue-400 mb-1" />
                <span className="text-xs font-mono">{zone.factors.humidity}%</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded bg-background/50">
                <Wind className="h-4 w-4 text-cyan-400 mb-1" />
                <span className="text-xs font-mono">{zone.factors.windSpeed}km/h</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded bg-background/50">
                <TreeDeciduous className="h-4 w-4 text-amber-400 mb-1" />
                <span className="text-xs font-mono">{zone.factors.vegetationDryness}%</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded bg-background/50">
                <Flame className="h-4 w-4 text-orange-400 mb-1" />
                <span className="text-xs font-mono">{zone.factors.historicalIncidents}</span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground bg-background/30 p-2 rounded">
              <strong>AI Recommendation:</strong> {zone.prediction.recommendation}
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};
