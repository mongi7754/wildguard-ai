import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Flame, 
  Radio, 
  Activity, 
  BatteryLow, 
  WifiOff,
  CheckCircle2,
  Clock,
  MapPin
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IoTAlert } from '@/types/iot';
import { formatDistanceToNow } from 'date-fns';

interface IoTAlertPanelProps {
  alerts: IoTAlert[];
  onAcknowledge: (alertId: string) => void;
}

export function IoTAlertPanel({ alerts, onAcknowledge }: IoTAlertPanelProps) {
  const getAlertIcon = (alertType: IoTAlert['alertType']) => {
    switch (alertType) {
      case 'fire_detected': return <Flame className="w-4 h-4" />;
      case 'smoke_detected': return <Activity className="w-4 h-4" />;
      case 'motion_alert': return <AlertTriangle className="w-4 h-4" />;
      case 'low_battery': return <BatteryLow className="w-4 h-4" />;
      case 'signal_lost': return <WifiOff className="w-4 h-4" />;
      default: return <Radio className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: IoTAlert['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      default: return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
    }
  };

  const getSeverityBgColor = (severity: IoTAlert['severity']) => {
    switch (severity) {
      case 'critical': return 'border-l-red-500 bg-red-500/5';
      case 'warning': return 'border-l-yellow-500 bg-yellow-500/5';
      default: return 'border-l-blue-500 bg-blue-500/5';
    }
  };

  const criticalCount = alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length;
  const warningCount = alerts.filter(a => a.severity === 'warning' && !a.acknowledged).length;

  return (
    <Card className="bg-card/50 backdrop-blur border-primary/20 h-full">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <h3 className="font-semibold text-foreground">IoT Alerts</h3>
          </div>
          <div className="flex items-center gap-2">
            {criticalCount > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                {criticalCount} Critical
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                {warningCount} Warning
              </Badge>
            )}
          </div>
        </div>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="p-4 space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No active alerts</p>
            </div>
          ) : (
            alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-3 rounded-lg border-l-4 ${getSeverityBgColor(alert.severity)} ${
                  alert.acknowledged ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                      {getAlertIcon(alert.alertType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {alert.sensorType.replace('_', ' ')}
                        </Badge>
                        <Badge className={`text-[10px] ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">
                        {alert.message}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {alert.location.lat.toFixed(4)}, {alert.location.lng.toFixed(4)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {!alert.acknowledged && (
                  <div className="mt-3 flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAcknowledge(alert.id)}
                      className="text-xs h-7"
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Acknowledge
                    </Button>
                  </div>
                )}

                {alert.acknowledged && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-emerald-500">
                    <CheckCircle2 className="w-3 h-3" />
                    Acknowledged
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
