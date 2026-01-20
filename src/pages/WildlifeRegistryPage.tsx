import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, Search, Fingerprint, MapPin, Heart, 
  Activity, AlertTriangle, Clock, Hash, Shield,
  QrCode, Camera, Radio, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WildlifeIdentity {
  id: string;
  digitalId: string;
  species: string;
  name: string | null;
  parkId: string;
  biometricHash: string;
  collarId: string | null;
  status: 'healthy' | 'monitored' | 'at-risk' | 'critical';
  healthScore: number;
  age: number | null;
  gender: 'male' | 'female' | 'unknown';
  lastSeen: Date;
  location: { lat: number; lng: number };
  totalSightings: number;
  firstDetected: Date;
  reproductionStatus: string | null;
  familyGroup: string | null;
}

const mockRegistry: WildlifeIdentity[] = [
  {
    id: 'wl-1',
    digitalId: 'KWS-ELE-2024-00001',
    species: 'African Elephant',
    name: 'Tembo',
    parkId: 'amboseli',
    biometricHash: 'BIO-7F3A2E89D1C4B5',
    collarId: 'ELE-COLLAR-1892',
    status: 'healthy',
    healthScore: 95,
    age: 28,
    gender: 'male',
    lastSeen: new Date(),
    location: { lat: -2.6480, lng: 37.2600 },
    totalSightings: 847,
    firstDetected: new Date('2019-03-15'),
    reproductionStatus: 'breeding active',
    familyGroup: 'AA-Family'
  },
  {
    id: 'wl-2',
    digitalId: 'KWS-RHI-2024-00012',
    species: 'Black Rhino',
    name: 'Kifaru',
    parkId: 'mount-kenya',
    biometricHash: 'BIO-9D2C4E7F8A1B3',
    collarId: 'RHI-COLLAR-0567',
    status: 'monitored',
    healthScore: 82,
    age: 15,
    gender: 'female',
    lastSeen: new Date(Date.now() - 3600000),
    location: { lat: 0.1520, lng: 37.3050 },
    totalSightings: 312,
    firstDetected: new Date('2020-07-22'),
    reproductionStatus: 'pregnant',
    familyGroup: null
  },
  {
    id: 'wl-3',
    digitalId: 'KWS-LIO-2024-00089',
    species: 'Lion',
    name: 'Simba',
    parkId: 'masai-mara',
    biometricHash: 'BIO-4A8C2E6F9D1B7',
    collarId: 'LIO-COLLAR-2341',
    status: 'healthy',
    healthScore: 91,
    age: 8,
    gender: 'male',
    lastSeen: new Date(Date.now() - 7200000),
    location: { lat: -1.4061, lng: 35.0400 },
    totalSightings: 523,
    firstDetected: new Date('2021-01-10'),
    reproductionStatus: 'dominant male',
    familyGroup: 'Marsh Pride'
  },
  {
    id: 'wl-4',
    digitalId: 'KWS-CHE-2024-00156',
    species: 'Cheetah',
    name: null,
    parkId: 'samburu',
    biometricHash: 'BIO-1E5D7A9C3F2B8',
    collarId: null,
    status: 'at-risk',
    healthScore: 68,
    age: 5,
    gender: 'female',
    lastSeen: new Date(Date.now() - 86400000),
    location: { lat: 0.5150, lng: 37.5160 },
    totalSightings: 89,
    firstDetected: new Date('2022-04-05'),
    reproductionStatus: 'nursing',
    familyGroup: null
  },
  {
    id: 'wl-5',
    digitalId: 'KWS-GIR-2024-00234',
    species: 'Giraffe',
    name: 'Twiga',
    parkId: 'nairobi',
    biometricHash: 'BIO-6B4D9E2A8C1F5',
    collarId: 'GIR-COLLAR-4782',
    status: 'healthy',
    healthScore: 97,
    age: 12,
    gender: 'female',
    lastSeen: new Date(Date.now() - 1800000),
    location: { lat: -1.3733, lng: 36.8580 },
    totalSightings: 1247,
    firstDetected: new Date('2018-09-20'),
    reproductionStatus: 'with calf',
    familyGroup: 'Tower-7'
  }
];

const WildlifeRegistryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState<WildlifeIdentity | null>(null);
  const [filterSpecies, setFilterSpecies] = useState<string>('all');

  const filteredRegistry = mockRegistry.filter(animal => {
    const matchesSearch = 
      animal.digitalId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (animal.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesFilter = filterSpecies === 'all' || animal.species === filterSpecies;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400 bg-green-500/20 border-green-500/50';
      case 'monitored': return 'text-blue-400 bg-blue-500/20 border-blue-500/50';
      case 'at-risk': return 'text-amber-400 bg-amber-500/20 border-amber-500/50';
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/50';
      default: return 'text-muted-foreground';
    }
  };

  const getSpeciesIcon = (species: string) => {
    return '🦁'; // Simplified - would have species-specific icons
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
              <Database className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">National Wildlife Digital Registry</h1>
              <p className="text-sm text-muted-foreground">
                Immutable digital identities for Kenya's protected wildlife
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              <Hash className="h-3 w-3 mr-1" />
              Cryptographic Integrity
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Shield className="h-3 w-3 mr-1" />
              Blockchain Verified
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4">
          <Card className="bg-card/50 border-cyan-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-cyan-400">34,892</p>
              <p className="text-xs text-muted-foreground">Registered Identities</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-green-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-green-400">89%</p>
              <p className="text-xs text-muted-foreground">Healthy Status</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-purple-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-purple-400">156</p>
              <p className="text-xs text-muted-foreground">Species Tracked</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-amber-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-amber-400">12,458</p>
              <p className="text-xs text-muted-foreground">Active Collars</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-red-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-red-400">47</p>
              <p className="text-xs text-muted-foreground">Critical Status</p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by ID, name, or species..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline">
            <QrCode className="h-4 w-4 mr-2" />
            Scan ID
          </Button>
        </div>

        {/* Registry List & Detail */}
        <div className="grid grid-cols-3 gap-6">
          {/* List */}
          <div className="col-span-2 space-y-3">
            <AnimatePresence>
              {filteredRegistry.map((animal, index) => (
                <motion.div
                  key={animal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all ${
                      selectedAnimal?.id === animal.id 
                        ? 'bg-primary/10 border-primary/50' 
                        : 'bg-card/50 hover:bg-card/80'
                    }`}
                    onClick={() => setSelectedAnimal(animal)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center text-2xl">
                            {getSpeciesIcon(animal.species)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-cyan-400">{animal.digitalId}</span>
                              <Badge variant="outline" className={getStatusColor(animal.status)}>
                                {animal.status}
                              </Badge>
                            </div>
                            <h3 className="font-semibold">
                              {animal.name || 'Unnamed'} 
                              <span className="text-muted-foreground font-normal ml-2">({animal.species})</span>
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Fingerprint className="h-3 w-3" />
                                {animal.biometricHash.slice(0, 12)}...
                              </span>
                              {animal.collarId && (
                                <span className="flex items-center gap-1">
                                  <Radio className="h-3 w-3" />
                                  {animal.collarId}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <Heart className="h-4 w-4 text-red-400" />
                            <span className="text-lg font-bold">{animal.healthScore}%</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {animal.totalSightings} sightings
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Detail Panel */}
          <div>
            {selectedAnimal ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <Card className="bg-card/50 border-cyan-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Fingerprint className="h-5 w-5 text-cyan-400" />
                        Digital Identity
                      </span>
                      <Badge className={getStatusColor(selectedAnimal.status)}>
                        {selectedAnimal.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/30 rounded-lg p-3 font-mono text-center">
                      <p className="text-xs text-muted-foreground">Digital ID</p>
                      <p className="text-cyan-400">{selectedAnimal.digitalId}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Species</p>
                        <p className="font-medium">{selectedAnimal.species}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Name</p>
                        <p className="font-medium">{selectedAnimal.name || 'Unnamed'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Age</p>
                        <p className="font-medium">{selectedAnimal.age ? `${selectedAnimal.age} years` : 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Gender</p>
                        <p className="font-medium capitalize">{selectedAnimal.gender}</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-border/50 pt-3">
                      <p className="text-xs text-muted-foreground mb-1">Biometric Hash</p>
                      <code className="text-xs bg-muted/50 px-2 py-1 rounded block overflow-hidden text-ellipsis">
                        {selectedAnimal.biometricHash}
                      </code>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>Last seen: {selectedAnimal.lastSeen.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span>{selectedAnimal.location.lat.toFixed(4)}°, {selectedAnimal.location.lng.toFixed(4)}°</span>
                    </div>
                    
                    {selectedAnimal.reproductionStatus && (
                      <Badge variant="outline" className="text-purple-400 border-purple-500/50">
                        {selectedAnimal.reproductionStatus}
                      </Badge>
                    )}
                    
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Camera className="h-3 w-3 mr-1" />
                        Images
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Activity className="h-3 w-3 mr-1" />
                        History
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="bg-card/50 border-dashed h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <Database className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Select an animal to view identity details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default WildlifeRegistryPage;
