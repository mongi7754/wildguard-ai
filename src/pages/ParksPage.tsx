import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Map, 
  TreePine, 
  Users, 
  Plane, 
  AlertTriangle,
  Search,
  Filter
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ParkCard } from '@/components/parks/ParkCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { kenyanParks, getParkStats, NationalPark } from '@/data/parksData';
import { cn } from '@/lib/utils';

const statusFilters = ['all', 'stable', 'vulnerable', 'critical'];

export default function ParksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPark, setSelectedPark] = useState<NationalPark | null>(null);
  
  const stats = getParkStats();
  
  const filteredParks = kenyanParks.filter(park => {
    const matchesSearch = park.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          park.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || park.conservationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout title="National Parks">
      <div className="px-4 py-4 space-y-4">
        {/* Header Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-4 gap-2"
        >
          <Card variant="tactical" className="p-3 text-center">
            <TreePine className="w-4 h-4 mx-auto text-primary mb-1" />
            <p className="text-lg font-bold">{stats.totalParks}</p>
            <p className="text-[10px] text-muted-foreground">Parks</p>
          </Card>
          <Card variant="tactical" className="p-3 text-center">
            <Map className="w-4 h-4 mx-auto text-success mb-1" />
            <p className="text-lg font-bold">{(stats.totalArea / 1000).toFixed(1)}k</p>
            <p className="text-[10px] text-muted-foreground">km²</p>
          </Card>
          <Card variant="tactical" className="p-3 text-center">
            <Users className="w-4 h-4 mx-auto text-blue-400 mb-1" />
            <p className="text-lg font-bold">{stats.totalRangers}</p>
            <p className="text-[10px] text-muted-foreground">Teams</p>
          </Card>
          <Card variant="tactical" className="p-3 text-center">
            <AlertTriangle className="w-4 h-4 mx-auto text-danger mb-1" />
            <p className="text-lg font-bold">{stats.totalAlerts}</p>
            <p className="text-[10px] text-muted-foreground">Alerts</p>
          </Card>
        </motion.div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search parks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <div className="flex gap-1.5">
            {statusFilters.map((status) => (
              <Badge
                key={status}
                variant={statusFilter === status ? 
                  (status === 'critical' ? 'danger' : 
                   status === 'vulnerable' ? 'warning' : 
                   status === 'stable' ? 'success' : 'default') 
                  : 'outline'
                }
                className={cn(
                  "cursor-pointer capitalize text-[10px]",
                  statusFilter !== status && "opacity-60 hover:opacity-100"
                )}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </Badge>
            ))}
          </div>
        </div>

        {/* Parks List */}
        <motion.div 
          className="space-y-3"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.05 } }
          }}
        >
          {filteredParks.length > 0 ? (
            filteredParks.map((park) => (
              <motion.div
                key={park.id}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0 }
                }}
              >
                <ParkCard 
                  park={park} 
                  onClick={() => setSelectedPark(park)}
                />
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <TreePine className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No parks found</p>
            </div>
          )}
        </motion.div>

        {/* Selected Park Detail */}
        {selectedPark && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto"
          >
            <div className="min-h-screen px-4 py-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold">{selectedPark.name}</h2>
                <Button variant="ghost" size="sm" onClick={() => setSelectedPark(null)}>
                  Close
                </Button>
              </div>

              <div className="space-y-4">
                {/* Park Header */}
                <Card variant="glow" className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-forest to-forest-dark flex items-center justify-center text-3xl">
                      {selectedPark.imageEmoji}
                    </div>
                    <div>
                      <Badge variant={
                        selectedPark.conservationStatus === 'critical' ? 'danger' :
                        selectedPark.conservationStatus === 'vulnerable' ? 'warning' : 'success'
                      }>
                        {selectedPark.conservationStatus}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedPark.country} • Est. {selectedPark.established}
                      </p>
                      <p className="text-sm font-medium mt-1">
                        {selectedPark.area.toLocaleString()} km²
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Description */}
                <Card variant="tactical" className="p-4">
                  <p className="text-sm text-muted-foreground">{selectedPark.description}</p>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <Card variant="tactical" className="p-3 text-center">
                    <Users className="w-5 h-5 mx-auto text-primary mb-1" />
                    <p className="text-xl font-bold">{selectedPark.rangerTeams}</p>
                    <p className="text-[10px] text-muted-foreground">Ranger Teams</p>
                  </Card>
                  <Card variant="tactical" className="p-3 text-center">
                    <Plane className="w-5 h-5 mx-auto text-success mb-1" />
                    <p className="text-xl font-bold">{selectedPark.activeDrones}</p>
                    <p className="text-[10px] text-muted-foreground">Active Drones</p>
                  </Card>
                  <Card variant="tactical" className="p-3 text-center">
                    <AlertTriangle className="w-5 h-5 mx-auto text-danger mb-1" />
                    <p className="text-xl font-bold">{selectedPark.recentAlerts}</p>
                    <p className="text-[10px] text-muted-foreground">Alerts</p>
                  </Card>
                </div>

                {/* Key Wildlife */}
                <Card variant="tactical">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Key Wildlife</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedPark.keyWildlife.map((animal) => (
                        <Badge key={animal} variant="tactical">
                          {animal}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Threats */}
                <Card variant="alert">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Active Threats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedPark.threats.map((threat) => (
                        <Badge key={threat} variant="warning">
                          {threat}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button variant="default" className="flex-1">
                    <Map className="w-4 h-4 mr-2" />
                    View on Map
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    View Alerts
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
