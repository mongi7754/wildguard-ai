import { motion } from 'framer-motion';
import { Satellite, Signal, Clock, Zap, Wifi, WifiOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { SatelliteConnection } from '@/types/iot';

interface SatelliteStatusProps {
  connections: SatelliteConnection[];
}

export function SatelliteStatus({ connections }: SatelliteStatusProps) {
  const getStatusColor = (status: SatelliteConnection['status']) => {
    switch (status) {
      case 'connected': return 'text-emerald-500';
      case 'intermittent': return 'text-yellow-500';
      default: return 'text-red-500';
    }
  };

  const getStatusBadge = (status: SatelliteConnection['status']) => {
    switch (status) {
      case 'connected': return <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30">Connected</Badge>;
      case 'intermittent': return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Intermittent</Badge>;
      default: return <Badge variant="destructive">Disconnected</Badge>;
    }
  };

  const totalBandwidth = connections
    .filter(c => c.status === 'connected')
    .reduce((acc, c) => acc + c.bandwidth, 0);

  const avgLatency = connections
    .filter(c => c.status === 'connected')
    .reduce((acc, c, _, arr) => acc + c.latency / arr.length, 0);

  return (
    <Card className="bg-card/50 backdrop-blur border-primary/20">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Satellite className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground">Satellite Uplinks</h3>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-blue-500" />
              <span className="text-muted-foreground">Total BW:</span>
              <span className="font-medium">{totalBandwidth.toFixed(1)} Mbps</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-yellow-500" />
              <span className="text-muted-foreground">Avg Latency:</span>
              <span className="font-medium">{Math.round(avgLatency)}ms</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {connections.map((connection, index) => (
          <motion.div
            key={connection.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 rounded-lg bg-muted/30 border border-border/50"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-background ${getStatusColor(connection.status)}`}>
                  {connection.status === 'connected' ? (
                    <Wifi className="w-4 h-4" />
                  ) : (
                    <WifiOff className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-sm">{connection.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    Last sync: {new Date(connection.lastSync).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              {getStatusBadge(connection.status)}
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-muted-foreground">Coverage</span>
                  <span className="font-medium">{connection.coverage}%</span>
                </div>
                <Progress value={connection.coverage} className="h-1.5" />
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">Latency</p>
                <p className="font-medium text-foreground">{connection.latency}ms</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground">Bandwidth</p>
                <p className="font-medium text-foreground">{connection.bandwidth} Mbps</p>
              </div>
            </div>

            {/* Signal strength animation */}
            {connection.status === 'connected' && (
              <div className="mt-3 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(bar => (
                  <motion.div
                    key={bar}
                    className="w-1.5 rounded-full bg-primary"
                    initial={{ height: 4 }}
                    animate={{ 
                      height: [4, 4 + bar * 3, 4],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1.5,
                      delay: bar * 0.1 
                    }}
                  />
                ))}
                <span className="text-[10px] text-muted-foreground ml-2">Signal active</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
