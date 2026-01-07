import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Layers, Satellite, Video, Radio, Shield, Cloud, 
  Flame, Users, MapPin 
} from 'lucide-react';

interface MapLayer {
  id: string;
  name: string;
  icon: any;
  color: string;
  enabled: boolean;
  count?: number;
}

interface LiveMapLayersProps {
  layers: MapLayer[];
  onToggle: (layerId: string) => void;
}

export const LiveMapLayers = ({ layers, onToggle }: LiveMapLayersProps) => {
  return (
    <Card className="bg-card/90 backdrop-blur border-border/50 w-64">
      <CardHeader className="py-3 px-4">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Layers className="h-4 w-4" />
          Map Layers
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 space-y-1">
        {layers.map((layer) => (
          <div
            key={layer.id}
            className={`flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors ${
              layer.enabled ? 'bg-muted/30' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded ${layer.enabled ? layer.color : 'bg-muted'}`}>
                <layer.icon className={`h-3 w-3 ${layer.enabled ? 'text-white' : 'text-muted-foreground'}`} />
              </div>
              <span className="text-xs font-medium">{layer.name}</span>
              {layer.count !== undefined && layer.enabled && (
                <Badge variant="secondary" className="h-5 text-[10px]">
                  {layer.count}
                </Badge>
              )}
            </div>
            <Switch
              checked={layer.enabled}
              onCheckedChange={() => onToggle(layer.id)}
              className="scale-75"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export const defaultMapLayers: MapLayer[] = [
  { id: 'satellite', name: 'Satellite Imagery', icon: Satellite, color: 'bg-blue-500', enabled: true },
  { id: 'drones', name: 'Drone Feeds', icon: Video, color: 'bg-purple-500', enabled: true, count: 4 },
  { id: 'animals', name: 'Animal GPS', icon: Radio, color: 'bg-green-500', enabled: true, count: 6 },
  { id: 'poaching', name: 'Poaching Risk', icon: Shield, color: 'bg-red-500', enabled: true },
  { id: 'weather', name: 'Weather Overlay', icon: Cloud, color: 'bg-cyan-500', enabled: false },
  { id: 'fire', name: 'Fire Risk Zones', icon: Flame, color: 'bg-orange-500', enabled: true },
  { id: 'rangers', name: 'Ranger Patrols', icon: Users, color: 'bg-amber-500', enabled: false, count: 12 },
  { id: 'sensors', name: 'IoT Sensors', icon: MapPin, color: 'bg-pink-500', enabled: false, count: 48 }
];
