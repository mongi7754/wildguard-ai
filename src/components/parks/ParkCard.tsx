import { motion } from 'framer-motion';
import { MapPin, Users, Plane, AlertTriangle, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NationalPark } from '@/data/parksData';
import { cn } from '@/lib/utils';

interface ParkCardProps {
  park: NationalPark;
  onClick?: () => void;
}

const statusStyles = {
  stable: { badge: 'success', label: 'Stable' },
  vulnerable: { badge: 'warning', label: 'Vulnerable' },
  critical: { badge: 'danger', label: 'Critical' }
};

export function ParkCard({ park, onClick }: ParkCardProps) {
  const status = statusStyles[park.conservationStatus];
  
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <Card 
        variant="tactical"
        className="p-4 cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-forest to-forest-dark flex items-center justify-center shrink-0 text-2xl">
            {park.imageEmoji}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-sm">{park.name}</h3>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                  <MapPin className="w-3 h-3" />
                  <span>{park.country} • {park.area.toLocaleString()} km²</span>
                </div>
              </div>
              <Badge variant={status.badge as any} className="text-[10px] shrink-0">
                {status.label}
              </Badge>
            </div>
            
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              {park.description}
            </p>
            
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1 text-xs">
                <Users className="w-3 h-3 text-primary" />
                <span>{park.rangerTeams} teams</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <Plane className="w-3 h-3 text-success" />
                <span>{park.activeDrones} drones</span>
              </div>
              {park.recentAlerts > 0 && (
                <div className="flex items-center gap-1 text-xs text-danger">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{park.recentAlerts} alerts</span>
                </div>
              )}
            </div>
          </div>
          
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        </div>
      </Card>
    </motion.div>
  );
}
