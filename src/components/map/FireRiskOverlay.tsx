import { motion } from 'framer-motion';
import { FireRiskZone } from '@/types/fire';

interface FireRiskOverlayProps {
  zones: FireRiskZone[];
  mapBounds: { minLat: number; maxLat: number; minLng: number; maxLng: number };
  onSelect: (zone: FireRiskZone) => void;
}

const getRiskColor = (level: string) => {
  switch (level) {
    case 'extreme': return { fill: 'rgba(239, 68, 68, 0.35)', stroke: 'rgba(239, 68, 68, 0.8)' };
    case 'high': return { fill: 'rgba(249, 115, 22, 0.3)', stroke: 'rgba(249, 115, 22, 0.7)' };
    case 'moderate': return { fill: 'rgba(234, 179, 8, 0.25)', stroke: 'rgba(234, 179, 8, 0.6)' };
    case 'low': return { fill: 'rgba(34, 197, 94, 0.2)', stroke: 'rgba(34, 197, 94, 0.5)' };
    default: return { fill: 'rgba(100, 100, 100, 0.2)', stroke: 'rgba(100, 100, 100, 0.5)' };
  }
};

export const FireRiskOverlay = ({ zones, mapBounds, onSelect }: FireRiskOverlayProps) => {
  const latRange = mapBounds.maxLat - mapBounds.minLat;
  const lngRange = mapBounds.maxLng - mapBounds.minLng;

  const getPosition = (lat: number, lng: number) => {
    const x = ((lng - mapBounds.minLng) / lngRange) * 100;
    const y = ((mapBounds.maxLat - lat) / latRange) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  const getSize = (radius: number) => {
    return Math.min(180, Math.max(50, radius * 6));
  };

  return (
    <>
      {zones.map((zone, index) => {
        const pos = getPosition(zone.center.lat, zone.center.lng);
        const size = getSize(zone.radius);
        const colors = getRiskColor(zone.riskLevel);
        const isHighRisk = zone.riskLevel === 'extreme' || zone.riskLevel === 'high';

        return (
          <motion.div
            key={zone.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.15, type: 'spring' }}
            className="absolute cursor-pointer group"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => onSelect(zone)}
          >
            <motion.div
              className="rounded-full flex items-center justify-center"
              style={{
                width: size,
                height: size,
                backgroundColor: colors.fill,
                border: `2px dashed ${colors.stroke}`
              }}
              animate={isHighRisk ? {
                scale: [1, 1.05, 1],
                borderColor: [colors.stroke, 'rgba(255,255,255,0.5)', colors.stroke]
              } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <div className="text-center">
                <span className="text-xl">🔥</span>
                <p className="text-[10px] font-bold text-white drop-shadow-lg uppercase">
                  {zone.riskLevel}
                </p>
              </div>
            </motion.div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
              <div className="bg-background/95 backdrop-blur border border-border rounded-lg p-3 shadow-lg min-w-[200px]">
                <p className="font-medium text-sm mb-1">Fire Risk Zone</p>
                <div className="space-y-1 text-xs">
                  <p>
                    <span className="text-muted-foreground">Risk Level: </span>
                    <span className={
                      zone.riskLevel === 'extreme' ? 'text-red-400' :
                      zone.riskLevel === 'high' ? 'text-orange-400' :
                      zone.riskLevel === 'moderate' ? 'text-yellow-400' :
                      'text-green-400'
                    }>
                      {zone.riskLevel.toUpperCase()}
                    </span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Probability: </span>
                    <span>{(zone.prediction.probability * 100).toFixed(0)}%</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Timeframe: </span>
                    <span>{zone.prediction.timeframe}</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </>
  );
};
