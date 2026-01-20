import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, TrendingUp, AlertTriangle, FileText, 
  DollarSign, Users, TreePine, Shield, Target,
  Sparkles, BarChart3, Clock, CheckCircle2, Lightbulb
} from 'lucide-react';
import { motion } from 'framer-motion';

interface PolicyRecommendation {
  id: string;
  title: string;
  category: 'revenue' | 'conservation' | 'security' | 'community';
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  description: string;
  projectedOutcome: string;
  timeframe: string;
  risks: string[];
  status: 'pending' | 'approved' | 'implemented' | 'rejected';
}

const mockRecommendations: PolicyRecommendation[] = [
  {
    id: 'pol-1',
    title: 'Increase Anti-Poaching Patrol Frequency in Tsavo Corridor',
    category: 'security',
    impact: 'high',
    confidence: 89,
    description: 'Analysis of poaching incidents shows a 45% increase in the Tsavo East-West corridor during dry season. Recommend doubling patrol frequency.',
    projectedOutcome: 'Estimated 60% reduction in poaching incidents within 6 months',
    timeframe: 'Immediate implementation',
    risks: ['Increased operational costs', 'Ranger fatigue risk'],
    status: 'pending'
  },
  {
    id: 'pol-2',
    title: 'Dynamic Pricing for Peak Season Tourism',
    category: 'revenue',
    impact: 'high',
    confidence: 94,
    description: 'Implement AI-driven dynamic pricing during July-October migration season. Historical data shows 35% price elasticity.',
    projectedOutcome: 'Projected 28% revenue increase (KES 450M annually)',
    timeframe: '3-month implementation',
    risks: ['Tourist perception', 'Competitor response'],
    status: 'approved'
  },
  {
    id: 'pol-3',
    title: 'Community Conservation Credit Program',
    category: 'community',
    impact: 'medium',
    confidence: 82,
    description: 'Launch credit-based incentive program for communities protecting wildlife corridors. Based on successful Laikipia model.',
    projectedOutcome: '40% reduction in human-wildlife conflict',
    timeframe: '6-month pilot',
    risks: ['Funding requirements', 'Implementation complexity'],
    status: 'pending'
  },
  {
    id: 'pol-4',
    title: 'Expand Rhino Sanctuary in Mount Kenya',
    category: 'conservation',
    impact: 'high',
    confidence: 91,
    description: 'Biometric data shows rhino population exceeding current sanctuary capacity. Recommend 200 km² expansion.',
    projectedOutcome: 'Support 40% population growth over 5 years',
    timeframe: '18-month project',
    risks: ['Land acquisition', 'Budget allocation'],
    status: 'implemented'
  }
];

const PolicyIntelligencePage = () => {
  const [recommendations] = useState<PolicyRecommendation[]>(mockRecommendations);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyRecommendation | null>(null);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'revenue': return <DollarSign className="h-4 w-4 text-green-400" />;
      case 'conservation': return <TreePine className="h-4 w-4 text-emerald-400" />;
      case 'security': return <Shield className="h-4 w-4 text-red-400" />;
      case 'community': return <Users className="h-4 w-4 text-blue-400" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'medium': return 'text-amber-400 bg-amber-500/20 border-amber-500/50';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/50';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented': return 'text-green-400 bg-green-500/20';
      case 'approved': return 'text-blue-400 bg-blue-500/20';
      case 'pending': return 'text-amber-400 bg-amber-500/20';
      case 'rejected': return 'text-red-400 bg-red-500/20';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30">
              <Brain className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Policy Intelligence Engine</h1>
              <p className="text-sm text-muted-foreground">
                AI-driven policy recommendations and impact simulations
              </p>
            </div>
          </div>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            <Sparkles className="h-3 w-3 mr-1" />
            KWS-GOV-AI
          </Badge>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-card/50 border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Policies</p>
                    <p className="text-2xl font-bold text-purple-400">24</p>
                  </div>
                  <FileText className="h-8 w-8 text-purple-400/50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card/50 border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue Impact</p>
                    <p className="text-2xl font-bold text-green-400">+KES 1.2B</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-400/50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card/50 border-cyan-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">AI Confidence</p>
                    <p className="text-2xl font-bold text-cyan-400">89%</p>
                  </div>
                  <Target className="h-8 w-8 text-cyan-400/50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-card/50 border-amber-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
                    <p className="text-2xl font-bold text-amber-400">7</p>
                  </div>
                  <Clock className="h-8 w-8 text-amber-400/50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-6">
          {/* Recommendations List */}
          <div className="col-span-2">
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-400" />
                  Policy Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.map((policy, index) => (
                  <motion.div
                    key={policy.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedPolicy?.id === policy.id 
                        ? 'bg-primary/10 border-primary/50' 
                        : 'bg-muted/20 border-border/50 hover:bg-muted/30'
                    }`}
                    onClick={() => setSelectedPolicy(policy)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(policy.category)}
                        <h3 className="font-semibold text-sm">{policy.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getImpactColor(policy.impact)}>
                          {policy.impact} impact
                        </Badge>
                        <Badge className={getStatusColor(policy.status)}>
                          {policy.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{policy.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {policy.timeframe}
                        </span>
                        <span className="flex items-center gap-1 text-cyan-400">
                          <Target className="h-3 w-3" />
                          {policy.confidence}% confidence
                        </span>
                      </div>
                      <Progress value={policy.confidence} className="w-24 h-2" />
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Detail Panel */}
          <div className="space-y-4">
            {selectedPolicy ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="bg-card/50 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {getCategoryIcon(selectedPolicy.category)}
                      Policy Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Projected Outcome</h4>
                      <p className="text-sm text-green-400 bg-green-500/10 rounded-lg p-3">
                        {selectedPolicy.projectedOutcome}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Confidence Score</h4>
                      <div className="flex items-center gap-3">
                        <Progress value={selectedPolicy.confidence} className="flex-1" />
                        <span className="text-lg font-bold text-cyan-400">{selectedPolicy.confidence}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Risk Factors</h4>
                      <div className="space-y-1">
                        {selectedPolicy.risks.map((risk, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-amber-400">
                            <AlertTriangle className="h-3 w-3" />
                            {risk}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-4">
                      <Button className="flex-1" variant="outline">
                        Simulate
                      </Button>
                      <Button className="flex-1">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="bg-card/50 border-dashed">
                <CardContent className="p-8 text-center">
                  <Brain className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Select a policy to view detailed analysis</p>
                </CardContent>
              </Card>
            )}

            {/* AI Insights */}
            <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5" />
                  <p className="text-muted-foreground">Wildlife population up 12% this quarter</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5" />
                  <p className="text-muted-foreground">Poaching risk elevated in northern corridor</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5" />
                  <p className="text-muted-foreground">Tourism revenue tracking 15% above forecast</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PolicyIntelligencePage;
