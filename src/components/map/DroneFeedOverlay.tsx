import { motion } from 'framer-motion';
import { DroneFeed } from '@/types/fire';
import { Badge } from '@/components/ui/badge';
import { Video, VideoOff, Battery, Plane } from 'lucide-react';

interface DroneFeedOverlayProps {
  drones: DroneFeed[];
  mapBounds: { minLat: number; maxLat: number; minLng: number; maxLng: number };
  onSelect: (drone: DroneFeed) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'live': return 'text-green-400 bg-green-500/20 border-green-500/50';
    case 'recording': return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
    case 'offline': return 'text-muted-foreground bg-muted/20 border-muted/50';
    default: return 'text-muted-foreground bg-muted/20';
  }
};

export const DroneFeedOverlay = ({ drones, mapBounds, onSelect }: DroneFeedOverlayProps) => {
  const latRange = mapBounds.maxLat - mapBounds.minLat;
  const lngRange = mapBounds.maxLng - mapBounds.minLng;

  const getPosition = (lat: number, lng: number) => {
    const x = ((lng - mapBounds.minLng) / lngRange) * 100;
    const y = ((mapBounds.maxLat - lat) / latRange) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  return (
    <>
      {drones.map((drone, index) => {
        const pos = getPosition(drone.location.lat, drone.location.lng);
        const isLive = drone.status === 'live';

        return (
          <motion.div
            key={drone.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="absolute cursor-pointer group"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            onClick={() => onSelect(drone)}
          >
            <motion.div
              className={`relative p-2 rounded-lg border backdrop-blur ${getStatusColor(drone.status)}`}
              animate={isLive ? { y: [0, -3, 0] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Plane className="h-5 w-5" />
              
              {/* Live indicator */}
              {isLive && (
                <motion.div
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
              )}
            </motion.div>

            {/* Hover tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
              <div className="bg-background/95 backdrop-blur border border-border rounded-lg p-3 shadow-lg min-w-[180px]">
                <div className="flex items-center gap-2 mb-2">
                  {isLive ? (
                    <Video className="h-4 w-4 text-green-400" />
                  ) : (
                    <VideoOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  <p className="font-medium text-sm">{drone.name}</p>
                </div>
                
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="outline" className={`text-[10px] ${getStatusColor(drone.status)}`}>
                      {drone.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Altitude</span>
                    <span>{drone.altitude}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mission</span>
                    <span className="text-cyan-400">{drone.mission}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Battery</span>
                    <div className="flex items-center gap-1">
                      <Battery className={`h-3 w-3 ${drone.battery > 20 ? 'text-green-400' : 'text-red-400'}`} />
                      <span>{drone.battery}%</span>
                    </div>
                  </div>
                </div>

                {isLive && (
                  <button className="w-full mt-2 py-1 text-xs bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors">
                    View Live Feed
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </>
  );
};
