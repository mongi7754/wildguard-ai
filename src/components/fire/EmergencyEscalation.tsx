import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Phone, Users, Building2, CheckCircle2, Clock, ArrowRight, Siren } from 'lucide-react';
import { FireAlert } from '@/types/fire';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface EmergencyEscalationProps {
  alerts: FireAlert[];
  onAcknowledge: (alertId: string, stepIndex: number) => void;
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'bg-red-500/20 text-red-400 border-red-500';
    case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500';
    case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
    case 'low': return 'bg-green-500/20 text-green-400 border-green-500';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getStepIcon = (step: number) => {
  switch (step) {
    case 1: return Users;
    case 2: return Phone;
    case 3: return Building2;
    default: return AlertTriangle;
  }
};

const parkNames: Record<string, string> = {
  'masai-mara': 'Masai Mara',
  'amboseli': 'Amboseli',
  'tsavo-east': 'Tsavo East',
  'lake-nakuru': 'Lake Nakuru',
  'samburu': 'Samburu'
};

const formatTimeAgo = (timestamp: string) => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
};

export const EmergencyEscalation = ({ alerts, onAcknowledge }: EmergencyEscalationProps) => {
  const activeAlerts = alerts.filter(a => a.status === 'active');

  const handleEscalate = (alertId: string) => {
    toast.success('Emergency escalation initiated', {
      description: 'All regional authorities have been notified'
    });
  };

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Siren className="h-5 w-5 text-red-400" />
            Emergency Escalation Workflow
          </div>
          {activeAlerts.length > 0 && (
            <Badge variant="outline" className="bg-red-500/10 text-red-400 animate-pulse">
              {activeAlerts.length} Active Emergency
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeAlerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-green-400" />
            <p>No active fire emergencies</p>
          </div>
        ) : (
          activeAlerts.map((alert, alertIndex) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: alertIndex * 0.1 }}
              className="border border-red-500/30 rounded-lg p-4 bg-red-500/5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-red-500/20 animate-pulse">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {alert.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {parkNames[alert.parkId]} • {formatTimeAgo(alert.detectedAt)}
                    </p>
                  </div>
                </div>
                <Badge className={getSeverityColor(alert.severity)}>
                  {alert.severity.toUpperCase()}
                </Badge>
              </div>

              <div className="bg-background/50 rounded-lg p-3 mb-4">
                <p className="text-sm font-medium mb-2">AI Analysis</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Confidence:</span>
                    <span className="ml-1 text-cyan-400">{alert.aiAnalysis.confidence}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Affected Area:</span>
                    <span className="ml-1">{alert.aiAnalysis.affectedArea} ha</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Spread:</span>
                    <span className="ml-1">{alert.aiAnalysis.spreadPrediction}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Est. Containment:</span>
                    <span className="ml-1 text-orange-400">{alert.aiAnalysis.estimatedContainmentTime}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm font-medium">Escalation Steps</p>
                <div className="flex items-center gap-2">
                  {alert.escalationStatus.map((step, stepIndex) => {
                    const StepIcon = getStepIcon(step.step);
                    return (
                      <div key={stepIndex} className="flex items-center gap-2">
                        <div 
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                            step.acknowledged 
                              ? 'border-green-500/50 bg-green-500/10' 
                              : 'border-yellow-500/50 bg-yellow-500/10'
                          }`}
                        >
                          <StepIcon className={`h-4 w-4 ${step.acknowledged ? 'text-green-400' : 'text-yellow-400'}`} />
                          <div className="text-xs">
                            <p className="font-medium">{step.action}</p>
                            {step.acknowledged ? (
                              <p className="text-green-400">✓ {step.acknowledgedBy}</p>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-5 px-2 text-xs text-yellow-400"
                                onClick={() => onAcknowledge(alert.id, stepIndex)}
                              >
                                <Clock className="h-3 w-3 mr-1" /> Acknowledge
                              </Button>
                            )}
                          </div>
                        </div>
                        {stepIndex < alert.escalationStatus.length - 1 && (
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEscalate(alert.id)}
                >
                  <Siren className="h-4 w-4 mr-2" />
                  Escalate to National Command
                </Button>
                <Button variant="outline" size="sm">
                  View Full Report
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
