import { motion } from 'framer-motion';
import { WeatherData } from '@/types/fire';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, Eye } from 'lucide-react';

interface WeatherOverlayProps {
  weatherData: WeatherData[];
  mapBounds: { minLat: number; maxLat: number; minLng: number; maxLng: number };
}

// Park center coordinates
const parkCoordinates: Record<string, { lat: number; lng: number }> = {
  'masai-mara': { lat: -1.4, lng: 35.2 },
  'amboseli': { lat: -2.65, lng: 37.25 },
  'tsavo-east': { lat: -2.9, lng: 38.5 },
  'lake-nakuru': { lat: -0.35, lng: 36.1 },
  'samburu': { lat: 0.55, lng: 37.5 }
};

const getWeatherIcon = (conditions: string) => {
  const lowerConditions = conditions.toLowerCase();
  if (lowerConditions.includes('rain') || lowerConditions.includes('storm')) return CloudRain;
  if (lowerConditions.includes('cloud')) return Cloud;
  return Sun;
};

export const WeatherOverlay = ({ weatherData, mapBounds }: WeatherOverlayProps) => {
  const latRange = mapBounds.maxLat - mapBounds.minLat;
  const lngRange = mapBounds.maxLng - mapBounds.minLng;

  const getPosition = (lat: number, lng: number) => {
    const x = ((lng - mapBounds.minLng) / lngRange) * 100;
    const y = ((mapBounds.maxLat - lat) / latRange) * 100;
    return { x: Math.max(10, Math.min(90, x)), y: Math.max(10, Math.min(90, y)) };
  };

  return (
    <>
      {weatherData.map((weather, index) => {
        const coords = parkCoordinates[weather.parkId];
        if (!coords) return null;

        const pos = getPosition(coords.lat, coords.lng);
        const WeatherIcon = getWeatherIcon(weather.conditions);

        return (
          <motion.div
            key={weather.parkId}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="absolute pointer-events-none"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div className="bg-background/80 backdrop-blur border border-cyan-500/30 rounded-lg p-2 shadow-lg">
              <div className="flex items-center gap-2 mb-1">
                <WeatherIcon className="h-5 w-5 text-cyan-400" />
                <span className="text-sm font-medium">{weather.conditions}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                <div className="flex items-center gap-1">
                  <Thermometer className="h-3 w-3 text-red-400" />
                  <span>{weather.temperature}°C</span>
                </div>
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
                  <span>{weather.visibility} km</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </>
  );
};
