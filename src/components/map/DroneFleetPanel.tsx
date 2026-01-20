import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DronePatrolRoute, calculateFleetStats } from '@/data/dronePatrolData';
import { 
  Plane, Battery, Radio, Thermometer, Moon, Eye, 
  RefreshCw, MapPin, Activity, Zap
} from 'lucide-react';

interface DroneFleetPanelProps {
  patrols: DronePatrolRoute[];
  onRefresh?: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'text-green-400 bg-green-500/20 border-green-500/50';
    case 'returning': return 'text-amber-400 bg-amber-500/20 border-amber-500/50';
    case 'standby': return 'text-blue-400 bg-blue-500/20 border-blue-500/50';
    case 'charging': return 'text-purple-400 bg-purple-500/20 border-purple-500/50';
    default: return 'text-muted-foreground bg-muted/20 border-muted/50';
  }
};

const getRouteTypeLabel = (type: string) => {
  switch (type) {
    case 'perimeter': return { label: 'Perimeter', color: 'text-green-400' };
    case 'grid': return { label: 'Grid Scan', color: 'text-blue-400' };
    case 'hotspot': return { label: 'Hotspot', color: 'text-red-400' };
    case 'emergency': return { label: 'Emergency', color: 'text-orange-400' };
    case 'surveillance': return { label: 'Surveillance', color: 'text-purple-400' };
    default: return { label: type, color: 'text-cyan-400' };
  }
};

export const DroneFleetPanel = ({ patrols, onRefresh }: DroneFleetPanelProps) => {
  const stats = calculateFleetStats(patrols);
  
  return (
    <Card className="bg-card/90 backdrop-blur border-purple-500/20">
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-purple-500/20">
              <Plane className="h-4 w-4 text-purple-400" />
            </div>
            Drone Fleet Command
          </span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onRefresh}>
            <RefreshCw className="h-3 w-3" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="px-4 pb-4 space-y-4">
        {/* Fleet Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-muted/30 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-purple-400">{stats.activePatrols}</div>
            <div className="text-[10px] text-muted-foreground">Active Patrols</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-cyan-400">{stats.totalCoverageKm2}</div>
            <div className="text-[10px] text-muted-foreground">Coverage km²</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-green-400">{stats.averageBattery}%</div>
            <div className="text-[10px] text-muted-foreground">Avg Battery</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-orange-400">{stats.thermalActive}</div>
            <div className="text-[10px] text-muted-foreground">Thermal Active</div>
          </div>
        </div>

        {/* Capability Indicators */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] text-orange-400 border-orange-500/50">
            <Thermometer className="h-3 w-3 mr-1" />
            {stats.thermalActive} Thermal
          </Badge>
          <Badge variant="outline" className="text-[10px] text-purple-400 border-purple-500/50">
            <Moon className="h-3 w-3 mr-1" />
            {stats.nightVisionActive} Night Vision
          </Badge>
        </div>

        {/* Active Patrol List */}
        <div className="space-y-2 max-h-[280px] overflow-y-auto">
          {patrols.map((patrol) => {
            const routeType = getRouteTypeLabel(patrol.routeType);
            
            return (
              <div 
                key={patrol.id}
                className="bg-muted/20 rounded-lg p-2 border border-border/50 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Plane className="h-3.5 w-3.5 text-purple-400" />
                    <span className="text-xs font-medium truncate max-w-[100px]">
                      {patrol.droneName}
                    </span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-[9px] h-4 ${getStatusColor(patrol.status)}`}
                  >
                    {patrol.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px]">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-2.5 w-2.5 text-muted-foreground" />
                    <span className={routeType.color}>{routeType.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity className="h-2.5 w-2.5 text-muted-foreground" />
                    <span>{patrol.speed} km/h</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Radio className="h-2.5 w-2.5 text-muted-foreground" />
                    <span>{patrol.coverageRadius} km</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-2.5 w-2.5 text-muted-foreground" />
                    <span>{patrol.currentPosition.altitude}m</span>
                  </div>
                </div>
                
                {/* Battery Progress */}
                <div className="mt-2 flex items-center gap-2">
                  <Battery className={`h-3 w-3 ${
                    patrol.battery > 50 ? 'text-green-400' : 
                    patrol.battery > 20 ? 'text-amber-400' : 'text-red-400'
                  }`} />
                  <Progress 
                    value={patrol.battery} 
                    className="h-1.5 flex-1"
                  />
                  <span className="text-[10px] font-mono">{patrol.battery}%</span>
                </div>
                
                {/* Capabilities */}
                <div className="flex items-center gap-1 mt-1.5">
                  {patrol.thermalEnabled && (
                    <div className="w-4 h-4 rounded bg-orange-500/20 flex items-center justify-center" title="Thermal Imaging">
                      <Thermometer className="h-2.5 w-2.5 text-orange-400" />
                    </div>
                  )}
                  {patrol.nightVision && (
                    <div className="w-4 h-4 rounded bg-purple-500/20 flex items-center justify-center" title="Night Vision">
                      <Moon className="h-2.5 w-2.5 text-purple-400" />
                    </div>
                  )}
                  <div className="w-4 h-4 rounded bg-green-500/20 flex items-center justify-center" title="Live Feed">
                    <Eye className="h-2.5 w-2.5 text-green-400" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
