import { motion } from 'framer-motion';
import { Battery, Plane, Thermometer, Eye, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DroneStatus } from '@/types/wildlife';
import { cn } from '@/lib/utils';

interface DroneCardProps {
  drone: DroneStatus;
  isSelected?: boolean;
  onSelect?: () => void;
}

const statusStyles = {
  active: { badge: 'success', text: 'Active' },
  idle: { badge: 'secondary', text: 'Idle' },
  charging: { badge: 'warning', text: 'Charging' },
  maintenance: { badge: 'danger', text: 'Maintenance' }
};

export function DroneCard({ drone, isSelected, onSelect }: DroneCardProps) {
  const status = statusStyles[drone.status];
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        variant={isSelected ? 'glow' : 'tactical'}
        className={cn(
          "p-4 cursor-pointer transition-all duration-200",
          isSelected && "ring-1 ring-primary"
        )}
        onClick={onSelect}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2.5 rounded-xl",
              drone.status === 'active' ? "bg-primary/20 text-primary" : "bg-secondary text-secondary-foreground"
            )}>
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-sm">{drone.name}</h3>
              <Badge variant={status.badge as any} className="mt-1 text-[10px]">
                {status.text}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Battery className={cn(
              "w-4 h-4",
              drone.battery > 50 ? "text-success" :
              drone.battery > 20 ? "text-accent" : "text-danger"
            )} />
            <span className="text-xs font-medium">{drone.battery}%</span>
          </div>
        </div>
        
        {drone.status === 'active' && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Mission</span>
              <span className="font-medium">{drone.mission}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Altitude</span>
              <span className="font-medium">{drone.altitude}m</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Speed</span>
              <span className="font-medium">{drone.speed} km/h</span>
            </div>
            
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
              <Button 
                variant={drone.thermalMode ? 'default' : 'outline'} 
                size="sm" 
                className="flex-1 text-xs h-8"
              >
                <Thermometer className="w-3 h-3 mr-1" />
                Thermal
              </Button>
              <Button 
                variant={drone.nightVision ? 'default' : 'outline'} 
                size="sm" 
                className="flex-1 text-xs h-8"
              >
                <Eye className="w-3 h-3 mr-1" />
                Night
              </Button>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
