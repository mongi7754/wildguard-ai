import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Command, Satellite, Shield, Brain, AlertTriangle, Plane,
  Users, Flame, MapPin, Activity, Radio, Eye, Target,
  TrendingUp, DollarSign, FileText, Mic, Volume2, RefreshCw,
  ChevronRight, Zap, Clock, CheckCircle, XCircle, Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { realKenyaParks } from '@/data/kenyaParksRealData';
import { generateDronePatrols } from '@/data/dronePatrolData';
import { generateParkWeatherData } from '@/data/weatherData';

interface SystemAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  module: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

interface ModuleStatus {
  id: string;
  name: string;
  icon: any;
  status: 'online' | 'degraded' | 'offline';
  lastUpdate: Date;
  metrics: { label: string; value: string | number }[];
  route: string;
}

const generateSystemAlerts = (): SystemAlert[] => [
  { id: 'alert-1', type: 'critical', module: 'Threat Detection', message: 'Poaching activity detected in Masai Mara - Zone C', timestamp: new Date(Date.now() - 120000), acknowledged: false },
  { id: 'alert-2', type: 'warning', module: 'Fire Detection', message: 'Elevated fire risk in Tsavo East - Dry vegetation', timestamp: new Date(Date.now() - 600000), acknowledged: false },
  { id: 'alert-3', type: 'warning', module: 'Drone Fleet', message: 'Eagle-1 battery below 20% - RTB recommended', timestamp: new Date(Date.now() - 900000), acknowledged: true },
  { id: 'alert-4', type: 'info', module: 'Wildlife Registry', message: 'New elephant sighting registered - ID pending', timestamp: new Date(Date.now() - 1800000), acknowledged: true },
  { id: 'alert-5', type: 'critical', module: 'Ranger Dispatch', message: 'Team Alpha requires backup - Active pursuit', timestamp: new Date(Date.now() - 60000), acknowledged: false }
];

export default function KWSCommandCenterPage() {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<SystemAlert[]>(() => generateSystemAlerts());
  const [isGeneratingBriefing, setIsGeneratingBriefing] = useState(false);
  const [briefing, setBriefing] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  
  const dronePatrols = useMemo(() => generateDronePatrols(), []);
  const weatherData = useMemo(() => generateParkWeatherData(), []);

  const moduleStatuses: ModuleStatus[] = useMemo(() => [
    {
      id: 'satellite',
      name: 'Satellite Network',
      icon: Satellite,
      status: 'online',
      lastUpdate: new Date(Date.now() - 30000),
      metrics: [
        { label: 'Connected', value: '4/4' },
        { label: 'Coverage', value: '98.5%' }
      ],
      route: '/satellite-map'
    },
    {
      id: 'drones',
      name: 'Drone Fleet',
      icon: Plane,
      status: 'online',
      lastUpdate: new Date(Date.now() - 45000),
      metrics: [
        { label: 'Active', value: dronePatrols.filter(d => d.status === 'active').length },
        { label: 'Coverage', value: `${dronePatrols.reduce((sum, d) => sum + d.coverageRadius, 0)}km²` }
      ],
      route: '/drone'
    },
    {
      id: 'rangers',
      name: 'Ranger Dispatch',
      icon: Users,
      status: 'online',
      lastUpdate: new Date(Date.now() - 60000),
      metrics: [
        { label: 'Teams Active', value: 4 },
        { label: 'Rangers', value: 29 }
      ],
      route: '/dispatch'
    },
    {
      id: 'threats',
      name: 'Threat Prediction',
      icon: Target,
      status: 'online',
      lastUpdate: new Date(Date.now() - 120000),
      metrics: [
        { label: 'Active Threats', value: 3 },
        { label: 'AI Confidence', value: '94%' }
      ],
      route: '/predictions'
    },
    {
      id: 'fire',
      name: 'Fire Detection',
      icon: Flame,
      status: 'degraded',
      lastUpdate: new Date(Date.now() - 180000),
      metrics: [
        { label: 'Sensors', value: '42/45' },
        { label: 'Risk Level', value: 'Moderate' }
      ],
      route: '/fire-detection'
    },
    {
      id: 'wildlife',
      name: 'Wildlife Registry',
      icon: Eye,
      status: 'online',
      lastUpdate: new Date(Date.now() - 90000),
      metrics: [
        { label: 'Tracked', value: '12,547' },
        { label: 'New Today', value: 23 }
      ],
      route: '/registry'
    },
    {
      id: 'insurance',
      name: 'Insurance Engine',
      icon: Shield,
      status: 'online',
      lastUpdate: new Date(Date.now() - 300000),
      metrics: [
        { label: 'Policies', value: 14 },
        { label: 'Coverage', value: '$45M' }
      ],
      route: '/insurance'
    },
    {
      id: 'revenue',
      name: 'Revenue Intelligence',
      icon: DollarSign,
      status: 'online',
      lastUpdate: new Date(Date.now() - 240000),
      metrics: [
        { label: 'Today', value: 'KES 2.4M' },
        { label: 'Trend', value: '+12%' }
      ],
      route: '/revenue'
    }
  ], [dronePatrols]);

  const stats = useMemo(() => ({
    totalParks: realKenyaParks.length,
    totalWildlife: realKenyaParks.reduce((sum, p) => sum + p.wildlife, 0),
    totalSensors: realKenyaParks.reduce((sum, p) => sum + p.sensors, 0),
    activeDrones: dronePatrols.filter(d => d.status === 'active').length,
    criticalAlerts: alerts.filter(a => a.type === 'critical' && !a.acknowledged).length,
    avgFireRisk: Math.round(weatherData.reduce((sum, w) => sum + w.fireRiskIndex, 0) / weatherData.length)
  }), [alerts, dronePatrols, weatherData]);

  const handleAcknowledge = (alertId: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, acknowledged: true } : a
    ));
    toast({ title: "Alert Acknowledged" });
  };

  const generateExecutiveBriefing = async () => {
    setIsGeneratingBriefing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-voice-of-parks', {
        body: {
          action: 'briefing',
          parkData: {
            parks: realKenyaParks.slice(0, 5).map(p => ({
              name: p.name,
              wildlife: p.wildlife,
              alerts: Math.floor(Math.random() * 5)
            })),
            weather: weatherData.slice(0, 3),
            drones: dronePatrols.filter(d => d.status === 'active').length,
            criticalAlerts: stats.criticalAlerts
          }
        }
      });

      if (error) throw error;
      
      const briefingText = data?.response || data?.briefing || 
        `EXECUTIVE BRIEFING - ${new Date().toLocaleDateString()}

SYSTEM STATUS: All ${stats.totalParks} parks under active surveillance. ${stats.activeDrones} drones patrolling. ${stats.totalSensors} sensors online.

THREAT LEVEL: ${stats.criticalAlerts} critical alerts requiring immediate attention. Average fire risk index at ${stats.avgFireRisk}%.

WILDLIFE: ${stats.totalWildlife.toLocaleString()} animals under protection. Biometric registry updating in real-time.

PRIORITY ACTIONS:
1. Deploy additional ranger coverage to Masai Mara Zone C
2. Monitor fire conditions in Tsavo East
3. Review pending insurance claims

END BRIEFING`;

      setBriefing(briefingText);
      toast({ title: "Briefing Generated", description: "Executive summary ready for review" });
    } catch (error) {
      console.error('Briefing error:', error);
      toast({
        title: "Briefing Failed",
        description: error instanceof Error ? error.message : "Could not generate briefing",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingBriefing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400 bg-green-500/20 border-green-500/50';
      case 'degraded': return 'text-amber-400 bg-amber-500/20 border-amber-500/50';
      case 'offline': return 'text-red-400 bg-red-500/20 border-red-500/50';
      default: return 'text-muted-foreground bg-muted/20';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'warning': return 'text-amber-400 bg-amber-500/20 border-amber-500/50';
      case 'info': return 'text-blue-400 bg-blue-500/20 border-blue-500/50';
      default: return 'text-muted-foreground bg-muted/20';
    }
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
              <Command className="h-7 w-7 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                KWS National Command Center
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <Activity className="h-3 w-3 mr-1 animate-pulse" />
                  OPERATIONAL
                </Badge>
              </h1>
              <p className="text-sm text-muted-foreground">
                Unified wildlife governance and intelligence platform
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              Last refresh: {lastRefresh.toLocaleTimeString()}
            </span>
            <Button variant="outline" size="sm" onClick={() => setLastRefresh(new Date())}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="bg-card/50 backdrop-blur border-cyan-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-cyan-400 mb-1">
                <MapPin className="h-4 w-4" />
                <span className="text-xs">Parks Monitored</span>
              </div>
              <div className="text-2xl font-bold">{stats.totalParks}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-green-400 mb-1">
                <Eye className="h-4 w-4" />
                <span className="text-xs">Wildlife Protected</span>
              </div>
              <div className="text-2xl font-bold">{(stats.totalWildlife / 1000).toFixed(1)}K</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <Radio className="h-4 w-4" />
                <span className="text-xs">Sensors Active</span>
              </div>
              <div className="text-2xl font-bold">{stats.totalSensors}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-blue-400 mb-1">
                <Plane className="h-4 w-4" />
                <span className="text-xs">Drones Active</span>
              </div>
              <div className="text-2xl font-bold">{stats.activeDrones}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur border-red-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-400 mb-1">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-xs">Critical Alerts</span>
              </div>
              <div className="text-2xl font-bold">{stats.criticalAlerts}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur border-orange-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-orange-400 mb-1">
                <Flame className="h-4 w-4" />
                <span className="text-xs">Fire Risk Index</span>
              </div>
              <div className="text-2xl font-bold">{stats.avgFireRisk}%</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Module Status Grid */}
          <div className="lg:col-span-2">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader className="py-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-cyan-400" />
                  System Modules
                </CardTitle>
                <CardDescription>
                  Real-time status of all KWS governance modules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {moduleStatuses.map((module) => (
                    <Link key={module.id} to={module.route}>
                      <motion.div
                        className="p-4 rounded-lg bg-muted/20 border border-border/50 hover:bg-muted/40 transition-all cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className={`p-2 rounded-lg ${getStatusColor(module.status)}`}>
                            <module.icon className="h-4 w-4" />
                          </div>
                          <Badge variant="outline" className={`text-[9px] ${getStatusColor(module.status)}`}>
                            {module.status}
                          </Badge>
                        </div>
                        <div className="font-medium text-sm mb-2">{module.name}</div>
                        <div className="space-y-1">
                          {module.metrics.map((metric, i) => (
                            <div key={i} className="flex justify-between text-xs">
                              <span className="text-muted-foreground">{metric.label}</span>
                              <span className="font-medium">{metric.value}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-Time Alerts */}
          <div className="space-y-4">
            <Card className="bg-card/50 backdrop-blur border-red-500/20">
              <CardHeader className="py-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Bell className="h-4 w-4 text-red-400" />
                  Real-Time Alerts
                  {stats.criticalAlerts > 0 && (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                      {stats.criticalAlerts} unread
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {alerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        className={`p-3 rounded-lg border ${getAlertColor(alert.type)} ${
                          alert.acknowledged ? 'opacity-60' : ''
                        }`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <Badge variant="outline" className={`text-[9px] ${getAlertColor(alert.type)}`}>
                            {alert.type.toUpperCase()}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            {alert.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-xs font-medium mb-1">{alert.module}</div>
                        <div className="text-xs text-muted-foreground mb-2">{alert.message}</div>
                        {!alert.acknowledged && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 text-xs w-full"
                            onClick={() => handleAcknowledge(alert.id)}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Acknowledge
                          </Button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Executive Briefing */}
        <Card className="bg-card/50 backdrop-blur border-purple-500/20">
          <CardHeader className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  AI Executive Briefing
                </CardTitle>
                <CardDescription>
                  AI-generated situational summary for leadership review
                </CardDescription>
              </div>
              <Button onClick={generateExecutiveBriefing} disabled={isGeneratingBriefing}>
                {isGeneratingBriefing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    Generate Briefing
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {briefing ? (
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <pre className="whitespace-pre-wrap text-sm font-mono">{briefing}</pre>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    <Volume2 className="h-4 w-4 mr-2" />
                    Read Aloud
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-lg bg-muted/20 border border-dashed border-border/50 text-center">
                <Brain className="h-12 w-12 mx-auto text-purple-400/50 mb-4" />
                <p className="text-muted-foreground">
                  Click "Generate Briefing" for an AI-powered executive summary
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/satellite-map">
            <Button variant="outline" className="w-full h-16 flex-col gap-1">
              <Satellite className="h-5 w-5" />
              <span className="text-xs">Live Map</span>
            </Button>
          </Link>
          <Link to="/dispatch">
            <Button variant="outline" className="w-full h-16 flex-col gap-1">
              <Users className="h-5 w-5" />
              <span className="text-xs">Ranger Dispatch</span>
            </Button>
          </Link>
          <Link to="/ai-voice">
            <Button variant="outline" className="w-full h-16 flex-col gap-1">
              <Mic className="h-5 w-5" />
              <span className="text-xs">Voice of Parks</span>
            </Button>
          </Link>
          <Link to="/forensics">
            <Button variant="outline" className="w-full h-16 flex-col gap-1">
              <FileText className="h-5 w-5" />
              <span className="text-xs">Forensic Evidence</span>
            </Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
