import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Layers,
  Navigation,
  MapPin,
  Plane,
  Users,
  AlertTriangle,
  Maximize2,
  Target,
  Circle
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockDrones, mockRangers, mockAlerts, mockTracking } from '@/data/mockData';
import { cn } from '@/lib/utils';

const mapLayers = [
  { id: 'wildlife', label: 'Wildlife', icon: '🐘', color: 'primary' },
  { id: 'drones', label: 'Drones', icon: Plane, color: 'success' },
  { id: 'rangers', label: 'Rangers', icon: Users, color: 'info' },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle, color: 'danger' },
  { id: 'geofence', label: 'Geofence', icon: Target, color: 'accent' },
];

export default function MapPage() {
  const [activeLayers, setActiveLayers] = useState(['wildlife', 'drones', 'alerts']);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const toggleLayer = (layerId: string) => {
    setActiveLayers(prev => 
      prev.includes(layerId) 
        ? prev.filter(l => l !== layerId)
        : [...prev, layerId]
    );
  };

  return (
    <AppLayout title="Live Map">
      <div className="relative h-[calc(100vh-8rem)]">
        {/* Map Container */}
        <div className="absolute inset-0 bg-forest-dark">
          {/* Grid overlay */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />

          {/* Simulated terrain */}
          <div className="absolute inset-0">
            <div className="absolute top-[10%] left-[20%] w-32 h-24 bg-forest/30 rounded-full blur-xl" />
            <div className="absolute top-[30%] right-[15%] w-48 h-32 bg-forest/40 rounded-full blur-2xl" />
            <div className="absolute bottom-[25%] left-[30%] w-40 h-28 bg-forest-light/20 rounded-full blur-xl" />
            <div className="absolute bottom-[40%] right-[25%] w-24 h-24 bg-blue-500/10 rounded-full blur-xl" />
          </div>

          {/* Map markers */}
          {activeLayers.includes('wildlife') && mockTracking.map((animal, i) => (
            <motion.div
              key={animal.id}
              className="absolute cursor-pointer"
              style={{
                left: `${30 + i * 20}%`,
                top: `${35 + i * 10}%`
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.2 }}
              onClick={() => setSelectedItem({ type: 'wildlife', data: animal })}
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
                  <span className="text-sm">
                    {animal.species === 'African Elephant' ? '🐘' : '🦏'}
                  </span>
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full animate-ping" />
              </div>
            </motion.div>
          ))}

          {activeLayers.includes('drones') && mockDrones.filter(d => d.status === 'active').map((drone, i) => (
            <motion.div
              key={drone.id}
              className="absolute cursor-pointer"
              style={{
                left: `${45 + i * 15}%`,
                top: `${25 + i * 20}%`
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.2 }}
              onClick={() => setSelectedItem({ type: 'drone', data: drone })}
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center border border-success/50">
                  <Plane className="w-4 h-4 text-success" />
                </div>
                <div className="absolute -inset-4 border border-success/20 rounded-full animate-radar" />
              </div>
            </motion.div>
          ))}

          {activeLayers.includes('rangers') && mockRangers.filter(r => r.status !== 'off-duty').slice(0, 2).map((ranger, i) => (
            <motion.div
              key={ranger.id}
              className="absolute cursor-pointer"
              style={{
                left: `${55 + i * 20}%`,
                top: `${50 + i * 15}%`
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.2 }}
              onClick={() => setSelectedItem({ type: 'ranger', data: ranger })}
            >
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/50">
                <Users className="w-4 h-4 text-blue-400" />
              </div>
            </motion.div>
          ))}

          {activeLayers.includes('alerts') && mockAlerts.filter(a => a.status === 'active').slice(0, 2).map((alert, i) => (
            <motion.div
              key={alert.id}
              className="absolute cursor-pointer"
              style={{
                left: `${25 + i * 35}%`,
                top: `${45 + i * 20}%`
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.2 }}
              onClick={() => setSelectedItem({ type: 'alert', data: alert })}
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-danger/30 flex items-center justify-center border border-danger animate-pulse">
                  <AlertTriangle className="w-4 h-4 text-danger" />
                </div>
              </div>
            </motion.div>
          ))}

          {/* Geofence zones */}
          {activeLayers.includes('geofence') && (
            <>
              <div className="absolute top-[20%] left-[15%] w-40 h-40 border-2 border-dashed border-accent/40 rounded-full" />
              <div className="absolute bottom-[30%] right-[20%] w-32 h-32 border-2 border-dashed border-danger/40 rounded-full" />
            </>
          )}

          {/* Center indicator */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 border border-foreground/30 rotate-45" />
          </div>
        </div>

        {/* Layer Controls */}
        <div className="absolute top-4 right-4 z-10">
        <Card variant="tactical" className="p-2">
            <div className="space-y-1">
              {mapLayers.map((layer) => {
                const isActive = activeLayers.includes(layer.id);
                return (
                  <Button
                    key={layer.id}
                    variant={isActive ? 'default' : 'ghost'}
                    size="icon-sm"
                    className={cn(!isActive && "opacity-50")}
                    onClick={() => toggleLayer(layer.id)}
                  >
                    {typeof layer.icon === 'string' ? (
                      <span className="text-sm">{layer.icon}</span>
                    ) : (
                      <layer.icon className="w-4 h-4" />
                    )}
                  </Button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 z-10">
          <Card variant="tactical" className="p-2">
            <div className="space-y-1">
              <Button variant="ghost" size="icon-sm">
                <span className="text-lg font-bold">+</span>
              </Button>
              <Button variant="ghost" size="icon-sm">
                <span className="text-lg font-bold">−</span>
              </Button>
              <Button variant="ghost" size="icon-sm">
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="absolute bottom-4 left-4 right-16 z-10">
          <Card variant="tactical" className="p-3">
            <div className="flex items-center justify-around text-center">
              <div>
                <p className="text-lg font-bold text-primary">{mockTracking.length}</p>
                <p className="text-[10px] text-muted-foreground">Tracked</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <p className="text-lg font-bold text-success">{mockDrones.filter(d => d.status === 'active').length}</p>
                <p className="text-[10px] text-muted-foreground">Drones</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <p className="text-lg font-bold text-danger">{mockAlerts.filter(a => a.status === 'active').length}</p>
                <p className="text-[10px] text-muted-foreground">Alerts</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Selected Item Panel */}
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 left-4 z-10 w-64"
          >
            <Card variant="glow" className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="tactical" className="capitalize">
                  {selectedItem.type}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="icon-sm"
                  onClick={() => setSelectedItem(null)}
                >
                  ✕
                </Button>
              </div>
              
              {selectedItem.type === 'wildlife' && (
                <div>
                  <p className="font-semibold">{selectedItem.data.name || selectedItem.data.species}</p>
                  <p className="text-xs text-muted-foreground">{selectedItem.data.species}</p>
                  <div className="mt-2 text-xs">
                    <p>Tag: {selectedItem.data.tagType}</p>
                    <p>Status: {selectedItem.data.healthStatus}</p>
                  </div>
                </div>
              )}
              
              {selectedItem.type === 'drone' && (
                <div>
                  <p className="font-semibold">{selectedItem.data.name}</p>
                  <div className="mt-2 text-xs space-y-1">
                    <p>Battery: {selectedItem.data.battery}%</p>
                    <p>Altitude: {selectedItem.data.altitude}m</p>
                    <p>Mission: {selectedItem.data.mission}</p>
                  </div>
                </div>
              )}
              
              {selectedItem.type === 'alert' && (
                <div>
                  <p className="font-semibold text-danger">{selectedItem.data.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedItem.data.description}
                  </p>
                </div>
              )}
              
              {selectedItem.type === 'ranger' && (
                <div>
                  <p className="font-semibold">{selectedItem.data.name}</p>
                  <div className="mt-2 text-xs space-y-1">
                    <p>Members: {selectedItem.data.members}</p>
                    <p>Status: {selectedItem.data.status}</p>
                    {selectedItem.data.currentMission && (
                      <p>Mission: {selectedItem.data.currentMission}</p>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
