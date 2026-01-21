import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Video, VideoOff, Maximize2, Minimize2, 
  Battery, Thermometer, Eye, Crosshair, MapPin,
  Signal, Clock, Camera, Download, Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { DronePatrolRoute } from '@/data/dronePatrolData';

interface LiveDroneFeedModalProps {
  drone: DronePatrolRoute | null;
  onClose: () => void;
}

export const LiveDroneFeedModal = ({ drone, onClose }: LiveDroneFeedModalProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [thermalMode, setThermalMode] = useState(false);
  const [nightVision, setNightVision] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [streamTime, setStreamTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulate live feed with canvas animation
  useEffect(() => {
    if (!drone || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const drawFrame = () => {
      time += 0.02;
      
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (thermalMode) {
        gradient.addColorStop(0, `hsl(${200 + Math.sin(time) * 20}, 80%, 20%)`);
        gradient.addColorStop(0.5, `hsl(${30 + Math.sin(time * 0.5) * 20}, 90%, 30%)`);
        gradient.addColorStop(1, `hsl(${0 + Math.sin(time * 0.3) * 10}, 80%, 25%)`);
      } else if (nightVision) {
        gradient.addColorStop(0, `hsl(120, 60%, ${5 + Math.sin(time) * 3}%)`);
        gradient.addColorStop(1, `hsl(120, 40%, ${15 + Math.sin(time * 0.5) * 5}%)`);
      } else {
        gradient.addColorStop(0, `hsl(200, 40%, ${20 + Math.sin(time) * 5}%)`);
        gradient.addColorStop(1, `hsl(150, 30%, ${30 + Math.sin(time * 0.5) * 5}%)`);
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw terrain lines
      ctx.strokeStyle = thermalMode 
        ? `rgba(255, 100, 50, ${0.3 + Math.sin(time) * 0.1})` 
        : nightVision 
          ? `rgba(0, 255, 0, ${0.4 + Math.sin(time) * 0.1})`
          : `rgba(100, 200, 150, ${0.3 + Math.sin(time) * 0.1})`;
      ctx.lineWidth = 1;

      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * (0.3 + i * 0.07));
        for (let x = 0; x < canvas.width; x += 20) {
          const y = canvas.height * (0.3 + i * 0.07) + Math.sin((x + time * 50) * 0.01 + i) * 20;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Draw heat signatures (simulated wildlife)
      if (thermalMode) {
        for (let i = 0; i < 5; i++) {
          const x = (canvas.width * (0.2 + i * 0.15) + Math.sin(time + i) * 30) % canvas.width;
          const y = canvas.height * 0.5 + Math.cos(time * 0.5 + i) * 50;
          
          const heatGradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
          heatGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
          heatGradient.addColorStop(0.3, 'rgba(255, 200, 50, 0.7)');
          heatGradient.addColorStop(0.7, 'rgba(255, 100, 0, 0.3)');
          heatGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
          
          ctx.fillStyle = heatGradient;
          ctx.beginPath();
          ctx.arc(x, y, 25, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw crosshair
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      ctx.strokeStyle = thermalMode ? 'rgba(255, 200, 50, 0.8)' : nightVision ? 'rgba(0, 255, 0, 0.8)' : 'rgba(0, 255, 255, 0.8)';
      ctx.lineWidth = 1;
      
      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(centerX - 50, centerY);
      ctx.lineTo(centerX - 15, centerY);
      ctx.moveTo(centerX + 15, centerY);
      ctx.lineTo(centerX + 50, centerY);
      ctx.stroke();
      
      // Vertical line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - 50);
      ctx.lineTo(centerX, centerY - 15);
      ctx.moveTo(centerX, centerY + 15);
      ctx.lineTo(centerX, centerY + 50);
      ctx.stroke();
      
      // Center circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
      ctx.stroke();

      // Scan line effect
      const scanY = (time * 100) % canvas.height;
      ctx.strokeStyle = thermalMode ? 'rgba(255, 100, 0, 0.3)' : nightVision ? 'rgba(0, 255, 0, 0.3)' : 'rgba(0, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(canvas.width, scanY);
      ctx.stroke();

      animationId = requestAnimationFrame(drawFrame);
    };

    drawFrame();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [drone, thermalMode, nightVision]);

  // Stream timer
  useEffect(() => {
    if (!drone) return;
    const interval = setInterval(() => {
      setStreamTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [drone]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!drone) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`bg-card border border-border rounded-xl overflow-hidden ${
            isFullscreen ? 'fixed inset-4' : 'max-w-4xl w-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Video className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  {drone.droneName}
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px]">
                    LIVE
                  </Badge>
                </h3>
                <p className="text-xs text-muted-foreground">
                  {drone.routeType} mission • {drone.parkId}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {isRecording && (
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-500 mr-1" />
                  REC
                </Badge>
              )}
              <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(!isFullscreen)}>
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Video Feed */}
          <div className="relative aspect-video bg-black">
            <canvas
              ref={canvasRef}
              width={960}
              height={540}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay Info */}
            <div className="absolute top-4 left-4 space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <Badge className="bg-black/60 text-white border-none">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTime(streamTime)}
                </Badge>
                <Badge className="bg-black/60 text-cyan-400 border-none">
                  <Signal className="h-3 w-3 mr-1" />
                  Strong
                </Badge>
              </div>
              <Badge className="bg-black/60 text-white border-none">
                <MapPin className="h-3 w-3 mr-1" />
                {drone.currentPosition.lat.toFixed(4)}, {drone.currentPosition.lng.toFixed(4)}
              </Badge>
            </div>

            <div className="absolute top-4 right-4 space-y-2">
              <Badge className="bg-black/60 text-white border-none flex items-center gap-1">
                <Battery className={`h-3 w-3 ${drone.battery > 20 ? 'text-green-400' : 'text-red-400'}`} />
                {drone.battery}%
              </Badge>
              <Badge className="bg-black/60 text-white border-none">
                ALT: {drone.currentPosition.altitude}m
              </Badge>
              <Badge className="bg-black/60 text-white border-none">
                HDG: {drone.currentPosition.heading}°
              </Badge>
            </div>

            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-[10px] text-white/70 font-mono">
              <span>FPS: 30</span>
              <span>•</span>
              <span>1080p</span>
              <span>•</span>
              <span>LATENCY: 42ms</span>
            </div>
          </div>

          {/* Controls */}
          <div className="p-4 border-t border-border bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant={thermalMode ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setThermalMode(!thermalMode)}
                >
                  <Thermometer className="h-4 w-4 mr-1" />
                  Thermal
                </Button>
                <Button
                  variant={nightVision ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNightVision(!nightVision)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Night Vision
                </Button>
                <Button
                  variant={isRecording ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={() => setIsRecording(!isRecording)}
                >
                  <Camera className="h-4 w-4 mr-1" />
                  {isRecording ? 'Stop' : 'Record'}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Snapshot
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>

            {/* Telemetry */}
            <div className="grid grid-cols-4 gap-4 mt-4 text-xs">
              <Card className="p-3 bg-muted/30">
                <div className="text-muted-foreground mb-1">Speed</div>
                <div className="font-bold text-lg">{drone.speed} km/h</div>
              </Card>
              <Card className="p-3 bg-muted/30">
                <div className="text-muted-foreground mb-1">Altitude</div>
                <div className="font-bold text-lg">{drone.currentPosition.altitude}m</div>
              </Card>
              <Card className="p-3 bg-muted/30">
                <div className="text-muted-foreground mb-1">Coverage</div>
                <div className="font-bold text-lg">{drone.coverageRadius}km</div>
              </Card>
              <Card className="p-3 bg-muted/30">
                <div className="text-muted-foreground mb-1">Mission</div>
                <div className="font-bold text-cyan-400 truncate">{drone.routeType}</div>
              </Card>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
