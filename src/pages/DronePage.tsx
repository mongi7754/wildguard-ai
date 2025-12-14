import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play,
  Pause,
  RotateCcw,
  Home,
  Thermometer,
  Eye,
  Camera,
  Radio,
  Battery,
  Signal,
  Crosshair,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  Video,
  VideoOff
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DroneCard } from '@/components/drone/DroneCard';
import { DroneCamera } from '@/components/drone/DroneCamera';
import { mockDrones } from '@/data/mockData';
import { cn } from '@/lib/utils';

export default function DronePage() {
  const [selectedDrone, setSelectedDrone] = useState(mockDrones[0]);
  const [isStreaming, setIsStreaming] = useState(true);
  const [thermalMode, setThermalMode] = useState(false);
  const [nightVision, setNightVision] = useState(false);
  const [useRealCamera, setUseRealCamera] = useState(true);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);

  const activeDrones = mockDrones.filter(d => d.status === 'active');

  const handleCapture = (imageData: string) => {
    setCapturedImages(prev => [...prev.slice(-4), imageData]);
  };

  return (
    <AppLayout title="Drone Control">
      <div className="px-4 py-4 space-y-4">
        {/* Live Feed */}
        <Card variant="glow" className="overflow-hidden">
          <div className="relative aspect-video bg-forest-dark">
            {useRealCamera ? (
              /* Real Camera Feed */
              <DroneCamera
                thermalMode={thermalMode}
                nightVision={nightVision}
                isStreaming={isStreaming}
                onCapture={handleCapture}
              />
            ) : (
              /* Simulated Video Feed */
              <div className={cn(
                "absolute inset-0 transition-all duration-500",
                thermalMode && "bg-gradient-to-br from-orange-900/50 via-yellow-600/30 to-red-900/50",
                nightVision && !thermalMode && "bg-green-900/30"
              )}>
                {/* Grid overlay */}
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `
                      linear-gradient(hsl(var(--primary) / 0.2) 1px, transparent 1px),
                      linear-gradient(90deg, hsl(var(--primary) / 0.2) 1px, transparent 1px)
                    `,
                    backgroundSize: '30px 30px'
                  }}
                />

                {/* Thermal hotspots simulation */}
                {thermalMode && (
                  <>
                    <div className="absolute top-[30%] left-[40%] w-12 h-12 bg-yellow-500/60 rounded-full blur-xl animate-pulse" />
                    <div className="absolute top-[50%] right-[30%] w-8 h-8 bg-orange-500/50 rounded-full blur-lg animate-pulse" />
                    <div className="absolute bottom-[30%] left-[25%] w-6 h-6 bg-red-500/40 rounded-full blur-md animate-pulse" />
                  </>
                )}
              </div>
            )}

            {/* Crosshair overlay - always visible */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-primary/40" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/40" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Crosshair className="w-12 h-12 text-primary/60" />
              </div>
            </div>

            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-primary/60" />
            <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-primary/60" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-primary/60" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-primary/60" />

            {/* HUD Overlay */}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              <Badge variant="glow" className="font-mono text-xs">
                {selectedDrone.name}
              </Badge>
              <div className="flex items-center gap-1 text-[10px] text-primary/80">
                <Circle className="w-2 h-2 fill-danger text-danger animate-pulse" />
                <span>{useRealCamera ? 'DEVICE CAM' : 'SIMULATED'}</span>
              </div>
            </div>
            
            <div className="absolute top-3 right-16 text-right text-xs font-mono text-primary/80">
              <p>ALT: {selectedDrone.altitude}m</p>
              <p>SPD: {selectedDrone.speed} km/h</p>
            </div>

            {/* Bottom HUD */}
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs">
                  <Battery className={cn(
                    "w-4 h-4",
                    selectedDrone.battery > 50 ? "text-success" :
                    selectedDrone.battery > 20 ? "text-accent" : "text-danger"
                  )} />
                  <span className="font-mono">{selectedDrone.battery}%</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-success">
                  <Signal className="w-4 h-4" />
                  <span className="font-mono">98%</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Badge variant={thermalMode ? 'warning' : 'outline'} className="text-[10px]">
                  <Thermometer className="w-3 h-3 mr-1" />
                  THERMAL
                </Badge>
                <Badge variant={nightVision ? 'success' : 'outline'} className="text-[10px]">
                  <Eye className="w-3 h-3 mr-1" />
                  NV
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Camera Source Toggle */}
        <Card variant="tactical">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {useRealCamera ? (
                  <Video className="w-4 h-4 text-success" />
                ) : (
                  <VideoOff className="w-4 h-4 text-muted-foreground" />
                )}
                <span className="text-sm font-medium">
                  {useRealCamera ? 'Device Camera' : 'Simulated Feed'}
                </span>
              </div>
              <Button
                variant={useRealCamera ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUseRealCamera(!useRealCamera)}
              >
                {useRealCamera ? 'Switch to Sim' : 'Use Real Camera'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="grid grid-cols-3 gap-3">
          {/* Vision Controls */}
          <Card variant="tactical" className="p-3">
            <p className="text-[10px] text-muted-foreground mb-2 text-center">VISION</p>
            <div className="space-y-2">
              <Button 
                variant={thermalMode ? 'alert' : 'outline'} 
                size="sm" 
                className="w-full text-xs"
                onClick={() => setThermalMode(!thermalMode)}
              >
                <Thermometer className="w-3 h-3 mr-1" />
                Thermal
              </Button>
              <Button 
                variant={nightVision ? 'default' : 'outline'} 
                size="sm" 
                className="w-full text-xs"
                onClick={() => setNightVision(!nightVision)}
              >
                <Eye className="w-3 h-3 mr-1" />
                Night
              </Button>
            </div>
          </Card>

          {/* Movement Controls */}
          <Card variant="tactical" className="p-3">
            <p className="text-[10px] text-muted-foreground mb-2 text-center">MOVEMENT</p>
            <div className="grid grid-cols-3 gap-1">
              <div />
              <Button variant="outline" size="icon-sm">
                <ChevronUp className="w-4 h-4" />
              </Button>
              <div />
              <Button variant="outline" size="icon-sm">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon-sm">
                <Circle className="w-3 h-3" />
              </Button>
              <Button variant="outline" size="icon-sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
              <div />
              <Button variant="outline" size="icon-sm">
                <ChevronDown className="w-4 h-4" />
              </Button>
              <div />
            </div>
          </Card>

          {/* Actions */}
          <Card variant="tactical" className="p-3">
            <p className="text-[10px] text-muted-foreground mb-2 text-center">ACTIONS</p>
            <div className="space-y-2">
              <Button variant="default" size="sm" className="w-full text-xs">
                <Camera className="w-3 h-3 mr-1" />
                Capture
              </Button>
              <Button variant="outline" size="sm" className="w-full text-xs">
                <Home className="w-3 h-3 mr-1" />
                RTH
              </Button>
            </div>
          </Card>
        </div>

        {/* Captured Images Gallery */}
        {capturedImages.length > 0 && (
          <Card variant="tactical">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Captured Frames</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {capturedImages.map((img, index) => (
                  <div 
                    key={index} 
                    className="aspect-square rounded-lg overflow-hidden border border-border/50"
                  >
                    <img 
                      src={img} 
                      alt={`Capture ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stream Controls */}
        <Card variant="tactical">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant={isStreaming ? 'danger' : 'glow'}
                  size="icon"
                  onClick={() => setIsStreaming(!isStreaming)}
                >
                  {isStreaming ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <div>
                  <p className="text-sm font-medium">
                    {isStreaming ? 'Streaming Live' : 'Paused'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    WebRTC • 1080p • 30fps
                  </p>
                </div>
              </div>
              <Badge variant="tactical">
                <Radio className="w-3 h-3 mr-1 animate-pulse" />
                Connected
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Drone Fleet */}
        <div>
          <h3 className="font-display font-semibold text-sm mb-3">Drone Fleet</h3>
          <div className="space-y-3">
            {mockDrones.map((drone) => (
              <DroneCard
                key={drone.id}
                drone={drone}
                isSelected={selectedDrone.id === drone.id}
                onSelect={() => setSelectedDrone(drone)}
              />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
