import { motion } from 'framer-motion';
import { AnimalTracking } from '@/types/fire';
import { Badge } from '@/components/ui/badge';

interface AnimalTrackingLayerProps {
  animals: AnimalTracking[];
  mapBounds: { minLat: number; maxLat: number; minLng: number; maxLng: number };
  onSelect: (animal: AnimalTracking) => void;
}

const getSpeciesEmoji = (species: string) => {
  switch (species.toLowerCase()) {
    case 'elephant': return '🐘';
    case 'lion': return '🦁';
    case 'rhino': return '🦏';
    case 'cheetah': return '🐆';
    case 'giraffe': return '🦒';
    case 'zebra': return '🦓';
    default: return '🦌';
  }
};

const getHealthColor = (status: string) => {
  switch (status) {
    case 'healthy': return 'border-green-400 bg-green-500/20';
    case 'concern': return 'border-yellow-400 bg-yellow-500/20';
    case 'critical': return 'border-red-400 bg-red-500/20';
    default: return 'border-muted';
  }
};

export const AnimalTrackingLayer = ({ animals, mapBounds, onSelect }: AnimalTrackingLayerProps) => {
  const latRange = mapBounds.maxLat - mapBounds.minLat;
  const lngRange = mapBounds.maxLng - mapBounds.minLng;

  const getPosition = (lat: number, lng: number) => {
    const x = ((lng - mapBounds.minLng) / lngRange) * 100;
    const y = ((mapBounds.maxLat - lat) / latRange) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  return (
    <>
      {animals.map((animal, index) => {
        const pos = getPosition(animal.location.lat, animal.location.lng);
        return (
          <motion.div
            key={animal.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="absolute cursor-pointer group"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            onClick={() => onSelect(animal)}
          >
            <div className={`relative p-1.5 rounded-full border-2 ${getHealthColor(animal.healthStatus)} backdrop-blur`}>
              <span className="text-lg">{getSpeciesEmoji(animal.species)}</span>
              
              {/* Direction indicator */}
              {animal.speed > 0 && (
                <motion.div
                  className="absolute -right-1 -top-1 w-3 h-3 bg-cyan-400 rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              )}
            </div>

            {/* Hover tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
              <div className="bg-background/95 backdrop-blur border border-border rounded-lg p-2 shadow-lg min-w-[150px]">
                <p className="font-medium text-sm">{animal.name}</p>
                <p className="text-xs text-muted-foreground">{animal.species}</p>
                <div className="flex items-center gap-2 mt-1 text-xs">
                  <Badge variant="outline" className="text-[10px]">
                    {animal.speed > 0 ? `${animal.speed} km/h ${animal.direction}` : 'Stationary'}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <span>🔋 {animal.batteryLevel}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </>
  );
};
