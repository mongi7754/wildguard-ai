import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Fingerprint, 
  Scan, 
  Camera, 
  Upload, 
  Check, 
  AlertTriangle,
  Heart,
  MapPin,
  Calendar,
  Activity,
  Eye
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface BiometricResult {
  species: string;
  speciesConfidence: number;
  individualId: string;
  biometricSignature: {
    primaryMarkers: string[];
    patternHash: string;
    facialGeometry: Record<string, any>;
    bodyMeasurements: Record<string, any>;
  };
  estimatedAge: string;
  healthAssessment: {
    status: string;
    confidence: number;
    concerns: string[];
  };
  behavioralState: string;
  matchProbability: number;
}

const speciesOptions = [
  { id: 'elephant', name: 'African Elephant', emoji: '🐘' },
  { id: 'lion', name: 'Lion', emoji: '🦁' },
  { id: 'rhino', name: 'Black Rhino', emoji: '🦏' },
  { id: 'zebra', name: 'Zebra', emoji: '🦓' },
  { id: 'giraffe', name: 'Giraffe', emoji: '🦒' },
  { id: 'cheetah', name: 'Cheetah', emoji: '🐆' },
];

export default function BiometricIdentityPage() {
  const { toast } = useToast();
  const [selectedSpecies, setSelectedSpecies] = useState('elephant');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<BiometricResult | null>(null);
  const [scanProgress, setScanProgress] = useState(0);

  const runBiometricAnalysis = async () => {
    setIsAnalyzing(true);
    setScanProgress(0);
    setResult(null);

    const progressInterval = setInterval(() => {
      setScanProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
      const { data, error } = await supabase.functions.invoke('wildlife-biometric-analysis', {
        body: { 
          species: speciesOptions.find(s => s.id === selectedSpecies)?.name,
          parkId: 'masai-mara'
        }
      });

      clearInterval(progressInterval);
      setScanProgress(100);

      if (error) throw error;

      if (data?.analysis) {
        setResult(data.analysis);
        
        // Store in database
        await supabase.from('wildlife_identities').insert({
          species: data.analysis.species,
          individual_name: data.analysis.individualId,
          biometric_signature: data.analysis.biometricSignature,
          health_status: data.analysis.healthAssessment?.status || 'unknown',
          estimated_age: parseInt(data.analysis.estimatedAge) || null,
          park_id: 'masai-mara'
        });

        toast({
          title: "Biometric Analysis Complete",
          description: `Identified: ${data.analysis.individualId}`,
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Could not complete analysis",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <AppLayout title="Biometric Identity">
      <div className="px-4 py-4 space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-3">
            <Fingerprint className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-xl font-bold">Wildlife DNA Engine</h2>
          <p className="text-sm text-muted-foreground mt-1">
            AI-powered individual animal identification
          </p>
        </motion.div>

        {/* Species Selection */}
        <Card variant="tactical">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Select Species</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {speciesOptions.map((species) => (
                <Button
                  key={species.id}
                  variant={selectedSpecies === species.id ? 'default' : 'outline'}
                  className="h-auto py-3 flex-col"
                  onClick={() => setSelectedSpecies(species.id)}
                >
                  <span className="text-xl mb-1">{species.emoji}</span>
                  <span className="text-[10px]">{species.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scan Area */}
        <Card variant="glow" className="overflow-hidden">
          <div className="relative aspect-square bg-forest-dark">
            {/* Grid overlay */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                  linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />

            {/* Scanning animation */}
            {isAnalyzing && (
              <motion.div 
                className="absolute inset-0 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            )}

            {/* Central display */}
            <div className="absolute inset-0 flex items-center justify-center">
              {!isAnalyzing && !result ? (
                <div className="text-center">
                  <span className="text-6xl mb-4 block">
                    {speciesOptions.find(s => s.id === selectedSpecies)?.emoji}
                  </span>
                  <p className="text-sm text-muted-foreground">Ready to scan</p>
                </div>
              ) : isAnalyzing ? (
                <div className="text-center">
                  <Scan className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
                  <p className="text-sm font-medium">Analyzing biometrics...</p>
                  <p className="text-xs text-muted-foreground mt-1">{scanProgress}%</p>
                </div>
              ) : null}
            </div>

            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-primary/60" />
            <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-primary/60" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-primary/60" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-primary/60" />
          </div>
        </Card>

        {/* Scan Button */}
        {!result && (
          <Button 
            variant="glow" 
            size="lg" 
            className="w-full"
            onClick={runBiometricAnalysis}
            disabled={isAnalyzing}
          >
            <Fingerprint className="w-5 h-5 mr-2" />
            {isAnalyzing ? 'Analyzing...' : 'Run Biometric Analysis'}
          </Button>
        )}

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Identity Card */}
              <Card variant="glow" className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-success" />
                    <span className="font-semibold">Identity Confirmed</span>
                  </div>
                  <Badge variant="success">
                    {Math.round(result.speciesConfidence * 100)}% Match
                  </Badge>
                </div>

                <div className="bg-secondary/50 rounded-xl p-4 mb-4">
                  <p className="text-xs text-muted-foreground mb-1">Individual ID</p>
                  <p className="font-display text-xl font-bold text-primary">{result.individualId}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-secondary/30 rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground mb-1">Species</p>
                    <p className="text-sm font-medium">{result.species}</p>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground mb-1">Est. Age</p>
                    <p className="text-sm font-medium">{result.estimatedAge}</p>
                  </div>
                </div>
              </Card>

              {/* Health Assessment */}
              <Card variant={result.healthAssessment.status === 'healthy' ? 'tactical' : 'alert'} className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className={cn(
                    "w-4 h-4",
                    result.healthAssessment.status === 'healthy' ? "text-success" : "text-warning"
                  )} />
                  <span className="font-semibold text-sm">Health Assessment</span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant={result.healthAssessment.status === 'healthy' ? 'success' : 'warning'}>
                    {result.healthAssessment.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(result.healthAssessment.confidence * 100)}% confidence
                  </span>
                </div>
                {result.healthAssessment.concerns.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {result.healthAssessment.concerns.map((concern, i) => (
                      <Badge key={i} variant="warning" className="text-[10px]">{concern}</Badge>
                    ))}
                  </div>
                )}
              </Card>

              {/* Biometric Signature */}
              <Card variant="tactical" className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Fingerprint className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-sm">Biometric Markers</span>
                </div>
                <div className="space-y-2">
                  {result.biometricSignature.primaryMarkers.map((marker, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{marker}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-border/50">
                  <p className="text-[10px] text-muted-foreground">Pattern Hash</p>
                  <p className="font-mono text-xs text-primary">{result.biometricSignature.patternHash}</p>
                </div>
              </Card>

              {/* New Scan Button */}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setResult(null)}
              >
                New Scan
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
