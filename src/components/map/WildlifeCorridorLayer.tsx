import { motion } from 'framer-motion';
import { WildlifeCorridor, realKenyaParks } from '@/data/kenyaParksRealData';

interface WildlifeCorridorLayerProps {
  corridors: WildlifeCorridor[];
  mapBounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
  zoom: number;
}

export const WildlifeCorridorLayer = ({ corridors, mapBounds, zoom }: WildlifeCorridorLayerProps) => {
  const getPosition = (lat: number, lng: number) => {
    const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;
    const y = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  const getParkById = (id: string) => realKenyaParks.find(p => p.id === id);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        {corridors.map(corridor => (
          <linearGradient key={`gradient-${corridor.id}`} id={`corridor-gradient-${corridor.id}`}>
            <stop offset="0%" stopColor={corridor.status === 'open' ? '#22c55e' : corridor.status === 'restricted' ? '#f59e0b' : '#ef4444'} stopOpacity="0.6" />
            <stop offset="50%" stopColor={corridor.status === 'open' ? '#22c55e' : corridor.status === 'restricted' ? '#f59e0b' : '#ef4444'} stopOpacity="0.9" />
            <stop offset="100%" stopColor={corridor.status === 'open' ? '#22c55e' : corridor.status === 'restricted' ? '#f59e0b' : '#ef4444'} stopOpacity="0.6" />
          </linearGradient>
        ))}
      </defs>
      
      {corridors.map(corridor => {
        const parks = corridor.parks.map(getParkById).filter(Boolean);
        if (parks.length < 2) return null;

        // Draw lines between consecutive parks in corridor
        const lines: JSX.Element[] = [];
        for (let i = 0; i < parks.length - 1; i++) {
          const park1 = parks[i]!;
          const park2 = parks[i + 1]!;
          const pos1 = getPosition(park1.lat, park1.lng);
          const pos2 = getPosition(park2.lat, park2.lng);

          lines.push(
            <g key={`${corridor.id}-line-${i}`}>
              {/* Animated dashed line for migration path */}
              <motion.line
                x1={`${pos1.x}%`}
                y1={`${pos1.y}%`}
                x2={`${pos2.x}%`}
                y2={`${pos2.y}%`}
                stroke={`url(#corridor-gradient-${corridor.id})`}
                strokeWidth={2 + (corridor.riskLevel > 50 ? 1 : 0)}
                strokeDasharray={corridor.status === 'blocked' ? '8,8' : corridor.status === 'restricted' ? '12,4' : '0'}
                filter="url(#glow)"
                initial={{ pathLength: 0 }}
                animate={{ 
                  pathLength: 1,
                  strokeDashoffset: corridor.status !== 'open' ? [0, -20] : 0
                }}
                transition={{ 
                  pathLength: { duration: 1, ease: "easeInOut" },
                  strokeDashoffset: { 
                    duration: 1, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }
                }}
              />
              
              {/* Direction arrows along the path */}
              {zoom >= 1.0 && (
                <motion.polygon
                  points="0,-4 8,0 0,4"
                  fill={corridor.status === 'open' ? '#22c55e' : corridor.status === 'restricted' ? '#f59e0b' : '#ef4444'}
                  style={{
                    transform: `translate(${(pos1.x + pos2.x) / 2}%, ${(pos1.y + pos2.y) / 2}%) rotate(${Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x) * 180 / Math.PI}deg)`,
                    transformBox: 'fill-box',
                    transformOrigin: 'center'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </g>
          );
        }

        return (
          <g key={corridor.id}>
            {lines}
            {/* Corridor label */}
            {zoom >= 1.25 && parks.length >= 2 && (
              <motion.text
                x={`${(getPosition(parks[0]!.lat, parks[0]!.lng).x + getPosition(parks[parks.length-1]!.lat, parks[parks.length-1]!.lng).x) / 2}%`}
                y={`${(getPosition(parks[0]!.lat, parks[0]!.lng).y + getPosition(parks[parks.length-1]!.lat, parks[parks.length-1]!.lng).y) / 2 - 2}%`}
                fill="hsl(var(--foreground))"
                fontSize={10 / zoom}
                textAnchor="middle"
                className="font-mono opacity-70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
              >
                {corridor.name}
              </motion.text>
            )}
          </g>
        );
      })}
    </svg>
  );
};
