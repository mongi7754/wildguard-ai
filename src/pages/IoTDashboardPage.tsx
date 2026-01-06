import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Satellite, 
  Radio, 
  RefreshCw,
  Bell,
  Settings,
  Maximize2
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { KenyaInteractiveMap } from '@/components/iot/KenyaInteractiveMap';
import { SatelliteStatus } from '@/components/iot/SatelliteStatus';
import { IoTAlertPanel } from '@/components/iot/IoTAlertPanel';
import { SensorTable } from '@/components/iot/SensorTable';
import { IoTMetricsCards } from '@/components/iot/IoTMetricsCards';
import { 
  mockSensors, 
  mockSatelliteConnections, 
  mockIoTAlerts, 
  mockParkIoTStatus 
} from '@/data/iotMockData';
import { IoTAlert } from '@/types/iot';
import { toast } from 'sonner';

export default function IoTDashboardPage() {
  const [selectedPark, setSelectedPark] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<IoTAlert[]>(mockIoTAlerts);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastUpdate(new Date());
    setIsRefreshing(false);
    toast.success('Sensor data refreshed');
  };

  const handleAcknowledge = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
    toast.success('Alert acknowledged');
  };

  const handleParkSelect = (parkId: string) => {
    setSelectedPark(selectedPark === parkId ? null : parkId);
  };

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged).length;

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="p-6 space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                <Satellite className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Satellite IoT Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Real-time sensor monitoring across Kenya's national parks
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right mr-4">
                <p className="text-xs text-muted-foreground">Last updated</p>
                <p className="text-sm font-medium">{lastUpdate.toLocaleTimeString()}</p>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>

              <Button variant="outline" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                {unacknowledgedAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center">
                    {unacknowledgedAlerts}
                  </span>
                )}
              </Button>

              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>

          {/* Metrics Overview */}
          <IoTMetricsCards 
            sensors={mockSensors}
            connections={mockSatelliteConnections}
            alerts={alerts}
            parkStatus={mockParkIoTStatus}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map - Takes 2 columns */}
            <div className="lg:col-span-2">
              <KenyaInteractiveMap 
                parkStatus={mockParkIoTStatus}
                sensors={mockSensors}
                onParkSelect={handleParkSelect}
                selectedPark={selectedPark}
              />
            </div>

            {/* Alerts Panel */}
            <div className="lg:col-span-1">
              <IoTAlertPanel 
                alerts={alerts}
                onAcknowledge={handleAcknowledge}
              />
            </div>
          </div>

          {/* Satellite Status & Sensor Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SatelliteStatus connections={mockSatelliteConnections} />
            <SensorTable 
              sensors={mockSensors} 
              selectedPark={selectedPark}
            />
          </div>

          {/* Selected Park Info */}
          {selectedPark && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-primary/5 border border-primary/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Radio className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-semibold capitalize">
                      {selectedPark.replace('-', ' ')} National Park
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Showing {mockSensors.filter(s => s.parkId === selectedPark).length} sensors in this area
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedPark(null)}
                >
                  Clear Selection
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
