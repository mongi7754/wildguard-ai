import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wifi, 
  WifiOff, 
  Flame, 
  Radio, 
  Activity,
  AlertTriangle,
  X,
  Thermometer,
  Droplets,
  Battery,
  Signal
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IoTSensor, ParkIoTStatus } from '@/types/iot';
import satelliteAerialMap from '@/assets/satellite-aerial-map.png';

interface KenyaInteractiveMapProps {
  parkStatus: ParkIoTStatus[];
  sensors: IoTSensor[];
  onParkSelect: (parkId: string) => void;
  selectedPark: string | null;
}

// Kenya parks with approximate SVG coordinates
const parkPositions: Record<string, { x: number; y: number; name: string }> = {
  'maasai-mara': { x: 180, y: 320, name: 'Maasai Mara' },
  'amboseli': { x: 280, y: 380, name: 'Amboseli' },
  'tsavo-east': { x: 350, y: 340, name: 'Tsavo East' },
  'tsavo-west': { x: 300, y: 360, name: 'Tsavo West' },
  'lake-nakuru': { x: 220, y: 200, name: 'Lake Nakuru' },
  'samburu': { x: 290, y: 140, name: 'Samburu' },
  'meru': { x: 330, y: 180, name: 'Meru' },
  'aberdare': { x: 250, y: 200, name: 'Aberdare' },
  'mount-kenya': { x: 290, y: 190, name: 'Mt. Kenya' },
  'nairobi': { x: 260, y: 280, name: 'Nairobi NP' }
};

const getFireRiskColor = (risk: string) => {
  switch (risk) {
    case 'extreme': return 'text-red-500';
    case 'high': return 'text-orange-500';
    case 'moderate': return 'text-yellow-500';
    default: return 'text-green-500';
  }
};

const getStatusColor = (online: number, total: number) => {
  const ratio = online / total;
  if (ratio >= 0.8) return 'fill-emerald-500';
  if (ratio >= 0.5) return 'fill-yellow-500';
  return 'fill-red-500';
};

export function KenyaInteractiveMap({ parkStatus, sensors, onParkSelect, selectedPark }: KenyaInteractiveMapProps) {
  const [hoveredPark, setHoveredPark] = useState<string | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<IoTSensor | null>(null);

  const getSensorIcon = (type: IoTSensor['type']) => {
    switch (type) {
      case 'animal_collar': return <Radio className="w-3 h-3" />;
      case 'fire_sensor': return <Flame className="w-3 h-3" />;
      case 'smoke_detector': return <Activity className="w-3 h-3" />;
      case 'motion_sensor': return <AlertTriangle className="w-3 h-3" />;
      case 'weather_station': return <Thermometer className="w-3 h-3" />;
      default: return <Wifi className="w-3 h-3" />;
    }
  };

  const getSensorColor = (status: IoTSensor['status']) => {
    switch (status) {
      case 'online': return 'bg-emerald-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-muted';
    }
  };

  const selectedParkSensors = selectedPark 
    ? sensors.filter(s => s.parkId === selectedPark)
    : [];

  return (
    <Card className="relative bg-card/50 backdrop-blur border-primary/20 overflow-hidden">
      <div className="p-4 border-b border-border/50">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Radio className="w-4 h-4 text-primary" />
          Kenya IoT Sensor Network
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Click a park to view sensors • Hover for quick stats
        </p>
      </div>

      <div className="relative h-[500px]">
        {/* Satellite imagery background */}
        <div 
          className="absolute inset-0 bg-cover bg-center rounded-b-lg"
          style={{ 
            backgroundImage: `url(${satelliteAerialMap})`,
            filter: 'brightness(0.8) saturate(1.2)'
          }}
        />
        
        {/* Overlay for better visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/50" />
        
        {/* Kenya SVG Map */}
        <svg 
          viewBox="0 0 500 500" 
          className="w-full h-full relative z-10"
          style={{ filter: 'drop-shadow(0 0 20px rgba(var(--primary), 0.1))' }}
        >
          {/* Kenya outline - simplified */}
          <path
            d="M150,80 L200,60 L280,50 L350,70 L420,100 L450,180 L440,280 L400,350 L350,420 L280,450 L200,420 L150,380 L120,320 L100,250 L110,180 L130,120 Z"
            fill="rgba(0,0,0,0.3)"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
          />
          
          {/* Grid lines */}
          {[100, 200, 300, 400].map(y => (
            <line key={`h-${y}`} x1="50" y1={y} x2="450" y2={y} stroke="hsl(var(--border)/0.2)" strokeDasharray="4,4" />
          ))}
          {[100, 200, 300, 400].map(x => (
            <line key={`v-${x}`} x1={x} y1="50" x2={x} y2="450" stroke="hsl(var(--border)/0.2)" strokeDasharray="4,4" />
          ))}

          {/* Parks */}
          {parkStatus.map(park => {
            const pos = parkPositions[park.parkId];
            if (!pos) return null;
            
            const isSelected = selectedPark === park.parkId;
            const isHovered = hoveredPark === park.parkId;
            
            return (
              <g key={park.parkId}>
                {/* Pulse animation for alerts */}
                {park.alerts > 0 && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? 28 : 22}
                    fill="none"
                    stroke="hsl(var(--destructive))"
                    strokeWidth="2"
                    opacity="0.5"
                  >
                    <animate
                      attributeName="r"
                      values={isSelected ? "28;40;28" : "22;35;22"}
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.5;0;0.5"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
                
                {/* Park marker */}
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 18 : 14}
                  className={`${getStatusColor(park.onlineSensors, park.totalSensors)} cursor-pointer`}
                  stroke={isSelected ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                  strokeWidth={isSelected ? 3 : 2}
                  onClick={() => onParkSelect(park.parkId)}
                  onMouseEnter={() => setHoveredPark(park.parkId)}
                  onMouseLeave={() => setHoveredPark(null)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ filter: isSelected ? 'drop-shadow(0 0 8px hsl(var(--primary)))' : 'none' }}
                />
                
                {/* Sensor count */}
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  className="fill-white text-xs font-bold pointer-events-none"
                >
                  {park.onlineSensors}
                </text>
                
                {/* Park label */}
                <text
                  x={pos.x}
                  y={pos.y + 32}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[10px] font-medium pointer-events-none"
                >
                  {pos.name}
                </text>

                {/* Fire risk indicator */}
                {park.fireRisk !== 'low' && (
                  <g transform={`translate(${pos.x + 12}, ${pos.y - 12})`}>
                    <circle r="8" className={park.fireRisk === 'extreme' ? 'fill-red-500' : park.fireRisk === 'high' ? 'fill-orange-500' : 'fill-yellow-500'} />
                    <Flame className="w-3 h-3 text-white" style={{ transform: 'translate(-6px, -6px)' }} />
                  </g>
                )}
              </g>
            );
          })}

          {/* Individual sensors for selected park */}
          {selectedParkSensors.map((sensor, i) => {
            const parkPos = parkPositions[sensor.parkId];
            if (!parkPos) return null;
            
            // Offset sensors around the park center
            const angle = (i / selectedParkSensors.length) * 2 * Math.PI;
            const radius = 45;
            const x = parkPos.x + Math.cos(angle) * radius;
            const y = parkPos.y + Math.sin(angle) * radius;
            
            return (
              <motion.g
                key={sensor.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {/* Connection line */}
                <line
                  x1={parkPos.x}
                  y1={parkPos.y}
                  x2={x}
                  y2={y}
                  stroke="hsl(var(--primary)/0.3)"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
                
                {/* Sensor marker */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r="10"
                  className={`${getSensorColor(sensor.status)} cursor-pointer`}
                  stroke="hsl(var(--background))"
                  strokeWidth="2"
                  onClick={() => setSelectedSensor(sensor)}
                  whileHover={{ scale: 1.3 }}
                />
              </motion.g>
            );
          })}
        </svg>

        {/* Hover tooltip */}
        <AnimatePresence>
          {hoveredPark && !selectedPark && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-4 right-4 z-10"
            >
              {(() => {
                const park = parkStatus.find(p => p.parkId === hoveredPark);
                if (!park) return null;
                return (
                  <Card className="p-3 bg-card/95 backdrop-blur border-primary/30 min-w-[180px]">
                    <h4 className="font-semibold text-sm">{park.parkName}</h4>
                    <div className="mt-2 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sensors:</span>
                        <span>{park.onlineSensors}/{park.totalSensors} online</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Coverage:</span>
                        <span>{park.coverage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fire Risk:</span>
                        <span className={getFireRiskColor(park.fireRisk)}>{park.fireRisk}</span>
                      </div>
                      {park.alerts > 0 && (
                        <Badge variant="destructive" className="w-full justify-center mt-2">
                          {park.alerts} Active Alert{park.alerts > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  </Card>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sensor detail panel */}
        <AnimatePresence>
          {selectedSensor && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute bottom-4 right-4 z-20"
            >
              <Card className="p-4 bg-card/95 backdrop-blur border-primary/30 w-[260px]">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded ${getSensorColor(selectedSensor.status)}`}>
                      {getSensorIcon(selectedSensor.type)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{selectedSensor.name}</h4>
                      <p className="text-xs text-muted-foreground capitalize">
                        {selectedSensor.type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-6 w-6"
                    onClick={() => setSelectedSensor(null)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 p-2 rounded bg-muted/50">
                    <Battery className="w-3 h-3 text-muted-foreground" />
                    <span>{selectedSensor.batteryLevel}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded bg-muted/50">
                    <Signal className="w-3 h-3 text-muted-foreground" />
                    <span>{selectedSensor.signalStrength}%</span>
                  </div>
                  
                  {selectedSensor.data.temperature !== undefined && (
                    <div className="flex items-center gap-1.5 p-2 rounded bg-muted/50">
                      <Thermometer className="w-3 h-3 text-orange-500" />
                      <span>{selectedSensor.data.temperature}°C</span>
                    </div>
                  )}
                  {selectedSensor.data.humidity !== undefined && (
                    <div className="flex items-center gap-1.5 p-2 rounded bg-muted/50">
                      <Droplets className="w-3 h-3 text-blue-500" />
                      <span>{selectedSensor.data.humidity}%</span>
                    </div>
                  )}
                  {selectedSensor.data.heartRate !== undefined && (
                    <div className="flex items-center gap-1.5 p-2 rounded bg-muted/50 col-span-2">
                      <Activity className="w-3 h-3 text-red-500" />
                      <span>Heart Rate: {selectedSensor.data.heartRate} bpm</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                  Last ping: {new Date(selectedSensor.lastPing).toLocaleTimeString()}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 p-3 bg-card/80 backdrop-blur rounded-lg border border-border/50">
          <p className="text-[10px] font-medium text-muted-foreground mb-2">SENSOR STATUS</p>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Online</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span>Warning</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span>Critical</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
