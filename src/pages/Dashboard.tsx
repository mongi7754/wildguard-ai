import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Radar, 
  AlertTriangle, 
  Plane, 
  Users, 
  Scan,
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  TrendingUp,
  ChevronRight,
  Activity
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { AlertCard } from '@/components/alerts/AlertCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockAlerts, mockEnvironment, dashboardStats } from '@/data/mockData';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const criticalAlerts = mockAlerts.filter(a => a.status === 'active');
  
  return (
    <AppLayout>
      <div className="px-4 py-4 space-y-6">
        {/* Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-forest-dark via-forest to-forest-light p-4 border border-primary/30"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs font-medium text-primary">SYSTEM ACTIVE</span>
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">
              Serengeti Reserve
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {dashboardStats.areaMonitored.toLocaleString()} km² monitored • Last sync: 2 min ago
            </p>
          </div>
          <div className="absolute bottom-2 right-4 opacity-10">
            <Radar className="w-24 h-24 text-primary animate-spin" style={{ animationDuration: '10s' }} />
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-3"
        >
          <motion.div variants={item}>
            <StatCard
              icon={Radar}
              label="Wildlife Detected"
              value={dashboardStats.totalWildlife}
              trend={{ value: 12, isPositive: true }}
              variant="primary"
            />
          </motion.div>
          <motion.div variants={item}>
            <StatCard
              icon={AlertTriangle}
              label="Active Alerts"
              value={dashboardStats.activeAlerts}
              variant="danger"
            />
          </motion.div>
          <motion.div variants={item}>
            <StatCard
              icon={Plane}
              label="Drones Active"
              value={dashboardStats.dronesActive}
              variant="primary"
            />
          </motion.div>
          <motion.div variants={item}>
            <StatCard
              icon={Users}
              label="Rangers On-Duty"
              value={dashboardStats.rangersOnDuty}
            />
          </motion.div>
        </motion.div>

        {/* Environment Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="tactical">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Environment Status</CardTitle>
                <Badge 
                  variant={mockEnvironment.fireRisk === 'low' ? 'success' : 
                          mockEnvironment.fireRisk === 'moderate' ? 'warning' : 'danger'}
                >
                  Fire Risk: {mockEnvironment.fireRisk}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center p-2 rounded-lg bg-secondary/50">
                  <Thermometer className="w-4 h-4 mx-auto text-accent mb-1" />
                  <p className="text-lg font-bold">{mockEnvironment.temperature}°</p>
                  <p className="text-[10px] text-muted-foreground">Temp</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-secondary/50">
                  <Droplets className="w-4 h-4 mx-auto text-blue-400 mb-1" />
                  <p className="text-lg font-bold">{mockEnvironment.humidity}%</p>
                  <p className="text-[10px] text-muted-foreground">Humidity</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-secondary/50">
                  <Wind className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-lg font-bold">{mockEnvironment.windSpeed}</p>
                  <p className="text-[10px] text-muted-foreground">km/h</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-secondary/50">
                  <Activity className="w-4 h-4 mx-auto text-primary mb-1" />
                  <p className="text-lg font-bold">{mockEnvironment.airQuality}</p>
                  <p className="text-[10px] text-muted-foreground">AQI</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Critical Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold text-sm">Active Alerts</h3>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/alerts" className="text-xs">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="space-y-3">
            {criticalAlerts.slice(0, 3).map((alert) => (
              <AlertCard key={alert.id} alert={alert} compact />
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-display font-semibold text-sm mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="tactical" size="lg" className="h-auto py-4 flex-col" asChild>
              <Link to="/detect">
                <Scan className="w-6 h-6 mb-2" />
                <span className="text-xs">AI Detection</span>
              </Link>
            </Button>
            <Button variant="tactical" size="lg" className="h-auto py-4 flex-col" asChild>
              <Link to="/map">
                <MapPin className="w-6 h-6 mb-2" />
                <span className="text-xs">Live Map</span>
              </Link>
            </Button>
            <Button variant="tactical" size="lg" className="h-auto py-4 flex-col" asChild>
              <Link to="/drone">
                <Plane className="w-6 h-6 mb-2" />
                <span className="text-xs">Drone Control</span>
              </Link>
            </Button>
            <Button variant="tactical" size="lg" className="h-auto py-4 flex-col" asChild>
              <Link to="/analytics">
                <TrendingUp className="w-6 h-6 mb-2" />
                <span className="text-xs">Analytics</span>
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
