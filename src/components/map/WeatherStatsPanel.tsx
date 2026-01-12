import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ParkWeatherData, getNetworkWeatherStats } from '@/data/weatherData';
import { 
  Thermometer, Droplets, Flame, AlertTriangle, 
  TrendingUp, RefreshCw, Cloud
} from 'lucide-react';
import { motion } from 'framer-motion';

interface WeatherStatsPanelProps {
  weatherData: ParkWeatherData[];
  onRefresh: () => void;
  lastUpdate: Date;
}

export const WeatherStatsPanel = ({ weatherData, onRefresh, lastUpdate }: WeatherStatsPanelProps) => {
  const stats = getNetworkWeatherStats(weatherData);
  
  const getFireRiskColor = (score: number) => {
    if (score >= 75) return 'text-red-500';
    if (score >= 55) return 'text-orange-500';
    if (score >= 35) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <Card className="bg-card/90 backdrop-blur border-border/50">
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Cloud className="h-4 w-4 text-cyan-400" />
            Weather & Fire Risk
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-muted-foreground">
              {lastUpdate.toLocaleTimeString()}
            </span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onRefresh}>
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-3">
        {/* Network averages */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-muted/30 rounded-lg p-2 text-center">
            <Thermometer className="h-4 w-4 mx-auto mb-1 text-orange-400" />
            <div className="text-lg font-bold">{stats.avgTemp}°C</div>
            <div className="text-[9px] text-muted-foreground">Avg Temp</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-2 text-center">
            <Droplets className="h-4 w-4 mx-auto mb-1 text-blue-400" />
            <div className="text-lg font-bold">{stats.avgHumidity}%</div>
            <div className="text-[9px] text-muted-foreground">Avg Humidity</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-2 text-center">
            <Flame className={`h-4 w-4 mx-auto mb-1 ${getFireRiskColor(stats.avgFireRisk)}`} />
            <div className={`text-lg font-bold ${getFireRiskColor(stats.avgFireRisk)}`}>
              {stats.avgFireRisk}%
            </div>
            <div className="text-[9px] text-muted-foreground">Avg Fire Risk</div>
          </div>
        </div>

        {/* Fire risk breakdown */}
        <div className="space-y-2">
          <div className="text-xs font-medium flex items-center gap-1">
            <AlertTriangle className="h-3 w-3 text-amber-400" />
            Fire Risk Status
          </div>
          <div className="flex gap-2">
            {stats.extremeFireCount > 0 && (
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px]">
                {stats.extremeFireCount} Extreme
              </Badge>
            )}
            {stats.highFireCount > 0 && (
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[10px]">
                {stats.highFireCount} High
              </Badge>
            )}
            {stats.totalAlerts > 0 && (
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]">
                {stats.totalAlerts} Alerts
              </Badge>
            )}
            {stats.extremeFireCount === 0 && stats.highFireCount === 0 && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px]">
                All Clear
              </Badge>
            )}
          </div>
        </div>

        {/* High risk parks */}
        {(stats.extremeFireParks.length > 0 || stats.highFireParks.length > 0) && (
          <div className="space-y-1.5 pt-2 border-t border-border/50">
            <div className="text-[10px] text-muted-foreground">Parks at Risk:</div>
            {stats.extremeFireParks.map(park => (
              <motion.div 
                key={park}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-xs p-1.5 rounded bg-red-500/10 border border-red-500/30"
              >
                <Flame className="h-3 w-3 text-red-500 animate-pulse" />
                <span className="text-red-400 truncate flex-1">{park}</span>
                <Badge variant="outline" className="text-[8px] h-4 text-red-400 border-red-500/50">
                  EXTREME
                </Badge>
              </motion.div>
            ))}
            {stats.highFireParks.slice(0, 3).map(park => (
              <motion.div 
                key={park}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-xs p-1.5 rounded bg-orange-500/10 border border-orange-500/30"
              >
                <Flame className="h-3 w-3 text-orange-400" />
                <span className="text-orange-300 truncate flex-1">{park}</span>
                <Badge variant="outline" className="text-[8px] h-4 text-orange-400 border-orange-500/50">
                  HIGH
                </Badge>
              </motion.div>
            ))}
          </div>
        )}

        {/* Park weather list */}
        <div className="space-y-1 pt-2 border-t border-border/50">
          <div className="text-[10px] text-muted-foreground mb-1">All Parks:</div>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {weatherData
              .sort((a, b) => b.fireRiskScore - a.fireRiskScore)
              .map(weather => (
                <div 
                  key={weather.parkId}
                  className="flex items-center justify-between text-[10px] p-1 rounded hover:bg-muted/30"
                >
                  <span className="truncate flex-1">{weather.parkName.split(' ')[0]}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">{Math.round(weather.temperature)}°</span>
                    <span className={`font-mono ${getFireRiskColor(weather.fireRiskScore)}`}>
                      {weather.fireRiskScore}%
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
