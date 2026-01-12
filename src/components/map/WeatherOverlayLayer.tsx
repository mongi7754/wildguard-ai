import { motion, AnimatePresence } from 'framer-motion';
import { ParkWeatherData } from '@/data/weatherData';
import { 
  Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, 
  AlertTriangle, Flame, Eye, Gauge
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface WeatherOverlayLayerProps {
  weatherData: ParkWeatherData[];
  mapBounds: { minLat: number; maxLat: number; minLng: number; maxLng: number };
  zoom: number;
  showDetails?: boolean;
}

const getWeatherIcon = (conditions: string) => {
  const lowerConditions = conditions.toLowerCase();
  if (lowerConditions.includes('rain')) return CloudRain;
  if (lowerConditions.includes('cloud')) return Cloud;
  if (lowerConditions.includes('wind')) return Wind;
  return Sun;
};

const getFireRiskColor = (risk: 'low' | 'moderate' | 'high' | 'extreme') => {
  switch (risk) {
    case 'extreme': return 'bg-red-600 text-white border-red-500';
    case 'high': return 'bg-orange-500 text-white border-orange-400';
    case 'moderate': return 'bg-yellow-500 text-black border-yellow-400';
    case 'low': return 'bg-green-500 text-white border-green-400';
  }
};

const getFireRiskGlow = (risk: 'low' | 'moderate' | 'high' | 'extreme') => {
  switch (risk) {
    case 'extreme': return 'shadow-[0_0_20px_rgba(239,68,68,0.5)]';
    case 'high': return 'shadow-[0_0_15px_rgba(249,115,22,0.4)]';
    case 'moderate': return 'shadow-[0_0_10px_rgba(234,179,8,0.3)]';
    case 'low': return 'shadow-[0_0_8px_rgba(34,197,94,0.3)]';
  }
};

export const WeatherOverlayLayer = ({ 
  weatherData, 
  mapBounds, 
  zoom,
  showDetails = true 
}: WeatherOverlayLayerProps) => {
  const latRange = mapBounds.maxLat - mapBounds.minLat;
  const lngRange = mapBounds.maxLng - mapBounds.minLng;

  const getPosition = (lat: number, lng: number) => {
    const x = ((lng - mapBounds.minLng) / lngRange) * 100;
    const y = ((mapBounds.maxLat - lat) / latRange) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  return (
    <>
      <AnimatePresence>
        {weatherData.map((weather, index) => {
          const pos = getPosition(weather.lat, weather.lng);
          const WeatherIcon = getWeatherIcon(weather.conditions);
          
          // Adjust visibility based on zoom
          const showCompact = zoom < 1.25;
          const showFull = zoom >= 1.5;

          return (
            <motion.div
              key={weather.parkId}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.05 }}
              className="absolute pointer-events-auto z-15"
              style={{ 
                left: `${pos.x}%`, 
                top: `${pos.y}%`, 
                transform: `translate(-50%, -50%) scale(${1/zoom})`
              }}
            >
              {showCompact ? (
                // Compact view - just fire risk indicator
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${getFireRiskColor(weather.fireRisk)} ${getFireRiskGlow(weather.fireRisk)}`}
                  title={`${weather.parkName}: ${weather.temperature}°C, Fire Risk: ${weather.fireRisk}`}
                >
                  {weather.fireRisk === 'extreme' || weather.fireRisk === 'high' ? (
                    <Flame className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-bold">{Math.round(weather.temperature)}°</span>
                  )}
                </div>
              ) : (
                // Full weather card
                <div className={`bg-background/90 backdrop-blur border rounded-lg overflow-hidden ${getFireRiskGlow(weather.fireRisk)}`}>
                  {/* Header with fire risk */}
                  <div className={`px-3 py-1.5 flex items-center justify-between gap-3 ${getFireRiskColor(weather.fireRisk)}`}>
                    <div className="flex items-center gap-1.5">
                      <Flame className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-bold uppercase">
                        {weather.fireRisk} RISK
                      </span>
                    </div>
                    <span className="text-[10px] font-mono">{weather.fireRiskScore}%</span>
                  </div>
                  
                  <div className="p-2.5 space-y-2">
                    {/* Main weather info */}
                    <div className="flex items-center gap-2">
                      <WeatherIcon className="h-5 w-5 text-cyan-400" />
                      <div>
                        <div className="text-sm font-semibold">{Math.round(weather.temperature)}°C</div>
                        <div className="text-[10px] text-muted-foreground">{weather.conditions}</div>
                      </div>
                    </div>
                    
                    {showFull && showDetails && (
                      <>
                        {/* Detailed metrics grid */}
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
                          <div className="flex items-center gap-1">
                            <Droplets className="h-3 w-3 text-blue-400" />
                            <span>{weather.humidity}%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Wind className="h-3 w-3 text-cyan-400" />
                            <span>{weather.windSpeed} km/h {weather.windDirection}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3 text-purple-400" />
                            <span>{weather.visibility.toFixed(0)} km</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Gauge className="h-3 w-3 text-amber-400" />
                            <span>UV {weather.uvIndex}</span>
                          </div>
                        </div>
                        
                        {/* Alerts */}
                        {weather.alerts.length > 0 && (
                          <div className="pt-1 border-t border-border/50">
                            {weather.alerts.slice(0, 2).map((alert, idx) => (
                              <div 
                                key={idx} 
                                className={`flex items-center gap-1 text-[9px] ${
                                  alert.severity === 'critical' ? 'text-red-400' :
                                  alert.severity === 'warning' ? 'text-amber-400' :
                                  'text-blue-400'
                                }`}
                              >
                                <AlertTriangle className="h-2.5 w-2.5" />
                                <span className="truncate">{alert.message}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </>
  );
};
