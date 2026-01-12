import { motion } from 'framer-motion';
import { RealPark } from '@/data/kenyaParksRealData';
import { MapPin, Radio, AlertTriangle, Shield } from 'lucide-react';

interface RealParkMarkerProps {
  park: RealPark;
  position: { x: number; y: number };
  zoom: number;
  isSelected: boolean;
  onSelect: () => void;
}

export const RealParkMarker = ({ park, position, zoom, isSelected, onSelect }: RealParkMarkerProps) => {
  const getStatusColor = () => {
    if (park.status === 'alert') return 'bg-red-500 border-red-400';
    if (park.status === 'monitoring') return 'bg-amber-500 border-amber-400';
    return 'bg-emerald-500 border-emerald-400';
  };

  const getPrioritySize = () => {
    if (park.priority === 'high') return zoom >= 1 ? 'w-5 h-5' : 'w-4 h-4';
    if (park.priority === 'medium') return zoom >= 1 ? 'w-4 h-4' : 'w-3 h-3';
    return zoom >= 1 ? 'w-3 h-3' : 'w-2.5 h-2.5';
  };

  return (
    <motion.div
      className="absolute cursor-pointer z-10"
      style={{ 
        left: `${position.x}%`, 
        top: `${position.y}%`,
        transform: `translate(-50%, -50%) scale(${1/zoom})`
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.2 }}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
    >
      <div className="relative group">
        {/* Park marker */}
        <div 
          className={`${getPrioritySize()} rounded-full ${getStatusColor()} border-2 shadow-lg transition-all flex items-center justify-center`}
          style={{ 
            boxShadow: isSelected 
              ? `0 0 20px ${park.color}80, 0 0 40px ${park.color}40` 
              : `0 0 10px ${park.color}40`
          }}
        >
          {park.status === 'alert' && (
            <AlertTriangle className="w-2 h-2 text-white animate-pulse" />
          )}
        </div>

        {/* Pulse ring for active parks */}
        {park.status === 'active' && (
          <div className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ backgroundColor: park.color }} />
        )}

        {/* Coverage radius indicator */}
        {zoom >= 1.25 && (
          <div 
            className="absolute rounded-full border-2 border-dashed opacity-30 pointer-events-none"
            style={{ 
              width: `${Math.sqrt(park.area) * 0.5}px`,
              height: `${Math.sqrt(park.area) * 0.5}px`,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              borderColor: park.color
            }}
          />
        )}

        {/* Park name tooltip */}
        <div className={`absolute left-7 top-1/2 -translate-y-1/2 transition-all duration-200 ${
          zoom >= 1.0 || isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}>
          <div className="bg-background/95 backdrop-blur rounded-lg px-3 py-2 border border-border/50 shadow-xl min-w-48">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: park.color }} />
              <span className="text-xs font-bold text-foreground">{park.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[10px]">
              <span className="text-muted-foreground">Region:</span>
              <span className="text-foreground">{park.region}</span>
              <span className="text-muted-foreground">Area:</span>
              <span className="text-cyan-400">{park.area.toLocaleString()} km²</span>
              <span className="text-muted-foreground">Sensors:</span>
              <span className="text-green-400">{park.sensors}</span>
              <span className="text-muted-foreground">Drones:</span>
              <span className="text-purple-400">{park.drones}</span>
              <span className="text-muted-foreground">Wildlife:</span>
              <span className="text-amber-400">{park.wildlife.toLocaleString()}</span>
            </div>
            <div className="mt-2 pt-1 border-t border-border/50 font-mono text-[9px] text-muted-foreground">
              GPS: {park.lat.toFixed(4)}°, {park.lng.toFixed(4)}°
            </div>
          </div>
        </div>

        {/* Status indicators around marker */}
        {zoom >= 1.5 && (
          <div className="absolute -top-3 -right-3 flex gap-0.5">
            {park.drones > 0 && (
              <div className="w-3 h-3 rounded-full bg-purple-500/80 flex items-center justify-center" title="Drones Active">
                <Radio className="w-1.5 h-1.5 text-white" />
              </div>
            )}
            {park.priority === 'high' && (
              <div className="w-3 h-3 rounded-full bg-red-500/80 flex items-center justify-center" title="High Priority">
                <Shield className="w-1.5 h-1.5 text-white" />
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
