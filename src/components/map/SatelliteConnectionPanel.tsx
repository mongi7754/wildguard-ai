import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Satellite, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { SatelliteConnection } from '@/data/kenyaParksRealData';
import { formatDistanceToNow } from 'date-fns';

interface SatelliteConnectionPanelProps {
  connections: SatelliteConnection[];
}

export const SatelliteConnectionPanel = ({ connections }: SatelliteConnectionPanelProps) => {
  const connectedCount = connections.filter(c => c.status === 'connected').length;
  
  return (
    <Card className="bg-card/90 backdrop-blur border-border/50">
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Satellite className="h-4 w-4 text-cyan-400" />
            Satellite Links
          </span>
          <Badge 
            variant="outline" 
            className={connectedCount === connections.length 
              ? 'text-green-400 border-green-500/50' 
              : 'text-amber-400 border-amber-500/50'
            }
          >
            {connectedCount}/{connections.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-2">
        {connections.map((sat) => (
          <div 
            key={sat.id}
            className="flex items-center justify-between p-2 rounded bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              {sat.status === 'connected' ? (
                <Wifi className="h-3 w-3 text-green-400" />
              ) : sat.status === 'syncing' ? (
                <RefreshCw className="h-3 w-3 text-amber-400 animate-spin" />
              ) : (
                <WifiOff className="h-3 w-3 text-red-400" />
              )}
              <div>
                <div className="text-xs font-medium">{sat.name}</div>
                <div className="text-[10px] text-muted-foreground">
                  {sat.resolution} • {formatDistanceToNow(sat.lastSync, { addSuffix: true })}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-cyan-400 font-mono">{sat.coverage.toFixed(1)}%</div>
              <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    sat.coverage > 95 ? 'bg-green-400' : 
                    sat.coverage > 90 ? 'bg-amber-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${sat.coverage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
