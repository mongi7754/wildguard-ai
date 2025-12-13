import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot,
  Zap,
  Play,
  Pause,
  Activity,
  Shield,
  Plane,
  Bell,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Decision {
  id: string;
  type: string;
  rationale: string;
  actions: Array<{
    action: string;
    target: string;
    priority: number;
  }>;
  riskLevel: string;
  timestamp: Date;
}

const triggerEvents = [
  { id: 'sensor', label: 'Sensor Activation', icon: Activity, severity: 'medium' },
  { id: 'intrusion', label: 'Intrusion Detected', icon: AlertTriangle, severity: 'high' },
  { id: 'poacher', label: 'Poacher Alert', icon: Shield, severity: 'critical' },
  { id: 'fire', label: 'Fire Detection', icon: Zap, severity: 'critical' },
];

export default function AutonomousCommanderPage() {
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);

  const simulateTrigger = async (eventType: string) => {
    const trigger = triggerEvents.find(t => t.id === eventType);
    if (!trigger) return;

    setIsProcessing(true);
    setSelectedTrigger(eventType);

    try {
      const { data, error } = await supabase.functions.invoke('autonomous-commander', {
        body: {
          triggerEvent: {
            type: trigger.label,
            severity: trigger.severity,
            location: { lat: -1.29, lng: 36.82 },
            description: `${trigger.label} triggered by system sensors`
          },
          context: {
            timeOfDay: new Date().getHours() < 6 || new Date().getHours() > 18 ? 'night' : 'day',
            visibility: 'moderate',
            recentActivity: 'normal'
          },
          availableResources: {
            drones: ['Eagle-1', 'Hawk-2'],
            rangerTeams: ['Alpha', 'Bravo', 'Charlie'],
            sensors: 'online'
          }
        }
      });

      if (error) throw error;

      if (data?.decision) {
        const newDecision: Decision = {
          id: `dec-${Date.now()}`,
          type: data.decision.decision?.type || 'unknown',
          rationale: data.decision.decision?.rationale || data.decision.situationAssessment || 'No rationale provided',
          actions: data.decision.decision?.actions || [],
          riskLevel: data.decision.riskLevel || 'medium',
          timestamp: new Date()
        };

        setDecisions(prev => [newDecision, ...prev].slice(0, 10));

        // Log to database
        await supabase.from('autonomous_decisions').insert({
          decision_type: newDecision.type,
          trigger_event: trigger.label,
          action_taken: newDecision.actions.map(a => a.action).join(', '),
          parameters: { actions: newDecision.actions },
          confidence: 0.87
        });

        toast({
          title: "Decision Executed",
          description: `Action: ${newDecision.type.replace(/_/g, ' ')}`,
        });
      }
    } catch (error) {
      console.error('Commander error:', error);
      toast({
        title: "Decision Failed",
        description: error instanceof Error ? error.message : "Could not process",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setSelectedTrigger(null);
    }
  };

  return (
    <AppLayout title="Autonomous Commander">
      <div className="px-4 py-4 space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className={cn(
            "inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-3 transition-colors",
            isActive ? "bg-success/20" : "bg-muted"
          )}>
            <Bot className={cn("w-8 h-8", isActive ? "text-success" : "text-muted-foreground")} />
          </div>
          <h2 className="font-display text-xl font-bold">Digital Commander</h2>
          <p className="text-sm text-muted-foreground mt-1">
            AI-driven autonomous decision engine
          </p>
        </motion.div>

        {/* Status Toggle */}
        <Card variant={isActive ? 'glow' : 'tactical'} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-3 h-3 rounded-full",
                isActive ? "bg-success animate-pulse" : "bg-muted-foreground"
              )} />
              <div>
                <p className="font-semibold text-sm">
                  {isActive ? 'Commander Active' : 'Commander Offline'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isActive ? 'Processing events autonomously' : 'Manual mode only'}
                </p>
              </div>
            </div>
            <Button
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsActive(!isActive)}
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
          </div>
        </Card>

        {/* Trigger Events */}
        <div>
          <h3 className="font-display text-sm font-semibold mb-3">Simulate Event</h3>
          <div className="grid grid-cols-2 gap-3">
            {triggerEvents.map((event) => {
              const Icon = event.icon;
              const isProcessingThis = isProcessing && selectedTrigger === event.id;
              return (
                <Button
                  key={event.id}
                  variant={event.severity === 'critical' ? 'danger' : event.severity === 'high' ? 'alert' : 'tactical'}
                  className="h-auto py-4 flex-col"
                  disabled={isProcessing || !isActive}
                  onClick={() => simulateTrigger(event.id)}
                >
                  {isProcessingThis ? (
                    <Activity className="w-6 h-6 mb-2 animate-pulse" />
                  ) : (
                    <Icon className="w-6 h-6 mb-2" />
                  )}
                  <span className="text-xs">{event.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Decision Log */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-sm font-semibold">Decision Log</h3>
            <Badge variant="outline">{decisions.length} decisions</Badge>
          </div>

          {decisions.length === 0 ? (
            <Card variant="ghost" className="p-6 text-center bg-secondary/30">
              <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No decisions yet</p>
              <p className="text-xs text-muted-foreground mt-1">Trigger an event to see AI decisions</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {decisions.map((decision, i) => (
                <motion.div
                  key={decision.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card variant={
                    decision.riskLevel === 'critical' ? 'danger' :
                    decision.riskLevel === 'high' ? 'alert' : 'tactical'
                  } className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="font-semibold text-sm capitalize">
                          {decision.type.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <Badge variant={
                        decision.riskLevel === 'critical' ? 'danger' :
                        decision.riskLevel === 'high' ? 'warning' : 'outline'
                      } className="text-[10px]">
                        {decision.riskLevel}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground mb-3">
                      {decision.rationale}
                    </p>

                    {decision.actions.length > 0 && (
                      <div className="space-y-1">
                        {decision.actions.slice(0, 2).map((action, j) => (
                          <div key={j} className="flex items-center gap-2 text-xs bg-secondary/50 rounded p-2">
                            <Zap className="w-3 h-3 text-primary shrink-0" />
                            <span className="flex-1">{action.action}</span>
                            <Badge variant="outline" className="text-[10px]">P{action.priority}</Badge>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-[10px] text-muted-foreground mt-2">
                      {decision.timestamp.toLocaleTimeString()}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
