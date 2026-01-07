import { motion } from 'framer-motion';
import { PoachingRiskZone } from '@/types/fire';

interface PoachingHeatmapProps {
  zones: PoachingRiskZone[];
  mapBounds: { minLat: number; maxLat: number; minLng: number; maxLng: number };
  onSelect: (zone: PoachingRiskZone) => void;
}

const getRiskGradient = (riskLevel: number) => {
  if (riskLevel >= 80) return 'from-red-500/40 to-red-600/20';
  if (riskLevel >= 60) return 'from-orange-500/40 to-orange-600/20';
  if (riskLevel >= 40) return 'from-yellow-500/40 to-yellow-600/20';
  return 'from-green-500/30 to-green-600/10';
};

const getRiskBorder = (riskLevel: number) => {
  if (riskLevel >= 80) return 'border-red-500/60';
  if (riskLevel >= 60) return 'border-orange-500/60';
  if (riskLevel >= 40) return 'border-yellow-500/60';
  return 'border-green-500/40';
};

export const PoachingHeatmap = ({ zones, mapBounds, onSelect }: PoachingHeatmapProps) => {
  const latRange = mapBounds.maxLat - mapBounds.minLat;
  const lngRange = mapBounds.maxLng - mapBounds.minLng;

  const getPosition = (lat: number, lng: number) => {
    const x = ((lng - mapBounds.minLng) / lngRange) * 100;
    const y = ((mapBounds.maxLat - lat) / latRange) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  const getSize = (radius: number) => {
    // Scale radius to pixels (approximate)
    return Math.min(200, Math.max(60, radius * 8));
  };

  return (
    <>
      {zones.map((zone, index) => {
        const pos = getPosition(zone.center.lat, zone.center.lng);
        const size = getSize(zone.radius);

        return (
          <motion.div
            key={zone.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.15 }}
            className="absolute cursor-pointer group"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => onSelect(zone)}
          >
            <motion.div
              className={`rounded-full bg-gradient-radial ${getRiskGradient(zone.riskLevel)} border ${getRiskBorder(zone.riskLevel)}`}
              style={{ width: size, height: size }}
              animate={{
                scale: zone.riskLevel >= 70 ? [1, 1.05, 1] : 1,
                opacity: [0.7, 0.9, 0.7]
              }}
              transition={{
                repeat: Infinity,
                duration: zone.riskLevel >= 70 ? 2 : 3
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-white drop-shadow-lg">
                  {zone.riskLevel}%
                </span>
              </div>
            </motion.div>

            {/* Hover tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
              <div className="bg-background/95 backdrop-blur border border-border rounded-lg p-3 shadow-lg min-w-[200px]">
                <p className="font-medium text-sm mb-1">Poaching Risk Zone</p>
                <p className="text-xs text-muted-foreground mb-2">
                  Risk Level: <span className={zone.riskLevel >= 70 ? 'text-red-400' : 'text-yellow-400'}>
                    {zone.riskLevel}%
                  </span>
                </p>
                <div className="text-xs space-y-1">
                  {zone.factors.slice(0, 2).map((factor, i) => (
                    <p key={i} className="text-muted-foreground">• {factor}</p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </>
  );
};
