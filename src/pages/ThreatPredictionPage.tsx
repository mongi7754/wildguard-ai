import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target,
  AlertTriangle,
  Flame,
  MapPin,
  Clock,
  TrendingUp,
  RefreshCw,
  Shield
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Prediction {
  type: string;
  location: { lat: number; lng: number; radius_km: number };
  riskLevel: number;
  confidence: number;
  timeframe: string;
  contributingFactors: string[];
  recommendedActions: string[];
  priority: string;
}

interface PredictionResult {
  predictions: Prediction[];
  overallRiskAssessment: string;
  recommendedPatrolRoutes: any[];
}

const priorityColors = {
  critical: 'danger',
  high: 'warning',
  medium: 'tactical',
  low: 'success'
};

const typeIcons = {
  poaching: Shield,
  fire: Flame,
  habitat_destruction: Target,
  intrusion: AlertTriangle
};

export default function ThreatPredictionPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState<PredictionResult | null>(null);
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);

  const generatePredictions = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('threat-prediction-engine', {
        body: {
          parkId: 'masai-mara',
          historicalData: {
            recentAlerts: 5,
            poachingIncidents: 2,
            fireCalls: 1
          },
          environmentData: {
            temp: 28,
            humidity: 65,
            fireRisk: 'moderate',
            visibility: 'good'
          }
        }
      });

      if (error) throw error;

      if (data?.predictions) {
        setPredictions(data.predictions);
        
        // Store predictions in database
        for (const pred of data.predictions.predictions || []) {
          await supabase.from('threat_predictions').insert({
            prediction_type: pred.type,
            location: pred.location,
            park_id: 'masai-mara',
            risk_level: pred.riskLevel,
            confidence: pred.confidence,
            predicted_timeframe: pred.timeframe,
            contributing_factors: pred.contributingFactors
          });
        }

        toast({
          title: "Predictions Generated",
          description: `${data.predictions.predictions?.length || 0} threat predictions identified`,
        });
      }
    } catch (error) {
      console.error('Prediction error:', error);
      toast({
        title: "Prediction Failed",
        description: error instanceof Error ? error.message : "Could not generate predictions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generatePredictions();
  }, []);

  return (
    <AppLayout title="Threat Predictions">
      <div className="px-4 py-4 space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-danger/20 mb-3">
            <Target className="w-8 h-8 text-danger" />
          </div>
          <h2 className="font-display text-xl font-bold">Predictive Threat Engine</h2>
          <p className="text-sm text-muted-foreground mt-1">
            AI-powered threat forecasting
          </p>
        </motion.div>

        {/* Refresh Button */}
        <Button 
          variant="outline" 
          className="w-full"
          onClick={generatePredictions}
          disabled={isLoading}
        >
          <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
          {isLoading ? 'Analyzing...' : 'Refresh Predictions'}
        </Button>

        {/* Overall Assessment */}
        {predictions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card variant="alert" className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Overall Assessment</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {predictions.overallRiskAssessment}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Predictions List */}
        {predictions?.predictions && (
          <div className="space-y-3">
            <h3 className="font-display text-sm font-semibold">Active Predictions</h3>
            {predictions.predictions.map((pred, i) => {
              const Icon = typeIcons[pred.type as keyof typeof typeIcons] || AlertTriangle;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card 
                    variant={pred.priority === 'critical' ? 'danger' : pred.priority === 'high' ? 'alert' : 'tactical'}
                    className="p-4 cursor-pointer"
                    onClick={() => setSelectedPrediction(pred)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          pred.priority === 'critical' ? "bg-danger/20 text-danger" :
                          pred.priority === 'high' ? "bg-accent/20 text-accent" :
                          "bg-secondary text-secondary-foreground"
                        )}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm capitalize">{pred.type.replace(/_/g, ' ')} Threat</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground">{pred.timeframe}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={priorityColors[pred.priority as keyof typeof priorityColors] as any}>
                        {pred.priority}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-secondary/50 rounded-lg p-2 text-center">
                        <p className="text-lg font-bold text-danger">{Math.round(pred.riskLevel * 100)}%</p>
                        <p className="text-[10px] text-muted-foreground">Risk Level</p>
                      </div>
                      <div className="bg-secondary/50 rounded-lg p-2 text-center">
                        <p className="text-lg font-bold text-primary">{Math.round(pred.confidence * 100)}%</p>
                        <p className="text-[10px] text-muted-foreground">Confidence</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{pred.location.lat.toFixed(4)}, {pred.location.lng.toFixed(4)}</span>
                      <span className="mx-1">•</span>
                      <span>{pred.location.radius_km}km radius</span>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Selected Prediction Details */}
        {selectedPrediction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto"
          >
            <div className="min-h-screen px-4 py-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold capitalize">
                  {selectedPrediction.type.replace(/_/g, ' ')} Threat
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setSelectedPrediction(null)}>
                  Close
                </Button>
              </div>

              <div className="space-y-4">
                {/* Risk Meters */}
                <div className="grid grid-cols-2 gap-3">
                  <Card variant="danger" className="p-4 text-center">
                    <p className="text-3xl font-bold">{Math.round(selectedPrediction.riskLevel * 100)}%</p>
                    <p className="text-xs text-muted-foreground">Risk Level</p>
                  </Card>
                  <Card variant="glow" className="p-4 text-center">
                    <p className="text-3xl font-bold">{Math.round(selectedPrediction.confidence * 100)}%</p>
                    <p className="text-xs text-muted-foreground">AI Confidence</p>
                  </Card>
                </div>

                {/* Contributing Factors */}
                <Card variant="tactical">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Contributing Factors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedPrediction.contributingFactors.map((factor, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <TrendingUp className="w-3 h-3 text-accent shrink-0" />
                          <span>{factor}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recommended Actions */}
                <Card variant="glow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Recommended Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedPrediction.recommendedActions.map((action, i) => (
                        <Button key={i} variant="tactical" size="sm" className="w-full justify-start text-xs">
                          <Shield className="w-3 h-3 mr-2" />
                          {action}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && !predictions && (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Analyzing threat patterns...</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
