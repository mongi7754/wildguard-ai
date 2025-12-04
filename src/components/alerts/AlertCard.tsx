import { motion } from 'framer-motion';
import { AlertTriangle, Flame, Car, Radio, Droplets, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThreatAlert } from '@/types/wildlife';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface AlertCardProps {
  alert: ThreatAlert;
  compact?: boolean;
  onClick?: () => void;
}

const alertIcons = {
  poacher: User,
  fire: Flame,
  vehicle: Car,
  intrusion: AlertTriangle,
  acoustic: Radio,
  environmental: Droplets
};

const severityStyles = {
  low: { badge: 'success', border: '' },
  medium: { badge: 'warning', border: 'border-accent/30' },
  high: { badge: 'warning', border: 'border-accent/50' },
  critical: { badge: 'danger', border: 'border-danger/50' }
};

export function AlertCard({ alert, compact, onClick }: AlertCardProps) {
  const Icon = alertIcons[alert.type];
  const styles = severityStyles[alert.severity];
  
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <Card 
        variant={alert.severity === 'critical' ? 'danger' : alert.severity === 'high' ? 'alert' : 'tactical'}
        className={cn(
          "p-4 cursor-pointer transition-all duration-200",
          styles.border,
          alert.severity === 'critical' && "animate-pulse-glow"
        )}
        onClick={onClick}
      >
        <div className="flex items-start gap-3">
          <div className={cn(
            "p-2 rounded-lg shrink-0",
            alert.severity === 'critical' ? "bg-danger/20 text-danger" :
            alert.severity === 'high' ? "bg-accent/20 text-accent" :
            "bg-secondary text-secondary-foreground"
          )}>
            <Icon className="w-4 h-4" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-sm truncate">{alert.title}</h3>
              <Badge variant={styles.badge as any} className="shrink-0 text-[10px]">
                {alert.severity}
              </Badge>
            </div>
            
            {!compact && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {alert.description}
              </p>
            )}
            
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-muted-foreground">
                {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
              </span>
              <Badge 
                variant={alert.status === 'active' ? 'danger' : alert.status === 'investigating' ? 'warning' : 'success'}
                className="text-[10px]"
              >
                {alert.status}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
