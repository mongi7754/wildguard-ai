import { MapPin, Navigation, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface LockedPoint {
  lat: number;
  lng: number;
  timestamp: Date;
}

interface LockedPointMarkerProps {
  point: LockedPoint;
  position: { x: number; y: number };
  distance: number;
  bearing: number;
  zoom: number;
  onRemove: () => void;
}

export const LockedPointMarker = ({ 
  point, 
  position, 
  distance, 
  bearing, 
  zoom,
  onRemove 
}: LockedPointMarkerProps) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="absolute z-30"
      style={{ 
        left: `${position.x}%`, 
        top: `${position.y}%`,
        transform: `translate(-50%, -50%) scale(${1/zoom})`
      }}
    >
      <div className="relative group">
        {/* Pulsing ring */}
        <div className="absolute inset-0 w-8 h-8 -ml-4 -mt-4 rounded-full bg-red-500/30 animate-ping" />
        
        {/* Main marker */}
        <div className="relative w-8 h-8 -ml-4 -mt-4 rounded-full bg-red-500 border-2 border-white shadow-lg flex items-center justify-center cursor-pointer">
          <MapPin className="h-4 w-4 text-white" />
        </div>
        
        {/* Info popup */}
        <div className="absolute left-6 top-0 bg-background/95 backdrop-blur border border-red-500/50 rounded-lg p-3 min-w-48 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-red-400 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              LOCKED POINT
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 pointer-events-auto"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="space-y-1 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-muted-foreground">LAT:</span>
              <span className="text-red-300">{point.lat.toFixed(6)}°</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">LNG:</span>
              <span className="text-red-300">{point.lng.toFixed(6)}°</span>
            </div>
            <div className="border-t border-border/50 pt-1 mt-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">DIST:</span>
                <span className="text-amber-400">{distance.toFixed(2)} km</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">BEARING:</span>
                <span className="text-cyan-400 flex items-center gap-1">
                  <Navigation className="h-3 w-3" style={{ transform: `rotate(${bearing}deg)` }} />
                  {bearing.toFixed(0)}°
                </span>
              </div>
            </div>
            <div className="text-[10px] text-muted-foreground pt-1">
              Locked: {point.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
