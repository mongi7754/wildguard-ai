import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Play, Pause, SkipBack, SkipForward, 
  Clock, AlertTriangle, Flame, Shield, Users, Droplets
} from 'lucide-react';
import { HistoricalThreat, historicalThreats } from '@/data/historicalThreats';
import { motion, AnimatePresence } from 'framer-motion';

interface ThreatPlaybackProps {
  onThreatUpdate: (threats: HistoricalThreat[]) => void;
  mapBounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
}

export const ThreatPlayback = ({ onThreatUpdate, mapBounds }: ThreatPlaybackProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeThreats, setActiveThreats] = useState<HistoricalThreat[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timeline from 7 days ago to now (in hours)
  const totalHours = 7 * 24;
  const startTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const getCurrentDate = () => {
    return new Date(startTime.getTime() + currentTime * 60 * 60 * 1000);
  };

  const getThreatsAtTime = (timeHours: number) => {
    const targetTime = new Date(startTime.getTime() + timeHours * 60 * 60 * 1000);
    const windowStart = new Date(targetTime.getTime() - 2 * 60 * 60 * 1000);
    const windowEnd = new Date(targetTime.getTime() + 2 * 60 * 60 * 1000);
    
    return historicalThreats.filter(threat => 
      threat.timestamp >= windowStart && threat.timestamp <= windowEnd
    );
  };

  useEffect(() => {
    const threats = getThreatsAtTime(currentTime);
    setActiveThreats(threats);
    onThreatUpdate(threats);
  }, [currentTime, onThreatUpdate]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= totalHours) {
            setIsPlaying(false);
            return totalHours;
          }
          return prev + (playbackSpeed * 0.5);
        });
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, totalHours]);

  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'poaching': return Shield;
      case 'fire': return Flame;
      case 'wildlife_conflict': return Users;
      case 'drought': return Droplets;
      default: return AlertTriangle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      default: return 'bg-blue-500 text-white';
    }
  };

  return (
    <Card className="bg-card/90 backdrop-blur border-border/50">
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-400" />
            Threat Playback
          </span>
          <Badge variant="outline" className="text-[10px]">
            {activeThreats.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-4">
        {/* Current time display */}
        <div className="text-center font-mono text-sm">
          <div className="text-muted-foreground text-xs">Current Time</div>
          <div className="text-cyan-400">{getCurrentDate().toLocaleString()}</div>
        </div>

        {/* Timeline slider */}
        <div className="space-y-2">
          <Slider
            value={[currentTime]}
            max={totalHours}
            step={0.5}
            onValueChange={([value]) => setCurrentTime(value)}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>7 days ago</span>
            <span>Now</span>
          </div>
        </div>

        {/* Playback controls */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentTime(Math.max(0, currentTime - 12))}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            variant={isPlaying ? "secondary" : "default"}
            size="icon"
            className="h-10 w-10"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentTime(Math.min(totalHours, currentTime + 12))}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Speed controls */}
        <div className="flex justify-center gap-1">
          {[0.5, 1, 2, 4].map(speed => (
            <Button
              key={speed}
              variant={playbackSpeed === speed ? "secondary" : "ghost"}
              size="sm"
              className="h-6 text-[10px] px-2"
              onClick={() => setPlaybackSpeed(speed)}
            >
              {speed}x
            </Button>
          ))}
        </div>

        {/* Active threats list */}
        <AnimatePresence>
          {activeThreats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 max-h-32 overflow-y-auto"
            >
              {activeThreats.map(threat => {
                const Icon = getThreatIcon(threat.type);
                return (
                  <motion.div
                    key={threat.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-2 p-2 bg-muted/30 rounded text-xs"
                  >
                    <Icon className="h-3 w-3" />
                    <span className="flex-1 truncate">{threat.description}</span>
                    <Badge className={`text-[8px] ${getSeverityColor(threat.severity)}`}>
                      {threat.severity}
                    </Badge>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
