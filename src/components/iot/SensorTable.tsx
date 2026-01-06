import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Radio, 
  Flame, 
  Activity, 
  AlertTriangle, 
  Thermometer,
  Battery,
  Signal,
  Wifi,
  WifiOff,
  Search,
  Filter
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IoTSensor } from '@/types/iot';
import { formatDistanceToNow } from 'date-fns';

interface SensorTableProps {
  sensors: IoTSensor[];
  selectedPark: string | null;
}

export function SensorTable({ sensors, selectedPark }: SensorTableProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getSensorIcon = (type: IoTSensor['type']) => {
    switch (type) {
      case 'animal_collar': return <Radio className="w-4 h-4" />;
      case 'fire_sensor': return <Flame className="w-4 h-4" />;
      case 'smoke_detector': return <Activity className="w-4 h-4" />;
      case 'motion_sensor': return <AlertTriangle className="w-4 h-4" />;
      case 'weather_station': return <Thermometer className="w-4 h-4" />;
      default: return <Wifi className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: IoTSensor['status']) => {
    switch (status) {
      case 'online': return 'bg-emerald-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-muted';
    }
  };

  const getStatusBadge = (status: IoTSensor['status']) => {
    switch (status) {
      case 'online': return <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30">Online</Badge>;
      case 'warning': return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Warning</Badge>;
      case 'critical': return <Badge variant="destructive">Critical</Badge>;
      default: return <Badge variant="secondary">Offline</Badge>;
    }
  };

  const filteredSensors = sensors.filter(sensor => {
    const matchesSearch = sensor.name.toLowerCase().includes(search.toLowerCase()) ||
                         sensor.id.toLowerCase().includes(search.toLowerCase());
    const matchesPark = !selectedPark || sensor.parkId === selectedPark;
    const matchesType = typeFilter === 'all' || sensor.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || sensor.status === statusFilter;
    
    return matchesSearch && matchesPark && matchesType && matchesStatus;
  });

  const sensorTypes = [...new Set(sensors.map(s => s.type))];

  return (
    <Card className="bg-card/50 backdrop-blur border-primary/20">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground">Sensor Network</h3>
          </div>
          <Badge variant="outline">
            {filteredSensors.length} / {sensors.length} sensors
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search sensors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-muted/50"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px] bg-muted/50">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {sensorTypes.map(type => (
                <SelectItem key={type} value={type} className="capitalize">
                  {type.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px] bg-muted/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="p-4 space-y-3">
          {filteredSensors.map((sensor, index) => (
            <motion.div
              key={sensor.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(sensor.status)} text-white`}>
                    {getSensorIcon(sensor.type)}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{sensor.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      ID: {sensor.id} • {sensor.parkId.replace('-', ' ')}
                    </p>
                  </div>
                </div>
                {getStatusBadge(sensor.status)}
              </div>

              <div className="mt-4 grid grid-cols-4 gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Battery className="w-3 h-3" />
                    Battery
                  </div>
                  <Progress 
                    value={sensor.batteryLevel} 
                    className={`h-1.5 ${sensor.batteryLevel < 20 ? '[&>div]:bg-red-500' : sensor.batteryLevel < 50 ? '[&>div]:bg-yellow-500' : ''}`}
                  />
                  <span className="text-xs font-medium">{sensor.batteryLevel}%</span>
                </div>
                
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Signal className="w-3 h-3" />
                    Signal
                  </div>
                  <Progress value={sensor.signalStrength} className="h-1.5" />
                  <span className="text-xs font-medium">{sensor.signalStrength}%</span>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Last Ping</p>
                  <p className="text-xs font-medium">
                    {formatDistanceToNow(new Date(sensor.lastPing), { addSuffix: true })}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-xs font-medium">
                    {sensor.location.lat.toFixed(3)}, {sensor.location.lng.toFixed(3)}
                  </p>
                </div>
              </div>

              {/* Sensor-specific data */}
              <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-4 text-xs">
                {sensor.data.temperature !== undefined && (
                  <div className="flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-orange-500" />
                    <span>{sensor.data.temperature}°C</span>
                  </div>
                )}
                {sensor.data.humidity !== undefined && (
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-blue-500" />
                    <span>{sensor.data.humidity}% RH</span>
                  </div>
                )}
                {sensor.data.heartRate !== undefined && (
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-red-500" />
                    <span>{sensor.data.heartRate} bpm</span>
                  </div>
                )}
                {sensor.data.speed !== undefined && (
                  <div className="flex items-center gap-1">
                    <Radio className="w-3 h-3 text-primary" />
                    <span>{sensor.data.speed} km/h</span>
                  </div>
                )}
                {sensor.data.fireRisk && (
                  <Badge 
                    variant="outline" 
                    className={`capitalize ${
                      sensor.data.fireRisk === 'extreme' ? 'text-red-500 border-red-500/30' :
                      sensor.data.fireRisk === 'high' ? 'text-orange-500 border-orange-500/30' :
                      sensor.data.fireRisk === 'moderate' ? 'text-yellow-500 border-yellow-500/30' :
                      'text-green-500 border-green-500/30'
                    }`}
                  >
                    <Flame className="w-3 h-3 mr-1" />
                    {sensor.data.fireRisk} risk
                  </Badge>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
