import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LiveMapLayers, defaultMapLayers } from '@/components/map/LiveMapLayers';
import { AnimalTrackingLayer } from '@/components/map/AnimalTrackingLayer';
import { PoachingHeatmap } from '@/components/map/PoachingHeatmap';
import { DroneFeedOverlay } from '@/components/map/DroneFeedOverlay';
import { WeatherOverlay } from '@/components/map/WeatherOverlay';
import { FireRiskOverlay } from '@/components/map/FireRiskOverlay';
import { animalTracking, poachingRiskZones, droneFeedsData, weatherData, fireRiskZones } from '@/data/fireDetectionData';
import { 
  Satellite, ZoomIn, ZoomOut, Maximize2, X, MapPin, 
  Radio, Video, Shield, Flame, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimalTracking, PoachingRiskZone, DroneFeed, FireRiskZone } from '@/types/fire';
import kenyaSatelliteView from '@/assets/kenya-satellite-view.jpg';

// Kenya map bounds (approximate)
const KENYA_BOUNDS = {
  minLat: -4.5,
  maxLat: 4.5,
  minLng: 34,
  maxLng: 42
};

// Park locations for the map
const parkLocations = [
  { id: 'masai-mara', name: 'Masai Mara', lat: -1.4, lng: 35.2 },
  { id: 'amboseli', name: 'Amboseli', lat: -2.65, lng: 37.25 },
  { id: 'tsavo-east', name: 'Tsavo East', lat: -2.9, lng: 38.5 },
  { id: 'tsavo-west', name: 'Tsavo West', lat: -2.85, lng: 38.0 },
  { id: 'lake-nakuru', name: 'Lake Nakuru', lat: -0.35, lng: 36.1 },
  { id: 'samburu', name: 'Samburu', lat: 0.55, lng: 37.5 },
  { id: 'meru', name: 'Meru', lat: 0.15, lng: 38.2 },
  { id: 'nairobi', name: 'Nairobi NP', lat: -1.35, lng: 36.85 }
];

type SelectedItem = 
  | { type: 'animal'; data: AnimalTracking }
  | { type: 'poaching'; data: PoachingRiskZone }
  | { type: 'drone'; data: DroneFeed }
  | { type: 'fire'; data: FireRiskZone }
  | null;

const LiveSatelliteMapPage = () => {
  const [layers, setLayers] = useState(defaultMapLayers);
  const [zoom, setZoom] = useState(1);
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const toggleLayer = (layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, enabled: !layer.enabled } : layer
    ));
  };

  const isLayerEnabled = (layerId: string) => 
    layers.find(l => l.id === layerId)?.enabled ?? false;

  const handleRefresh = () => {
    setLastUpdate(new Date());
  };

  const getPosition = (lat: number, lng: number) => {
    const x = ((lng - KENYA_BOUNDS.minLng) / (KENYA_BOUNDS.maxLng - KENYA_BOUNDS.minLng)) * 100;
    const y = ((KENYA_BOUNDS.maxLat - lat) / (KENYA_BOUNDS.maxLat - KENYA_BOUNDS.minLat)) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  return (
    <AppLayout>
      <div className="h-[calc(100vh-4rem)] flex flex-col p-4 gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Satellite className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Live Satellite Monitoring</h1>
              <p className="text-sm text-muted-foreground">
                Real-time Kenya National Parks Map
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-green-400 border-green-500/50">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
              LIVE
            </Badge>
            <span className="text-xs text-muted-foreground">
              Updated: {lastUpdate.toLocaleTimeString()}
            </span>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 flex gap-4">
          {/* Main Map */}
          <div className="flex-1 relative">
            <Card className="h-full bg-card/50 backdrop-blur border-border/50 overflow-hidden">
              <div 
                className="absolute inset-0"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
              >
                {/* Satellite imagery background */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(${kenyaSatelliteView})`,
                    filter: 'brightness(0.85) saturate(1.1)'
                  }}
                />
                
                {/* Scan line effect for satellite feel */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-pulse" style={{ animationDuration: '4s' }} />
                </div>
                
                {/* Coordinate grid overlay */}
                <div className="absolute inset-0 opacity-20">
                  <svg width="100%" height="100%">
                    <defs>
                      <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                        <path d="M 80 0 L 0 0 0 80" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                {/* Kenya boundary overlay */}
                <div className="absolute inset-4 border-2 border-cyan-400/40 rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.15)]">
                  <div className="absolute top-2 left-2 px-2 py-1 bg-background/80 rounded text-xs text-cyan-400 font-mono">
                    KENYA • SATELLITE VIEW • {zoom.toFixed(1)}x
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-background/80 rounded text-xs text-cyan-400/60 font-mono">
                    LAT: -1.2921° | LNG: 36.8219°
                  </div>
                </div>

                {/* Park markers */}
                {parkLocations.map((park) => {
                  const pos = getPosition(park.lat, park.lng);
                  return (
                    <div
                      key={park.id}
                      className="absolute"
                      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    >
                      <div className="relative group">
                        <div className="w-3 h-3 rounded-full bg-emerald-500/40 border border-emerald-400/60" />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden group-hover:block">
                          <span className="text-[10px] text-emerald-400 whitespace-nowrap bg-background/80 px-1 rounded">
                            {park.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Layer overlays */}
                {isLayerEnabled('fire') && (
                  <FireRiskOverlay
                    zones={fireRiskZones}
                    mapBounds={KENYA_BOUNDS}
                    onSelect={(zone) => setSelectedItem({ type: 'fire', data: zone })}
                  />
                )}

                {isLayerEnabled('poaching') && (
                  <PoachingHeatmap
                    zones={poachingRiskZones}
                    mapBounds={KENYA_BOUNDS}
                    onSelect={(zone) => setSelectedItem({ type: 'poaching', data: zone })}
                  />
                )}

                {isLayerEnabled('animals') && (
                  <AnimalTrackingLayer
                    animals={animalTracking}
                    mapBounds={KENYA_BOUNDS}
                    onSelect={(animal) => setSelectedItem({ type: 'animal', data: animal })}
                  />
                )}

                {isLayerEnabled('drones') && (
                  <DroneFeedOverlay
                    drones={droneFeedsData}
                    mapBounds={KENYA_BOUNDS}
                    onSelect={(drone) => setSelectedItem({ type: 'drone', data: drone })}
                  />
                )}

                {isLayerEnabled('weather') && (
                  <WeatherOverlay
                    weatherData={weatherData}
                    mapBounds={KENYA_BOUNDS}
                  />
                )}
              </div>

              {/* Zoom controls */}
              <div className="absolute right-4 top-4 flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 bg-background/80"
                  onClick={() => setZoom(Math.min(2, zoom + 0.25))}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 bg-background/80"
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 bg-background/80"
                  onClick={() => setZoom(1)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Stats overlay */}
              <div className="absolute left-4 bottom-4 flex gap-2">
                <div className="bg-background/80 backdrop-blur rounded-lg px-3 py-2 flex items-center gap-2">
                  <Radio className="h-4 w-4 text-green-400" />
                  <span className="text-xs">{animalTracking.length} Animals</span>
                </div>
                <div className="bg-background/80 backdrop-blur rounded-lg px-3 py-2 flex items-center gap-2">
                  <Video className="h-4 w-4 text-purple-400" />
                  <span className="text-xs">{droneFeedsData.filter(d => d.status === 'live').length} Drones Live</span>
                </div>
                <div className="bg-background/80 backdrop-blur rounded-lg px-3 py-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-400" />
                  <span className="text-xs">{poachingRiskZones.filter(z => z.riskLevel > 60).length} High Risk Zones</span>
                </div>
                <div className="bg-background/80 backdrop-blur rounded-lg px-3 py-2 flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-400" />
                  <span className="text-xs">{fireRiskZones.filter(z => z.riskLevel === 'high' || z.riskLevel === 'extreme').length} Fire Alerts</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right sidebar */}
          <div className="w-72 flex flex-col gap-4">
            <LiveMapLayers layers={layers} onToggle={toggleLayer} />

            {/* Selected item details */}
            <AnimatePresence>
              {selectedItem && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card className="bg-card/90 backdrop-blur border-border/50">
                    <CardHeader className="py-3 px-4 flex-row items-center justify-between">
                      <CardTitle className="text-sm">
                        {selectedItem.type === 'animal' && '🦁 Animal Details'}
                        {selectedItem.type === 'drone' && '🛸 Drone Feed'}
                        {selectedItem.type === 'poaching' && '🛡️ Risk Zone'}
                        {selectedItem.type === 'fire' && '🔥 Fire Risk'}
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => setSelectedItem(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 text-sm space-y-2">
                      {selectedItem.type === 'animal' && (
                        <>
                          <p><strong>Name:</strong> {selectedItem.data.name}</p>
                          <p><strong>Species:</strong> {selectedItem.data.species}</p>
                          <p><strong>Collar ID:</strong> {selectedItem.data.collarId}</p>
                          <p><strong>Status:</strong> {selectedItem.data.healthStatus}</p>
                          <p><strong>Speed:</strong> {selectedItem.data.speed} km/h</p>
                          <p><strong>Battery:</strong> {selectedItem.data.batteryLevel}%</p>
                        </>
                      )}
                      {selectedItem.type === 'drone' && (
                        <>
                          <p><strong>Name:</strong> {selectedItem.data.name}</p>
                          <p><strong>Status:</strong> {selectedItem.data.status}</p>
                          <p><strong>Mission:</strong> {selectedItem.data.mission}</p>
                          <p><strong>Altitude:</strong> {selectedItem.data.altitude}m</p>
                          <p><strong>Battery:</strong> {selectedItem.data.battery}%</p>
                        </>
                      )}
                      {selectedItem.type === 'poaching' && (
                        <>
                          <p><strong>Risk Level:</strong> {selectedItem.data.riskLevel}%</p>
                          <p><strong>Radius:</strong> {selectedItem.data.radius} km</p>
                          <p><strong>Factors:</strong></p>
                          <ul className="text-xs text-muted-foreground pl-4">
                            {selectedItem.data.factors.map((f, i) => (
                              <li key={i}>• {f}</li>
                            ))}
                          </ul>
                          <p className="text-xs mt-2 p-2 bg-muted/30 rounded">
                            <strong>Recommendation:</strong> {selectedItem.data.patrolRecommendation}
                          </p>
                        </>
                      )}
                      {selectedItem.type === 'fire' && (
                        <>
                          <p><strong>Risk Level:</strong> {selectedItem.data.riskLevel}</p>
                          <p><strong>Probability:</strong> {(selectedItem.data.prediction.probability * 100).toFixed(0)}%</p>
                          <p><strong>Timeframe:</strong> {selectedItem.data.prediction.timeframe}</p>
                          <p className="text-xs mt-2 p-2 bg-muted/30 rounded">
                            <strong>Recommendation:</strong> {selectedItem.data.prediction.recommendation}
                          </p>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default LiveSatelliteMapPage;
