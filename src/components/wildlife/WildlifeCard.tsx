import { motion } from 'framer-motion';
import { Circle, MapPin, Navigation } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WildlifeSpecies } from '@/types/wildlife';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface WildlifeCardProps {
  species: WildlifeSpecies;
  onClick?: () => void;
}

const conservationColors = {
  LC: 'success',
  NT: 'tactical',
  VU: 'warning',
  EN: 'warning',
  CR: 'danger'
};

const conservationLabels = {
  LC: 'Least Concern',
  NT: 'Near Threatened',
  VU: 'Vulnerable',
  EN: 'Endangered',
  CR: 'Critical'
};

export function WildlifeCard({ species, onClick }: WildlifeCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        variant="tactical"
        className="p-4 cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-forest to-forest-dark flex items-center justify-center shrink-0">
            <span className="text-2xl">
              {species.name === 'African Elephant' ? '🐘' :
               species.name === 'Lion' ? '🦁' :
               species.name === 'Black Rhino' ? '🦏' :
               species.name === 'Giraffe' ? '🦒' :
               species.name === 'Cheetah' ? '🐆' : '🐾'}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-sm">{species.name}</h3>
                <p className="text-[10px] text-muted-foreground italic">
                  {species.scientificName}
                </p>
              </div>
              <Badge 
                variant={conservationColors[species.conservationStatus] as any}
                className="text-[10px] shrink-0"
              >
                {species.conservationStatus}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1">
                <Circle className="w-3 h-3 text-primary fill-primary" />
                <span className="text-xs font-medium">{species.count}</span>
                <span className="text-[10px] text-muted-foreground">detected</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
              <Navigation className="w-3 h-3" />
              <span>Last seen {formatDistanceToNow(species.lastSeen, { addSuffix: true })}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
