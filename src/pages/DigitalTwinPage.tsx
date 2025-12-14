import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trees,
  Mountain,
  Droplets,
  Thermometer,
  Wind,
  CloudRain,
  Flame,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Settings,
  TrendingUp,
  TrendingDown,
  Activity,
  Map,
  Users,
  Footprints,
  ChevronRight
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface SimulationScenario {
  id: string;
  name: string;
  type: 'road_construction' | 'rainfall_change' | 'population_growth' | 'fire_outbreak' | 'poaching_increase';
  icon: React.ReactNode;
  description: string;
  parameters: Record<string, number>;
}

interface AnimalPopulation {
  species: string;
  currentCount: number;
  projectedCount: number;
  trend: 'up' | 'down' | 'stable';
  threatLevel: 'low' | 'medium' | 'high';
}

const scenarios: SimulationScenario[] = [
  {
    id: 'road',
    name: 'Road Construction',
    type: 'road_construction',
    icon: <Mountain className="w-5 h-5" />,
    description: 'Simulate impact of new road through park',
    parameters: { roadLength: 10, disturbanceRadius: 2 }
  },
  {
    id: 'rainfall',
    name: 'Rainfall Decrease',
    type: 'rainfall_change',
    icon: <CloudRain className="w-5 h-5" />,
    description: 'Simulate 20% decrease in annual rainfall',
    parameters: { rainfallChange: -20, duration: 12 }
  },
  {
    id: 'population',
    name: 'Human Encroachment',
    type: 'population_growth',
    icon: <Users className="w-5 h-5" />,
    description: 'Simulate population growth near park boundaries',
    parameters: { growthRate: 5, proximityKm: 5 }
  },
  {
    id: 'fire',
    name: 'Fire Outbreak',
    type: 'fire_outbreak',
    icon: <Flame className="w-5 h-5" />,
    description: 'Simulate wildfire spread patterns',
    parameters: { startZone: 1, windSpeed: 20 }
  },
  {
    id: 'poaching',
    name: 'Poaching Increase',
    type: 'poaching_increase',
    icon: <AlertTriangle className="w-5 h-5" />,
    description: 'Simulate increased poaching activity',
    parameters: { increaseRate: 30, targetSpecies: 1 }
  }
];

const initialPopulations: AnimalPopulation[] = [
  { species: 'African Elephant', currentCount: 847, projectedCount: 847, trend: 'stable', threatLevel: 'medium' },
  { species: 'Lion', currentCount: 156, projectedCount: 156, trend: 'stable', threatLevel: 'low' },
  { species: 'Black Rhino', currentCount: 42, projectedCount: 42, trend: 'stable', threatLevel: 'high' },
  { species: 'Zebra', currentCount: 2340, projectedCount: 2340, trend: 'stable', threatLevel: 'low' },
  { species: 'Giraffe', currentCount: 523, projectedCount: 523, trend: 'stable', threatLevel: 'medium' }
];

export default function DigitalTwinPage() {
  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [populations, setPopulations] = useState<AnimalPopulation[]>(initialPopulations);
  const [environmentalMetrics, setEnvironmentalMetrics] = useState({
    temperature: 28,
    humidity: 65,
    rainfall: 850,
    fireRisk: 25,
    habitatHealth: 82
  });
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const [timeScale, setTimeScale] = useState([12]); // months
  const { toast } = useToast();

  const runSimulation = async () => {
    if (!selectedScenario) {
      toast({
        title: "No Scenario Selected",
        description: "Please select a scenario to simulate",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    setSimulationProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setSimulationProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    try {
      // Call edge function to run AI-powered simulation
      const { data, error } = await supabase.functions.invoke('threat-prediction-engine', {
        body: {
          park_id: 'masai-mara',
          historical_data: {
            poaching_incidents: 12,
            fire_events: 3,
            rainfall_mm: environmentalMetrics.rainfall,
            temperature_avg: environmentalMetrics.temperature
          },
          scenario: selectedScenario.type,
          parameters: {
            ...selectedScenario.parameters,
            timeScaleMonths: timeScale[0]
          }
        }
      });

      if (error) throw error;

      // Update populations based on simulation
      const updatedPopulations = populations.map(pop => {
        let changePercent = 0;
        
        switch (selectedScenario.type) {
          case 'road_construction':
            changePercent = pop.threatLevel === 'high' ? -15 : -5;
            break;
          case 'rainfall_change':
            changePercent = pop.species === 'African Elephant' ? -20 : -10;
            break;
          case 'fire_outbreak':
            changePercent = -25;
            break;
          case 'poaching_increase':
            changePercent = pop.threatLevel === 'high' ? -35 : -10;
            break;
          case 'population_growth':
            changePercent = -8;
            break;
        }

        const projected = Math.max(0, Math.round(pop.currentCount * (1 + changePercent / 100)));
        return {
          ...pop,
          projectedCount: projected,
          trend: projected > pop.currentCount ? 'up' : projected < pop.currentCount ? 'down' : 'stable'
        } as AnimalPopulation;
      });

      setPopulations(updatedPopulations);

      // Update environmental metrics
      setEnvironmentalMetrics(prev => ({
        ...prev,
        fireRisk: selectedScenario.type === 'rainfall_change' ? 65 : 
                  selectedScenario.type === 'fire_outbreak' ? 95 : prev.fireRisk,
        habitatHealth: prev.habitatHealth - (selectedScenario.type === 'road_construction' ? 15 : 5)
      }));

      setSimulationResults(data);

      // Store simulation in database
      const simulationRecord = {
        park_id: 'masai-mara',
        simulation_name: selectedScenario.name,
        scenario_type: selectedScenario.type,
        parameters: JSON.parse(JSON.stringify(selectedScenario.parameters)),
        results: JSON.parse(JSON.stringify({
          populations: updatedPopulations,
          predictions: data
        })),
        status: 'completed'
      };
      await supabase.from('digital_twin_simulations').insert([simulationRecord]);

      toast({
        title: "Simulation Complete",
        description: `${selectedScenario.name} scenario has been simulated for ${timeScale[0]} months`,
      });

    } catch (error) {
      console.error('Simulation error:', error);
      toast({
        title: "Simulation Error",
        description: "Failed to run simulation. Please try again.",
        variant: "destructive"
      });
    } finally {
      clearInterval(progressInterval);
      setSimulationProgress(100);
      setTimeout(() => {
        setIsRunning(false);
      }, 500);
    }
  };

  const resetSimulation = () => {
    setPopulations(initialPopulations);
    setSimulationResults(null);
    setSimulationProgress(0);
    setEnvironmentalMetrics({
      temperature: 28,
      humidity: 65,
      rainfall: 850,
      fireRisk: 25,
      habitatHealth: 82
    });
    toast({
      title: "Simulation Reset",
      description: "All values restored to baseline",
    });
  };

  return (
    <AppLayout title="Digital Twin Ecosystem">
      <div className="px-4 py-4 space-y-4">
        {/* Park Overview Visualization */}
        <Card variant="glow" className="overflow-hidden">
          <div className="relative h-48 bg-gradient-to-br from-forest to-forest-dark">
            {/* Animated ecosystem visualization */}
            <div className="absolute inset-0">
              {/* Trees */}
              <motion.div 
                className="absolute bottom-0 left-4"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Trees className="w-12 h-12 text-success/60" />
              </motion.div>
              <motion.div 
                className="absolute bottom-0 left-20"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              >
                <Trees className="w-10 h-10 text-success/50" />
              </motion.div>
              
              {/* Mountains */}
              <Mountain className="absolute top-6 right-8 w-16 h-16 text-muted-foreground/30" />
              
              {/* Wildlife indicators */}
              {populations.slice(0, 3).map((pop, index) => (
                <motion.div
                  key={pop.species}
                  className="absolute"
                  style={{ 
                    bottom: `${20 + index * 15}%`, 
                    left: `${30 + index * 20}%` 
                  }}
                  animate={{ 
                    x: [0, 10, -10, 0],
                    y: [0, -5, 5, 0]
                  }}
                  transition={{ 
                    duration: 5 + index, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className={cn(
                    "w-3 h-3 rounded-full animate-pulse",
                    pop.threatLevel === 'high' ? "bg-danger" :
                    pop.threatLevel === 'medium' ? "bg-accent" : "bg-success"
                  )} />
                </motion.div>
              ))}

              {/* Fire risk indicator */}
              {environmentalMetrics.fireRisk > 50 && (
                <motion.div
                  className="absolute top-4 left-1/2"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Flame className="w-8 h-8 text-danger" />
                </motion.div>
              )}
            </div>

            {/* Overlay stats */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <Badge variant="tactical" className="gap-1">
                <Map className="w-3 h-3" />
                Masai Mara
              </Badge>
              <div className="flex gap-2">
                <Badge variant={environmentalMetrics.habitatHealth > 70 ? 'success' : 'warning'}>
                  Health: {environmentalMetrics.habitatHealth}%
                </Badge>
                <Badge variant={environmentalMetrics.fireRisk < 40 ? 'success' : 'danger'}>
                  Fire Risk: {environmentalMetrics.fireRisk}%
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Scenario Selection */}
        <Card variant="tactical">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="w-4 h-4 text-primary" />
              What-If Scenarios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {scenarios.map((scenario) => (
                <motion.div
                  key={scenario.id}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={selectedScenario?.id === scenario.id ? 'glow' : 'outline'}
                    className={cn(
                      "w-full h-auto py-3 flex-col gap-1",
                      selectedScenario?.id === scenario.id && "ring-1 ring-primary"
                    )}
                    onClick={() => setSelectedScenario(scenario)}
                  >
                    {scenario.icon}
                    <span className="text-xs font-medium">{scenario.name}</span>
                  </Button>
                </motion.div>
              ))}
            </div>

            {selectedScenario && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-3 border-t border-border/50"
              >
                <p className="text-xs text-muted-foreground mb-3">
                  {selectedScenario.description}
                </p>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span>Simulation Period</span>
                      <span className="font-mono">{timeScale[0]} months</span>
                    </div>
                    <Slider
                      value={timeScale}
                      onValueChange={setTimeScale}
                      min={1}
                      max={60}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Simulation Controls */}
        <div className="flex gap-3">
          <Button 
            variant="glow" 
            className="flex-1"
            onClick={runSimulation}
            disabled={isRunning || !selectedScenario}
          >
            {isRunning ? (
              <>
                <Activity className="w-4 h-4 mr-2 animate-pulse" />
                Simulating...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Simulation
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={resetSimulation}
            disabled={isRunning}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <AnimatePresence>
          {isRunning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Progress value={simulationProgress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center mt-2">
                Processing ecosystem model... {simulationProgress}%
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Tabs */}
        <Tabs defaultValue="population" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="population">Population</TabsTrigger>
            <TabsTrigger value="environment">Environment</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
          </TabsList>

          <TabsContent value="population" className="mt-3 space-y-3">
            {populations.map((pop) => (
              <Card key={pop.species} variant="tactical">
                <CardContent className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        pop.threatLevel === 'high' ? "bg-danger/20" :
                        pop.threatLevel === 'medium' ? "bg-accent/20" : "bg-success/20"
                      )}>
                        <Footprints className={cn(
                          "w-5 h-5",
                          pop.threatLevel === 'high' ? "text-danger" :
                          pop.threatLevel === 'medium' ? "text-accent" : "text-success"
                        )} />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{pop.species}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{pop.currentCount.toLocaleString()}</span>
                          <ChevronRight className="w-3 h-3" />
                          <span className={cn(
                            "font-medium",
                            pop.trend === 'down' && "text-danger",
                            pop.trend === 'up' && "text-success"
                          )}>
                            {pop.projectedCount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {pop.trend === 'down' && (
                        <TrendingDown className="w-5 h-5 text-danger" />
                      )}
                      {pop.trend === 'up' && (
                        <TrendingUp className="w-5 h-5 text-success" />
                      )}
                      {pop.trend === 'stable' && (
                        <Activity className="w-5 h-5 text-muted-foreground" />
                      )}
                      <Badge variant={
                        pop.threatLevel === 'high' ? 'danger' :
                        pop.threatLevel === 'medium' ? 'warning' : 'success'
                      }>
                        {pop.threatLevel}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="environment" className="mt-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Card variant="tactical">
                <CardContent className="py-4 text-center">
                  <Thermometer className="w-8 h-8 text-accent mx-auto mb-2" />
                  <p className="text-2xl font-bold font-mono">{environmentalMetrics.temperature}°C</p>
                  <p className="text-xs text-muted-foreground">Temperature</p>
                </CardContent>
              </Card>
              <Card variant="tactical">
                <CardContent className="py-4 text-center">
                  <Droplets className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold font-mono">{environmentalMetrics.humidity}%</p>
                  <p className="text-xs text-muted-foreground">Humidity</p>
                </CardContent>
              </Card>
              <Card variant="tactical">
                <CardContent className="py-4 text-center">
                  <CloudRain className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold font-mono">{environmentalMetrics.rainfall}mm</p>
                  <p className="text-xs text-muted-foreground">Annual Rainfall</p>
                </CardContent>
              </Card>
              <Card variant="tactical">
                <CardContent className="py-4 text-center">
                  <Wind className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-2xl font-bold font-mono">12</p>
                  <p className="text-xs text-muted-foreground">Wind (km/h)</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="behavior" className="mt-3">
            <Card variant="tactical">
              <CardContent className="py-4">
                <h4 className="font-semibold text-sm mb-3">Animal Behavior Predictions</h4>
                {simulationResults ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs font-medium mb-1">Migration Patterns</p>
                      <p className="text-xs text-muted-foreground">
                        Elephants likely to shift 15km south due to water scarcity
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs font-medium mb-1">Feeding Behavior</p>
                      <p className="text-xs text-muted-foreground">
                        Increased competition for grazing areas expected
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs font-medium mb-1">Breeding Impact</p>
                      <p className="text-xs text-muted-foreground">
                        Stress conditions may reduce birth rates by 8-12%
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    Run a simulation to see behavior predictions
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
