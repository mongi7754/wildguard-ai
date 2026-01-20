import { motion, AnimatePresence } from 'framer-motion';
import { DronePatrolRoute } from '@/data/dronePatrolData';
import { Badge } from '@/components/ui/badge';
import { Plane, Radio, Eye, Battery, Thermometer, Moon, Navigation } from 'lucide-react';
import { useState } from 'react';

interface DronePatrolLayerProps {
  patrols: DronePatrolRoute[];
  mapBounds: { minLat: number; maxLat: number; minLng: number; maxLng: number };
  zoom: number;
  showRoutes?: boolean;
  showCoverage?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return { bg: 'bg-green-500', text: 'text-green-400', glow: 'shadow-green-500/50' };
    case 'returning': return { bg: 'bg-amber-500', text: 'text-amber-400', glow: 'shadow-amber-500/50' };
    case 'standby': return { bg: 'bg-blue-500', text: 'text-blue-400', glow: 'shadow-blue-500/50' };
    case 'charging': return { bg: 'bg-purple-500', text: 'text-purple-400', glow: 'shadow-purple-500/50' };
    default: return { bg: 'bg-muted', text: 'text-muted-foreground', glow: '' };
  }
};

const getRouteTypeColor = (type: string) => {
  switch (type) {
    case 'perimeter': return '#22c55e';
    case 'grid': return '#3b82f6';
    case 'hotspot': return '#ef4444';
    case 'emergency': return '#f97316';
    case 'surveillance': return '#8b5cf6';
    default: return '#06b6d4';
  }
};

export const DronePatrolLayer = ({ 
  patrols, 
  mapBounds, 
  zoom,
  showRoutes = true,
  showCoverage = true
}: DronePatrolLayerProps) => {
  const [selectedDrone, setSelectedDrone] = useState<string | null>(null);
  
  const latRange = mapBounds.maxLat - mapBounds.minLat;
  const lngRange = mapBounds.maxLng - mapBounds.minLng;

  const getPosition = (lat: number, lng: number) => {
    const x = ((lng - mapBounds.minLng) / lngRange) * 100;
    const y = ((mapBounds.maxLat - lat) / latRange) * 100;
    return { x: Math.max(2, Math.min(98, x)), y: Math.max(2, Math.min(98, y)) };
  };

  // Convert coverage radius to percentage of map
  const getCoverageSize = (radiusKm: number) => {
    // Approximate: 1 degree ≈ 111km at equator
    const radiusDeg = radiusKm / 111;
    return (radiusDeg / latRange) * 100;
  };

  return (
    <>
      {/* Patrol Routes (paths) */}
      {showRoutes && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: 'visible' }}>
          <defs>
            {patrols.map(patrol => (
              <linearGradient key={`grad-${patrol.id}`} id={`route-grad-${patrol.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={getRouteTypeColor(patrol.routeType)} stopOpacity="0.3" />
                <stop offset="50%" stopColor={getRouteTypeColor(patrol.routeType)} stopOpacity="0.8" />
                <stop offset="100%" stopColor={getRouteTypeColor(patrol.routeType)} stopOpacity="0.3" />
              </linearGradient>
            ))}
          </defs>
          
          {patrols.filter(p => p.status === 'active').map((patrol) => {
            const points = patrol.waypoints.map(wp => {
              const pos = getPosition(wp.lat, wp.lng);
              return `${pos.x}%,${pos.y}%`;
            });
            
            return (
              <g key={patrol.id}>
                {/* Route path - dashed line showing patrol route */}
                <motion.polyline
                  points={points.join(' ')}
                  fill="none"
                  stroke={getRouteTypeColor(patrol.routeType)}
                  strokeWidth={2 / zoom}
                  strokeDasharray={`${8 / zoom} ${4 / zoom}`}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={selectedDrone === patrol.id ? 1 : 0.6}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                
                {/* Animated dot traveling along route */}
                <motion.circle
                  r={3 / zoom}
                  fill={getRouteTypeColor(patrol.routeType)}
                  animate={{
                    cx: points.map(p => p.split(',')[0]),
                    cy: points.map(p => p.split(',')[1]),
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                
                {/* Waypoint markers */}
                {patrol.waypoints.map((wp, idx) => {
                  const pos = getPosition(wp.lat, wp.lng);
                  return (
                    <circle
                      key={`wp-${patrol.id}-${idx}`}
                      cx={`${pos.x}%`}
                      cy={`${pos.y}%`}
                      r={4 / zoom}
                      fill="transparent"
                      stroke={getRouteTypeColor(patrol.routeType)}
                      strokeWidth={1.5 / zoom}
                      opacity={0.7}
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>
      )}

      {/* Coverage Areas */}
      {showCoverage && patrols.filter(p => p.status === 'active').map((patrol) => {
        const pos = getPosition(patrol.currentPosition.lat, patrol.currentPosition.lng);
        const coverageSize = getCoverageSize(patrol.coverageRadius) * 2;
        
        return (
          <motion.div
            key={`coverage-${patrol.id}`}
            className="absolute rounded-full pointer-events-none z-5"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              width: `${coverageSize}%`,
              height: `${coverageSize}%`,
              transform: `translate(-50%, -50%) scale(${1/zoom})`,
              background: `radial-gradient(circle, ${getRouteTypeColor(patrol.routeType)}20 0%, transparent 70%)`,
              border: `1px dashed ${getRouteTypeColor(patrol.routeType)}40`,
            }}
            animate={{
              scale: [1/zoom, 1.1/zoom, 1/zoom],
              opacity: [0.5, 0.7, 0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );
      })}

      {/* Drone Markers */}
      <AnimatePresence>
        {patrols.map((patrol, index) => {
          const pos = getPosition(patrol.currentPosition.lat, patrol.currentPosition.lng);
          const statusColors = getStatusColor(patrol.status);
          const isSelected = selectedDrone === patrol.id;
          
          return (
            <motion.div
              key={patrol.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: index * 0.1 }}
              className="absolute cursor-pointer group z-20"
              style={{ 
                left: `${pos.x}%`, 
                top: `${pos.y}%`,
                transform: `translate(-50%, -50%) scale(${1/zoom})`
              }}
              onClick={() => setSelectedDrone(isSelected ? null : patrol.id)}
            >
              {/* Drone icon with heading indicator */}
              <motion.div
                className={`relative p-2 rounded-lg border backdrop-blur ${statusColors.bg}/20 border-${statusColors.text.split('-')[1]}-500/50 shadow-lg ${statusColors.glow}`}
                animate={patrol.status === 'active' ? {
                  y: [0, -2, 0],
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ transform: `rotate(${patrol.currentPosition.heading}deg)` }}
              >
                <Plane className={`h-5 w-5 ${statusColors.text}`} />
                
                {/* Status pulse */}
                {patrol.status === 'active' && (
                  <motion.div
                    className={`absolute -top-1 -right-1 w-3 h-3 ${statusColors.bg} rounded-full`}
                    animate={{ opacity: [1, 0.5, 1], scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.div>

              {/* Info tooltip on hover/selection */}
              <AnimatePresence>
                {(isSelected || true) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: isSelected ? 1 : 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 z-30 ${isSelected ? 'block' : 'hidden group-hover:block'}`}
                  >
                    <div className="bg-background/95 backdrop-blur border border-border rounded-lg p-3 shadow-xl min-w-[200px]">
                      <div className="flex items-center gap-2 mb-2">
                        <Plane className={`h-4 w-4 ${statusColors.text}`} />
                        <span className="font-semibold text-sm">{patrol.droneName}</span>
                      </div>
                      
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Status</span>
                          <Badge 
                            variant="outline" 
                            className={`text-[10px] ${statusColors.text} border-current`}
                          >
                            {patrol.status.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Mission</span>
                          <span style={{ color: getRouteTypeColor(patrol.routeType) }}>
                            {patrol.routeType}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Speed</span>
                          <span>{patrol.speed} km/h</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Altitude</span>
                          <span>{patrol.currentPosition.altitude}m</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Coverage</span>
                          <span>{patrol.coverageRadius} km radius</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Battery className="h-3 w-3" /> Battery
                          </span>
                          <span className={patrol.battery > 50 ? 'text-green-400' : patrol.battery > 20 ? 'text-amber-400' : 'text-red-400'}>
                            {patrol.battery}%
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 pt-1 border-t border-border/50 mt-1">
                          {patrol.thermalEnabled && (
                            <Badge variant="outline" className="text-[9px] text-orange-400 border-orange-500/50">
                              <Thermometer className="h-2.5 w-2.5 mr-0.5" />
                              Thermal
                            </Badge>
                          )}
                          {patrol.nightVision && (
                            <Badge variant="outline" className="text-[9px] text-purple-400 border-purple-500/50">
                              <Moon className="h-2.5 w-2.5 mr-0.5" />
                              NV
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground pt-1">
                          <Navigation className="h-3 w-3" style={{ transform: `rotate(${patrol.currentPosition.heading}deg)` }} />
                          <span>Heading: {patrol.currentPosition.heading}°</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </>
  );
};
