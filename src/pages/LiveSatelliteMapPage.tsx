import { useState, useRef, useEffect, useCallback } from 'react';
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
import { ThreatPlayback } from '@/components/map/ThreatPlayback';
import { LockedPointMarker } from '@/components/map/LockedPointMarker';
import { animalTracking, poachingRiskZones, droneFeedsData, weatherData, fireRiskZones } from '@/data/fireDetectionData';
import { mockSensors } from '@/data/iotMockData';
import { HistoricalThreat } from '@/data/historicalThreats';
import { 
  Satellite, ZoomIn, ZoomOut, Maximize2, X, MapPin, 
  Radio, Video, Shield, Flame, RefreshCw, Crosshair, Target,
  Lock, Move, Navigation, AlertTriangle, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimalTracking, PoachingRiskZone, DroneFeed, FireRiskZone } from '@/types/fire';
import satelliteAerialMap from '@/assets/satellite-aerial-map.png';

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

// Zoom level thresholds for detail visibility
const ZOOM_LEVELS = {
  overview: 0.75,
  regional: 1.0,
  detailed: 1.25,
  precise: 1.5,
  maximum: 2.0
};

interface LockedPoint {
  lat: number;
  lng: number;
  timestamp: Date;
}

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
  const [gpsCoords, setGpsCoords] = useState({ lat: -1.2921, lng: 36.8219 });
  const [showCrosshair, setShowCrosshair] = useState(true);
  
  // Pan/Drag state
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  // Locked points state
  const [lockedPoints, setLockedPoints] = useState<LockedPoint[]>([]);
  
  // Historical threats from playback
  const [playbackThreats, setPlaybackThreats] = useState<HistoricalThreat[]>([]);
  const [showPlayback, setShowPlayback] = useState(false);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

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

  // Convert pixel position to GPS coordinates
  const pixelToGps = useCallback((pixelX: number, pixelY: number, containerRect: DOMRect) => {
    // Account for pan offset and zoom
    const adjustedX = (pixelX - containerRect.left - panOffset.x) / zoom;
    const adjustedY = (pixelY - containerRect.top - panOffset.y) / zoom;
    
    const relX = adjustedX / containerRect.width;
    const relY = adjustedY / containerRect.height;
    
    const lng = KENYA_BOUNDS.minLng + (relX * (KENYA_BOUNDS.maxLng - KENYA_BOUNDS.minLng));
    const lat = KENYA_BOUNDS.maxLat - (relY * (KENYA_BOUNDS.maxLat - KENYA_BOUNDS.minLat));
    
    return { lat, lng };
  }, [panOffset, zoom]);

  // Calculate distance between two GPS points (Haversine formula)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Calculate bearing between two GPS points
  const calculateBearing = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    
    const x = Math.sin(dLng) * Math.cos(lat2Rad);
    const y = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
              Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);
    
    let bearing = Math.atan2(x, y) * 180 / Math.PI;
    return (bearing + 360) % 360;
  };

  // Handle mouse movement for GPS tracking
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    
    if (isDragging && isPanning) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      setPanOffset({
        x: panOffset.x + deltaX,
        y: panOffset.y + deltaY
      });
      setDragStart({ x: e.clientX, y: e.clientY });
    } else {
      const coords = pixelToGps(e.clientX, e.clientY, rect);
      setGpsCoords(coords);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPanning) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle click to lock point
  const handleMapClick = (e: React.MouseEvent) => {
    if (isPanning || isDragging) return;
    if (!mapContainerRef.current) return;
    
    const rect = mapContainerRef.current.getBoundingClientRect();
    const coords = pixelToGps(e.clientX, e.clientY, rect);
    
    const newPoint: LockedPoint = {
      lat: coords.lat,
      lng: coords.lng,
      timestamp: new Date()
    };
    
    setLockedPoints(prev => [...prev, newPoint]);
  };

  const removeLockedPoint = (index: number) => {
    setLockedPoints(prev => prev.filter((_, i) => i !== index));
  };

  // Get zoom level label
  const getZoomLabel = () => {
    if (zoom >= ZOOM_LEVELS.maximum) return 'MAXIMUM';
    if (zoom >= ZOOM_LEVELS.precise) return 'PRECISE';
    if (zoom >= ZOOM_LEVELS.detailed) return 'DETAILED';
    if (zoom >= ZOOM_LEVELS.regional) return 'REGIONAL';
    return 'OVERVIEW';
  };

  // Determine which elements to show based on zoom
  const showDetailedAnimals = zoom >= ZOOM_LEVELS.detailed;
  const showSensors = zoom >= ZOOM_LEVELS.precise;
  const showLabels = zoom >= ZOOM_LEVELS.maximum;

  // Handle threat playback updates
  const handleThreatUpdate = useCallback((threats: HistoricalThreat[]) => {
    setPlaybackThreats(threats);
  }, []);

  // Reset pan when zoom changes significantly
  useEffect(() => {
    if (zoom === 1) {
      setPanOffset({ x: 0, y: 0 });
    }
  }, [zoom]);

  // Get threat icon color
  const getThreatColor = (type: string) => {
    switch (type) {
      case 'poaching': return 'text-red-500 bg-red-500/20';
      case 'fire': return 'text-orange-500 bg-orange-500/20';
      case 'wildlife_conflict': return 'text-yellow-500 bg-yellow-500/20';
      case 'drought': return 'text-amber-500 bg-amber-500/20';
      default: return 'text-blue-500 bg-blue-500/20';
    }
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
            <Badge variant="outline" className="font-mono text-xs">
              {getZoomLabel()}
            </Badge>
            {lockedPoints.length > 0 && (
              <Badge variant="outline" className="text-red-400 border-red-500/50">
                <Lock className="h-3 w-3 mr-1" />
                {lockedPoints.length} Locked
              </Badge>
            )}
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
                ref={mapContainerRef}
                className={`absolute inset-0 ${isPanning ? 'cursor-grab' : 'cursor-crosshair'} ${isDragging ? 'cursor-grabbing' : ''}`}
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onClick={handleMapClick}
              >
                <div 
                  ref={mapRef}
                  className="absolute inset-0 transition-transform duration-100"
                  style={{ 
                    transform: `scale(${zoom}) translate(${panOffset.x / zoom}px, ${panOffset.y / zoom}px)`,
                    transformOrigin: 'center'
                  }}
                >
                  {/* Satellite imagery background */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url(${satelliteAerialMap})`,
                      filter: 'brightness(0.85) saturate(1.1)'
                    }}
                  />
                  
                  {/* Scan line effect */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-pulse" style={{ animationDuration: '4s' }} />
                  </div>
                  
                  {/* Coordinate grid overlay */}
                  <div className="absolute inset-0" style={{ opacity: 0.15 + (zoom * 0.1) }}>
                    <svg width="100%" height="100%">
                      <defs>
                        <pattern id="grid-main" width={80 / zoom} height={80 / zoom} patternUnits="userSpaceOnUse">
                          <path d={`M ${80/zoom} 0 L 0 0 0 ${80/zoom}`} fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5"/>
                        </pattern>
                        {zoom >= ZOOM_LEVELS.detailed && (
                          <pattern id="grid-fine" width={20 / zoom} height={20 / zoom} patternUnits="userSpaceOnUse">
                            <path d={`M ${20/zoom} 0 L 0 0 0 ${20/zoom}`} fill="none" stroke="hsl(var(--primary))" strokeWidth="0.2"/>
                          </pattern>
                        )}
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid-main)" />
                      {zoom >= ZOOM_LEVELS.detailed && (
                        <rect width="100%" height="100%" fill="url(#grid-fine)" />
                      )}
                    </svg>
                  </div>

                  {/* Kenya boundary overlay */}
                  <div className="absolute inset-4 border-2 border-cyan-400/40 rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.15)]">
                    <div className="absolute top-2 left-2 px-2 py-1 bg-background/90 rounded text-xs text-cyan-400 font-mono flex items-center gap-2">
                      <Satellite className="h-3 w-3" />
                      KENYA • {getZoomLabel()} • {zoom.toFixed(2)}x
                    </div>
                  </div>

                  {/* Park markers */}
                  {parkLocations.map((park) => {
                    const pos = getPosition(park.lat, park.lng);
                    return (
                      <div
                        key={park.id}
                        className="absolute transition-all duration-200"
                        style={{ 
                          left: `${pos.x}%`, 
                          top: `${pos.y}%`,
                          transform: `scale(${1/zoom})`
                        }}
                      >
                        <div className="relative group">
                          <div className={`rounded-full bg-emerald-500/40 border-2 border-emerald-400/80 transition-all ${
                            zoom >= ZOOM_LEVELS.regional ? 'w-4 h-4' : 'w-3 h-3'
                          }`}>
                            {zoom >= ZOOM_LEVELS.detailed && (
                              <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
                            )}
                          </div>
                          <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-opacity ${
                            zoom >= ZOOM_LEVELS.regional ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`}>
                            <span className="text-[10px] text-emerald-400 whitespace-nowrap bg-background/90 px-2 py-0.5 rounded font-medium">
                              {park.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Historical threats from playback */}
                  <AnimatePresence>
                    {showPlayback && playbackThreats.map((threat) => {
                      const pos = getPosition(threat.location.lat, threat.location.lng);
                      return (
                        <motion.div
                          key={threat.id}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute z-20"
                          style={{ 
                            left: `${pos.x}%`, 
                            top: `${pos.y}%`,
                            transform: `translate(-50%, -50%) scale(${1/zoom})`
                          }}
                        >
                          <div className={`w-8 h-8 rounded-full ${getThreatColor(threat.type)} flex items-center justify-center animate-pulse`}>
                            {threat.type === 'poaching' && <Shield className="h-4 w-4" />}
                            {threat.type === 'fire' && <Flame className="h-4 w-4" />}
                            {threat.type === 'wildlife_conflict' && <AlertTriangle className="h-4 w-4" />}
                            {threat.type === 'drought' && <AlertTriangle className="h-4 w-4" />}
                            {threat.type === 'intrusion' && <AlertTriangle className="h-4 w-4" />}
                          </div>
                          <div className="absolute left-10 top-0 bg-background/95 backdrop-blur rounded px-2 py-1 text-[10px] min-w-32 border border-border/50">
                            <div className="font-bold text-red-400">{threat.severity.toUpperCase()}</div>
                            <div className="text-muted-foreground">{threat.description}</div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

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

                  {isLayerEnabled('animals') && showDetailedAnimals && (
                    <AnimalTrackingLayer
                      animals={animalTracking}
                      mapBounds={KENYA_BOUNDS}
                      onSelect={(animal) => setSelectedItem({ type: 'animal', data: animal })}
                    />
                  )}

                  {isLayerEnabled('drones') && zoom >= ZOOM_LEVELS.regional && (
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

                  {/* IoT Sensors */}
                  {isLayerEnabled('sensors') && showSensors && (
                    <div className="absolute inset-0 pointer-events-none">
                      {mockSensors.slice(0, 20).map((sensor, idx) => {
                        const park = parkLocations[idx % parkLocations.length];
                        const offsetLat = (Math.random() - 0.5) * 0.5;
                        const offsetLng = (Math.random() - 0.5) * 0.5;
                        const pos = getPosition(park.lat + offsetLat, park.lng + offsetLng);
                        
                        return (
                          <motion.div
                            key={sensor.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1 / zoom, opacity: 1 }}
                            className="absolute pointer-events-auto cursor-pointer"
                            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                          >
                            <div className={`w-2 h-2 rounded-full ${
                              sensor.status === 'online' ? 'bg-cyan-400' :
                              sensor.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                            }`}>
                              <div className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping" style={{ animationDuration: '2s' }} />
                            </div>
                            {showLabels && (
                              <span className="absolute left-3 top-0 text-[8px] text-cyan-300 whitespace-nowrap bg-background/80 px-1 rounded">
                                {sensor.name}
                              </span>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                  {/* Locked Points */}
                  <AnimatePresence>
                    {lockedPoints.map((point, index) => {
                      const pos = getPosition(point.lat, point.lng);
                      const distance = calculateDistance(gpsCoords.lat, gpsCoords.lng, point.lat, point.lng);
                      const bearing = calculateBearing(gpsCoords.lat, gpsCoords.lng, point.lat, point.lng);
                      
                      return (
                        <LockedPointMarker
                          key={`locked-${index}`}
                          point={point}
                          position={pos}
                          distance={distance}
                          bearing={bearing}
                          zoom={zoom}
                          onRemove={() => removeLockedPoint(index)}
                        />
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* Crosshair overlay - fixed position */}
                {showCrosshair && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute w-16 h-px bg-cyan-400/60 -translate-x-1/2 left-1/2" />
                      <div className="absolute h-16 w-px bg-cyan-400/60 -translate-y-1/2 top-1/2" />
                      <div className="w-6 h-6 rounded-full border-2 border-cyan-400/80 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      </div>
                      <div className="absolute -top-4 -left-4 w-3 h-3 border-t-2 border-l-2 border-cyan-400/60" />
                      <div className="absolute -top-4 -right-4 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60" />
                      <div className="absolute -bottom-4 -left-4 w-3 h-3 border-b-2 border-l-2 border-cyan-400/60" />
                      <div className="absolute -bottom-4 -right-4 w-3 h-3 border-b-2 border-r-2 border-cyan-400/60" />
                    </div>
                  </div>
                )}

                {/* Real-time GPS coordinate display */}
                <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur rounded-lg border border-cyan-500/30 p-3 font-mono text-xs space-y-1">
                  <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-2">
                    <Target className="h-4 w-4" />
                    GPS TRACKING
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <span className="text-muted-foreground">LAT:</span>
                    <span className="text-cyan-300">{gpsCoords.lat.toFixed(6)}°</span>
                    <span className="text-muted-foreground">LNG:</span>
                    <span className="text-cyan-300">{gpsCoords.lng.toFixed(6)}°</span>
                    <span className="text-muted-foreground">ZOOM:</span>
                    <span className="text-green-400">{zoom.toFixed(2)}x</span>
                    <span className="text-muted-foreground">MODE:</span>
                    <span className="text-amber-400">{isPanning ? 'PAN' : 'TARGET'}</span>
                  </div>
                  
                  {/* Distance to nearest locked point */}
                  {lockedPoints.length > 0 && (
                    <div className="pt-2 border-t border-border/50 mt-2">
                      <div className="text-muted-foreground mb-1">Nearest Locked Point:</div>
                      {(() => {
                        const distances = lockedPoints.map((p, i) => ({
                          index: i,
                          distance: calculateDistance(gpsCoords.lat, gpsCoords.lng, p.lat, p.lng),
                          bearing: calculateBearing(gpsCoords.lat, gpsCoords.lng, p.lat, p.lng)
                        }));
                        const nearest = distances.reduce((min, d) => d.distance < min.distance ? d : min);
                        return (
                          <div className="flex justify-between items-center">
                            <span className="text-amber-400">{nearest.distance.toFixed(2)} km</span>
                            <span className="text-cyan-400 flex items-center gap-1">
                              <Navigation className="h-3 w-3" style={{ transform: `rotate(${nearest.bearing}deg)` }} />
                              {nearest.bearing.toFixed(0)}°
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                  
                  <div className="pt-2 border-t border-border/50 mt-2 space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full h-7 text-[10px]"
                      onClick={() => setShowCrosshair(!showCrosshair)}
                    >
                      <Crosshair className="h-3 w-3 mr-1" />
                      {showCrosshair ? 'Hide' : 'Show'} Crosshair
                    </Button>
                    <Button
                      variant={isPanning ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full h-7 text-[10px]"
                      onClick={() => setIsPanning(!isPanning)}
                    >
                      <Move className="h-3 w-3 mr-1" />
                      {isPanning ? 'Disable' : 'Enable'} Pan Mode
                    </Button>
                    {lockedPoints.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full h-7 text-[10px] text-red-400"
                        onClick={() => setLockedPoints([])}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Clear All Points
                      </Button>
                    )}
                  </div>
                </div>

                {/* Zoom controls */}
                <div className="absolute right-4 top-4 flex flex-col gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 bg-background/80"
                    onClick={() => setZoom(Math.min(ZOOM_LEVELS.maximum, zoom + 0.25))}
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
                    onClick={() => { setZoom(1); setPanOffset({ x: 0, y: 0 }); }}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                  <div className="bg-background/80 rounded-lg px-2 py-3 flex flex-col items-center gap-1">
                    {Object.entries(ZOOM_LEVELS).map(([key, value]) => (
                      <div
                        key={key}
                        className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
                          zoom >= value ? 'bg-cyan-400' : 'bg-muted'
                        }`}
                        title={key}
                        onClick={() => setZoom(value)}
                      />
                    ))}
                  </div>
                </div>

                {/* Stats overlay */}
                <div className="absolute left-4 bottom-4 flex gap-2 flex-wrap max-w-md">
                  <div className="bg-background/80 backdrop-blur rounded-lg px-3 py-2 flex items-center gap-2">
                    <Radio className="h-4 w-4 text-green-400" />
                    <span className="text-xs">{animalTracking.length} Animals</span>
                    {!showDetailedAnimals && <Badge variant="outline" className="text-[8px] h-4">Zoom to view</Badge>}
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
                  {showSensors && (
                    <div className="bg-background/80 backdrop-blur rounded-lg px-3 py-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-cyan-400" />
                      <span className="text-xs">{mockSensors.length} Sensors</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Right sidebar */}
          <div className="w-72 flex flex-col gap-4 overflow-y-auto">
            <LiveMapLayers layers={layers} onToggle={toggleLayer} />

            {/* Threat Playback Toggle */}
            <Card className="bg-card/90 backdrop-blur border-border/50">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-400" />
                    Historical Playback
                  </span>
                  <Button
                    variant={showPlayback ? "secondary" : "outline"}
                    size="sm"
                    className="h-6 text-[10px]"
                    onClick={() => setShowPlayback(!showPlayback)}
                  >
                    {showPlayback ? 'Hide' : 'Show'}
                  </Button>
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Threat Playback Controls */}
            {showPlayback && (
              <ThreatPlayback
                onThreatUpdate={handleThreatUpdate}
                mapBounds={KENYA_BOUNDS}
              />
            )}

            {/* Zoom Level Guide */}
            <Card className="bg-card/90 backdrop-blur border-border/50">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ZoomIn className="h-4 w-4" />
                  Zoom Levels
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-2 text-xs">
                {Object.entries(ZOOM_LEVELS).map(([key, value]) => (
                  <div 
                    key={key}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-muted/30 ${
                      zoom >= value ? 'bg-cyan-500/20 text-cyan-400' : 'bg-muted/20 text-muted-foreground'
                    }`}
                    onClick={() => setZoom(value)}
                  >
                    <span className="capitalize">{key}</span>
                    <span className="font-mono">{value.toFixed(2)}x</span>
                  </div>
                ))}
              </CardContent>
            </Card>

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
                          <p className="font-mono text-xs text-cyan-400 mt-2">
                            GPS: {selectedItem.data.location.lat.toFixed(4)}°, {selectedItem.data.location.lng.toFixed(4)}°
                          </p>
                        </>
                      )}
                      {selectedItem.type === 'drone' && (
                        <>
                          <p><strong>Name:</strong> {selectedItem.data.name}</p>
                          <p><strong>Status:</strong> {selectedItem.data.status}</p>
                          <p><strong>Mission:</strong> {selectedItem.data.mission}</p>
                          <p><strong>Altitude:</strong> {selectedItem.data.altitude}m</p>
                          <p><strong>Battery:</strong> {selectedItem.data.battery}%</p>
                          <p className="font-mono text-xs text-cyan-400 mt-2">
                            GPS: {selectedItem.data.location.lat.toFixed(4)}°, {selectedItem.data.location.lng.toFixed(4)}°
                          </p>
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
