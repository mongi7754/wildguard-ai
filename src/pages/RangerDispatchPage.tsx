import { useState, useEffect, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, MapPin, AlertTriangle, Target, Brain, RefreshCw,
  Navigation, Radio, Shield, Clock, CheckCircle, XCircle,
  Plane, Activity, ArrowRight, Eye, Zap, Send, Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { generateDronePatrols, DronePatrolRoute } from '@/data/dronePatrolData';
import { realKenyaParks } from '@/data/kenyaParksRealData';

interface RangerTeam {
  id: string;
  name: string;
  members: number;
  status: 'patrol' | 'standby' | 'responding' | 'off-duty';
  location: { lat: number; lng: number };
  currentMission?: string;
  responseTime: number;
  equipment: string[];
  lastContact: Date;
  batteryLevel: number;
}

interface DispatchRecommendation {
  id: string;
  threatType: string;
  threatLocation: { lat: number; lng: number };
  severity: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  recommendedTeam: string;
  estimatedResponseTime: string;
  rationale: string;
  actions: Array<{
    action: string;
    priority: number;
    target: string;
  }>;
  droneSupport: string[];
  status: 'pending' | 'dispatched' | 'acknowledged' | 'completed';
  createdAt: Date;
}

// Generate mock ranger teams
const generateRangerTeams = (): RangerTeam[] => [
  {
    id: 'team-alpha',
    name: 'Alpha Squad',
    members: 6,
    status: 'patrol',
    location: { lat: -1.4061, lng: 35.1058 },
    currentMission: 'Perimeter patrol - Masai Mara',
    responseTime: 8,
    equipment: ['Night Vision', 'Tranquilizers', 'GPS Trackers', 'Radio'],
    lastContact: new Date(Date.now() - 300000),
    batteryLevel: 85
  },
  {
    id: 'team-bravo',
    name: 'Bravo Unit',
    members: 4,
    status: 'standby',
    location: { lat: -3.3872, lng: 38.5627 },
    responseTime: 5,
    equipment: ['Thermal Cameras', 'First Aid', 'Radio'],
    lastContact: new Date(Date.now() - 180000),
    batteryLevel: 92
  },
  {
    id: 'team-charlie',
    name: 'Charlie Response',
    members: 8,
    status: 'responding',
    location: { lat: -0.1521, lng: 37.3084 },
    currentMission: 'Responding to poaching alert - Mt Kenya',
    responseTime: 12,
    equipment: ['Armed Response', 'Medical Kit', 'Drones', 'K9 Unit'],
    lastContact: new Date(Date.now() - 60000),
    batteryLevel: 67
  },
  {
    id: 'team-delta',
    name: 'Delta Recon',
    members: 5,
    status: 'patrol',
    location: { lat: 0.6012, lng: 37.5567 },
    currentMission: 'Wildlife monitoring - Samburu',
    responseTime: 10,
    equipment: ['Binoculars', 'Camera Traps', 'Radio', 'GPS'],
    lastContact: new Date(Date.now() - 420000),
    batteryLevel: 78
  },
  {
    id: 'team-echo',
    name: 'Echo Patrol',
    members: 6,
    status: 'off-duty',
    location: { lat: -4.0435, lng: 39.6682 },
    responseTime: 15,
    equipment: ['Standard Kit', 'Radio'],
    lastContact: new Date(Date.now() - 7200000),
    batteryLevel: 100
  }
];

// Generate dispatch recommendations based on threat predictions
const generateDispatchRecommendations = (teams: RangerTeam[], drones: DronePatrolRoute[]): DispatchRecommendation[] => [
  {
    id: 'disp-001',
    threatType: 'Poaching Activity',
    threatLocation: { lat: -1.4561, lng: 35.1258 },
    severity: 'critical',
    confidence: 0.92,
    recommendedTeam: 'Alpha Squad',
    estimatedResponseTime: '8 minutes',
    rationale: 'Alpha Squad is closest to threat location with appropriate anti-poaching equipment. Thermal drone surveillance confirms 3 unidentified individuals in restricted zone.',
    actions: [
      { action: 'Deploy Alpha Squad to intercept', priority: 1, target: 'Alpha Squad' },
      { action: 'Launch Eagle-1 drone for aerial coverage', priority: 2, target: 'Eagle-1' },
      { action: 'Alert backup team Bravo', priority: 3, target: 'Bravo Unit' }
    ],
    droneSupport: ['Eagle-1', 'Hawk-2'],
    status: 'pending',
    createdAt: new Date(Date.now() - 120000)
  },
  {
    id: 'disp-002',
    threatType: 'Vehicle Intrusion',
    threatLocation: { lat: -3.4072, lng: 38.5827 },
    severity: 'high',
    confidence: 0.87,
    recommendedTeam: 'Bravo Unit',
    estimatedResponseTime: '5 minutes',
    rationale: 'Unidentified vehicle detected entering protected zone via eastern boundary. Bravo Unit on standby with fastest response time. Drone surveillance recommended.',
    actions: [
      { action: 'Dispatch Bravo Unit for vehicle intercept', priority: 1, target: 'Bravo Unit' },
      { action: 'Establish roadblock at checkpoint C', priority: 2, target: 'Infrastructure' },
      { action: 'Document vehicle and occupants', priority: 3, target: 'Surveillance' }
    ],
    droneSupport: ['Tsavo-3'],
    status: 'dispatched',
    createdAt: new Date(Date.now() - 600000)
  },
  {
    id: 'disp-003',
    threatType: 'Fire Risk Zone',
    threatLocation: { lat: -0.1621, lng: 37.3284 },
    severity: 'medium',
    confidence: 0.78,
    recommendedTeam: 'Charlie Response',
    estimatedResponseTime: '12 minutes',
    rationale: 'Elevated fire risk detected in dry vegetation area. Charlie Response has fire suppression equipment. Preventive positioning recommended.',
    actions: [
      { action: 'Position Charlie at fire break point', priority: 1, target: 'Charlie Response' },
      { action: 'Deploy thermal monitoring drone', priority: 2, target: 'Kenya-5' },
      { action: 'Alert fire response coordinator', priority: 3, target: 'Command' }
    ],
    droneSupport: ['Kenya-5'],
    status: 'acknowledged',
    createdAt: new Date(Date.now() - 1800000)
  },
  {
    id: 'disp-004',
    threatType: 'Wildlife Distress',
    threatLocation: { lat: 0.5912, lng: 37.5467 },
    severity: 'medium',
    confidence: 0.82,
    recommendedTeam: 'Delta Recon',
    estimatedResponseTime: '10 minutes',
    rationale: 'Elephant herd showing stress patterns near water source. Delta Recon in area with wildlife monitoring equipment. Assessment recommended.',
    actions: [
      { action: 'Delta Recon to assess wildlife status', priority: 1, target: 'Delta Recon' },
      { action: 'Deploy veterinary drone if needed', priority: 2, target: 'Medical' },
      { action: 'Log wildlife behavior patterns', priority: 3, target: 'Data' }
    ],
    droneSupport: ['Samburu-4'],
    status: 'pending',
    createdAt: new Date(Date.now() - 300000)
  }
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/50';
    case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
    case 'medium': return 'text-amber-400 bg-amber-500/20 border-amber-500/50';
    case 'low': return 'text-green-400 bg-green-500/20 border-green-500/50';
    default: return 'text-muted-foreground bg-muted/20';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'patrol': return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/50';
    case 'standby': return 'text-green-400 bg-green-500/20 border-green-500/50';
    case 'responding': return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
    case 'off-duty': return 'text-muted-foreground bg-muted/20 border-muted/50';
    case 'pending': return 'text-amber-400 bg-amber-500/20 border-amber-500/50';
    case 'dispatched': return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/50';
    case 'acknowledged': return 'text-green-400 bg-green-500/20 border-green-500/50';
    case 'completed': return 'text-purple-400 bg-purple-500/20 border-purple-500/50';
    default: return 'text-muted-foreground bg-muted/20';
  }
};

export default function RangerDispatchPage() {
  const { toast } = useToast();
  const [rangerTeams] = useState<RangerTeam[]>(() => generateRangerTeams());
  const [dronePatrols] = useState<DronePatrolRoute[]>(() => generateDronePatrols());
  const [recommendations, setRecommendations] = useState<DispatchRecommendation[]>(() => 
    generateDispatchRecommendations(generateRangerTeams(), generateDronePatrols())
  );
  const [selectedRec, setSelectedRec] = useState<DispatchRecommendation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const stats = useMemo(() => ({
    activeTeams: rangerTeams.filter(t => t.status !== 'off-duty').length,
    totalRangers: rangerTeams.reduce((sum, t) => sum + t.members, 0),
    pendingDispatches: recommendations.filter(r => r.status === 'pending').length,
    criticalAlerts: recommendations.filter(r => r.severity === 'critical').length
  }), [rangerTeams, recommendations]);

  const handleDispatch = async (rec: DispatchRecommendation) => {
    setRecommendations(prev => prev.map(r => 
      r.id === rec.id ? { ...r, status: 'dispatched' } : r
    ));
    
    toast({
      title: "Dispatch Initiated",
      description: `${rec.recommendedTeam} dispatched to ${rec.threatType} incident`,
    });
  };

  const generateAIRecommendations = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('autonomous-commander', {
        body: {
          triggerEvent: {
            type: 'Ranger Dispatch Analysis',
            severity: 'high',
            location: { lat: -1.29, lng: 36.82 },
            description: 'Generate optimal ranger dispatch recommendations based on current threat landscape'
          },
          context: {
            timeOfDay: new Date().getHours() < 6 || new Date().getHours() > 18 ? 'night' : 'day',
            visibility: 'moderate',
            recentActivity: 'elevated'
          },
          availableResources: {
            drones: dronePatrols.map(d => d.droneName),
            rangerTeams: rangerTeams.map(t => t.name),
            sensors: 'online'
          }
        }
      });

      if (error) throw error;

      toast({
        title: "AI Analysis Complete",
        description: "Dispatch recommendations updated based on threat predictions",
      });
    } catch (error) {
      console.error('AI recommendation error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Could not generate recommendations",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <Users className="h-7 w-7 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                AI Ranger Dispatch System
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                  <Brain className="h-3 w-3 mr-1" />
                  AI-Powered
                </Badge>
              </h1>
              <p className="text-sm text-muted-foreground">
                Automated dispatch recommendations based on threat predictions and drone surveillance
              </p>
            </div>
          </div>
          
          <Button onClick={generateAIRecommendations} disabled={isGenerating}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Analyzing...' : 'Generate Recommendations'}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card/50 backdrop-blur border-cyan-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-cyan-400 mb-1">
                <Users className="h-4 w-4" />
                <span className="text-xs">Active Teams</span>
              </div>
              <div className="text-2xl font-bold">{stats.activeTeams}</div>
              <div className="text-xs text-muted-foreground">of {rangerTeams.length} total</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-green-400 mb-1">
                <Shield className="h-4 w-4" />
                <span className="text-xs">Rangers On-Duty</span>
              </div>
              <div className="text-2xl font-bold">{stats.totalRangers}</div>
              <div className="text-xs text-muted-foreground">across all teams</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur border-amber-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-amber-400 mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-xs">Pending Dispatches</span>
              </div>
              <div className="text-2xl font-bold">{stats.pendingDispatches}</div>
              <div className="text-xs text-muted-foreground">awaiting action</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur border-red-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-400 mb-1">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-xs">Critical Alerts</span>
              </div>
              <div className="text-2xl font-bold">{stats.criticalAlerts}</div>
              <div className="text-xs text-muted-foreground">require immediate response</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dispatch Recommendations */}
          <div className="lg:col-span-2">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader className="py-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  AI Dispatch Recommendations
                </CardTitle>
                <CardDescription>
                  Automated recommendations based on threat predictions and resource availability
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                {recommendations.map((rec) => (
                  <motion.div
                    key={rec.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedRec?.id === rec.id 
                        ? 'bg-primary/10 border-primary/50' 
                        : 'bg-muted/20 border-border/50 hover:bg-muted/40'
                    }`}
                    onClick={() => setSelectedRec(selectedRec?.id === rec.id ? null : rec)}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getSeverityColor(rec.severity)}`}>
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-semibold">{rec.threatType}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {rec.threatLocation.lat.toFixed(4)}, {rec.threatLocation.lng.toFixed(4)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-[10px] ${getSeverityColor(rec.severity)}`}>
                          {rec.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className={`text-[10px] ${getStatusColor(rec.status)}`}>
                          {rec.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 text-xs mb-3">
                      <div className="p-2 rounded bg-muted/30">
                        <div className="text-muted-foreground">Recommended Team</div>
                        <div className="font-semibold text-cyan-400">{rec.recommendedTeam}</div>
                      </div>
                      <div className="p-2 rounded bg-muted/30">
                        <div className="text-muted-foreground">Response Time</div>
                        <div className="font-semibold">{rec.estimatedResponseTime}</div>
                      </div>
                      <div className="p-2 rounded bg-muted/30">
                        <div className="text-muted-foreground">AI Confidence</div>
                        <div className="font-semibold text-purple-400">{Math.round(rec.confidence * 100)}%</div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {selectedRec?.id === rec.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-border/50 pt-3 mt-3"
                        >
                          <div className="mb-3">
                            <div className="text-xs font-semibold mb-1 flex items-center gap-1">
                              <Brain className="h-3 w-3 text-purple-400" />
                              AI Rationale
                            </div>
                            <p className="text-xs text-muted-foreground">{rec.rationale}</p>
                          </div>
                          
                          <div className="mb-3">
                            <div className="text-xs font-semibold mb-2">Recommended Actions</div>
                            <div className="space-y-1">
                              {rec.actions.map((action, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs p-2 rounded bg-muted/20">
                                  <Badge variant="outline" className="text-[9px] h-4 w-4 p-0 justify-center">
                                    {action.priority}
                                  </Badge>
                                  <span className="flex-1">{action.action}</span>
                                  <span className="text-muted-foreground">{action.target}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <div className="text-xs font-semibold mb-1 flex items-center gap-1">
                              <Plane className="h-3 w-3 text-cyan-400" />
                              Drone Support
                            </div>
                            <div className="flex gap-2">
                              {rec.droneSupport.map((drone) => (
                                <Badge key={drone} variant="outline" className="text-[10px] text-cyan-400 border-cyan-500/50">
                                  {drone}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          {rec.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                className="flex-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDispatch(rec);
                                }}
                              >
                                <Send className="h-3 w-3 mr-1" />
                                Dispatch Team
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Phone className="h-3 w-3 mr-1" />
                                Contact Team
                              </Button>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Ranger Teams Sidebar */}
          <div className="space-y-4">
            <Card className="bg-card/50 backdrop-blur border-cyan-500/20">
              <CardHeader className="py-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4 text-cyan-400" />
                  Ranger Teams
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {rangerTeams.map((team) => (
                  <div key={team.id} className="p-3 rounded-lg bg-muted/20 border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{team.name}</span>
                      <Badge variant="outline" className={`text-[10px] ${getStatusColor(team.status)}`}>
                        {team.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{team.members} members</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{team.responseTime} min</span>
                      </div>
                    </div>
                    {team.currentMission && (
                      <div className="text-xs text-cyan-400 truncate">
                        {team.currentMission}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Progress value={team.batteryLevel} className="flex-1 h-1.5" />
                      <span className="text-[10px] text-muted-foreground">{team.batteryLevel}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-purple-500/20">
              <CardHeader className="py-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple-400" />
                  Dispatch Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {recommendations.slice(0, 4).map((rec) => (
                  <div key={rec.id} className="flex items-center justify-between p-2 rounded bg-muted/30 text-xs">
                    <div>
                      <div className="font-medium">{rec.threatType}</div>
                      <div className="text-muted-foreground">
                        {rec.createdAt.toLocaleTimeString()}
                      </div>
                    </div>
                    <Badge variant="outline" className={`text-[9px] ${getStatusColor(rec.status)}`}>
                      {rec.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
