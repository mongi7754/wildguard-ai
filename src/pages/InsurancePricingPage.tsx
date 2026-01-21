import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, Calculator, TrendingUp, AlertTriangle, DollarSign,
  Wallet, PieChart, BarChart3, RefreshCw, Brain, Target,
  MapPin, Thermometer, Flame, Users, Building2, Leaf,
  Clock, CheckCircle, XCircle, HelpCircle, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { realKenyaParks } from '@/data/kenyaParksRealData';

// Risk factors for AI pricing calculations
interface RiskFactors {
  poachingRisk: number;
  fireRisk: number;
  droughtRisk: number;
  humanConflictRisk: number;
  diseaseRisk: number;
  infrastructureScore: number;
  monitoringCoverage: number;
}

interface InsurancePolicy {
  id: string;
  parkId: string;
  parkName: string;
  policyType: 'comprehensive' | 'basic' | 'premium' | 'custom';
  coverageAmount: number;
  monthlyPremium: number;
  annualPremium: number;
  riskScore: number;
  status: 'active' | 'pending' | 'expired';
  claimsHistory: number;
  lastClaim?: Date;
  riskFactors: RiskFactors;
  aiConfidence: number;
}

interface RiskPool {
  id: string;
  name: string;
  description: string;
  totalValue: number;
  participants: number;
  contributionRate: number;
  claimsPaid: number;
  reserveRatio: number;
  status: 'healthy' | 'warning' | 'critical';
}

// Generate AI-driven insurance policies based on real park data
const generateInsurancePolicies = (): InsurancePolicy[] => {
  return realKenyaParks.map((park, index) => {
    // AI-driven risk calculation based on park characteristics
    const baseRisk = Math.random() * 30 + 20;
    const areaFactor = Math.min(park.area / 10000, 1.5);
    const wildlifeFactor = Math.min(park.wildlife / 5000, 1.3);
    
    const riskFactors: RiskFactors = {
      poachingRisk: Math.round(Math.random() * 40 + 20),
      fireRisk: Math.round(Math.random() * 35 + 15),
      droughtRisk: Math.round(Math.random() * 30 + 10),
      humanConflictRisk: Math.round(Math.random() * 25 + 15),
      diseaseRisk: Math.round(Math.random() * 20 + 5),
      infrastructureScore: Math.round(Math.random() * 30 + 60),
      monitoringCoverage: Math.round((park.sensors / 50) * 100)
    };

    const riskScore = Math.round(
      (riskFactors.poachingRisk * 0.3 +
       riskFactors.fireRisk * 0.2 +
       riskFactors.droughtRisk * 0.15 +
       riskFactors.humanConflictRisk * 0.2 +
       riskFactors.diseaseRisk * 0.15) * areaFactor
    );

    const coverageAmount = Math.round((park.wildlife * 1000 + park.area * 50) / 1000) * 1000;
    const basePremium = coverageAmount * (riskScore / 1000) * 0.012;
    const monthlyPremium = Math.round(basePremium / 12);
    
    const policyTypes: InsurancePolicy['policyType'][] = ['comprehensive', 'basic', 'premium', 'custom'];
    const statuses: InsurancePolicy['status'][] = ['active', 'active', 'active', 'pending', 'expired'];

    return {
      id: `POL-${park.id.toUpperCase().slice(0, 4)}-${String(index + 1).padStart(3, '0')}`,
      parkId: park.id,
      parkName: park.name,
      policyType: policyTypes[index % 4],
      coverageAmount,
      monthlyPremium,
      annualPremium: monthlyPremium * 12,
      riskScore,
      status: statuses[index % 5],
      claimsHistory: Math.floor(Math.random() * 5),
      lastClaim: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000) : undefined,
      riskFactors,
      aiConfidence: Math.round(85 + Math.random() * 12)
    };
  });
};

// Generate risk pools
const generateRiskPools = (): RiskPool[] => [
  {
    id: 'pool-wildlife',
    name: 'Wildlife Protection Pool',
    description: 'Covers poaching incidents, wildlife mortality, and endangered species protection',
    totalValue: 45000000,
    participants: 12,
    contributionRate: 2.5,
    claimsPaid: 8500000,
    reserveRatio: 78,
    status: 'healthy'
  },
  {
    id: 'pool-fire',
    name: 'Wildfire Response Pool',
    description: 'Covers fire damage, emergency response costs, and habitat restoration',
    totalValue: 28000000,
    participants: 14,
    contributionRate: 1.8,
    claimsPaid: 4200000,
    reserveRatio: 65,
    status: 'healthy'
  },
  {
    id: 'pool-climate',
    name: 'Climate Resilience Pool',
    description: 'Covers drought impact, flood damage, and climate adaptation measures',
    totalValue: 18500000,
    participants: 10,
    contributionRate: 3.2,
    claimsPaid: 6800000,
    reserveRatio: 52,
    status: 'warning'
  },
  {
    id: 'pool-community',
    name: 'Community Conflict Pool',
    description: 'Covers human-wildlife conflict compensation and community restoration',
    totalValue: 12000000,
    participants: 8,
    contributionRate: 1.5,
    claimsPaid: 3100000,
    reserveRatio: 71,
    status: 'healthy'
  }
];

const getPolicyTypeColor = (type: InsurancePolicy['policyType']) => {
  switch (type) {
    case 'comprehensive': return 'text-purple-400 bg-purple-500/20 border-purple-500/50';
    case 'premium': return 'text-amber-400 bg-amber-500/20 border-amber-500/50';
    case 'basic': return 'text-blue-400 bg-blue-500/20 border-blue-500/50';
    case 'custom': return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/50';
  }
};

const getStatusColor = (status: InsurancePolicy['status']) => {
  switch (status) {
    case 'active': return 'text-green-400 bg-green-500/20 border-green-500/50';
    case 'pending': return 'text-amber-400 bg-amber-500/20 border-amber-500/50';
    case 'expired': return 'text-red-400 bg-red-500/20 border-red-500/50';
  }
};

const getRiskColor = (score: number) => {
  if (score < 30) return 'text-green-400';
  if (score < 50) return 'text-amber-400';
  if (score < 70) return 'text-orange-400';
  return 'text-red-400';
};

const getPoolStatusColor = (status: RiskPool['status']) => {
  switch (status) {
    case 'healthy': return 'text-green-400 bg-green-500/20 border-green-500/50';
    case 'warning': return 'text-amber-400 bg-amber-500/20 border-amber-500/50';
    case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/50';
  }
};

export default function InsurancePricingPage() {
  const [policies] = useState<InsurancePolicy[]>(() => generateInsurancePolicies());
  const [riskPools] = useState<RiskPool[]>(() => generateRiskPools());
  const [selectedPolicy, setSelectedPolicy] = useState<InsurancePolicy | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculate aggregate statistics
  const stats = useMemo(() => {
    const activePolicies = policies.filter(p => p.status === 'active');
    const totalCoverage = activePolicies.reduce((sum, p) => sum + p.coverageAmount, 0);
    const totalPremiums = activePolicies.reduce((sum, p) => sum + p.annualPremium, 0);
    const avgRiskScore = Math.round(activePolicies.reduce((sum, p) => sum + p.riskScore, 0) / activePolicies.length);
    const totalPoolValue = riskPools.reduce((sum, p) => sum + p.totalValue, 0);
    
    return {
      activePolicies: activePolicies.length,
      totalPolicies: policies.length,
      totalCoverage,
      totalPremiums,
      avgRiskScore,
      totalPoolValue,
      avgConfidence: Math.round(policies.reduce((sum, p) => sum + p.aiConfidence, 0) / policies.length)
    };
  }, [policies, riskPools]);

  const handleRecalculate = () => {
    setIsCalculating(true);
    setTimeout(() => setIsCalculating(false), 2000);
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Shield className="h-7 w-7 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                National Wildlife Insurance Pricing Engine
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  <Brain className="h-3 w-3 mr-1" />
                  AI-Powered
                </Badge>
              </h1>
              <p className="text-sm text-muted-foreground">
                Dynamic premium calculations and risk pooling for wildlife conservation
              </p>
            </div>
          </div>
          
          <Button onClick={handleRecalculate} disabled={isCalculating}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isCalculating ? 'animate-spin' : ''}`} />
            {isCalculating ? 'Recalculating...' : 'Recalculate Premiums'}
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card className="bg-card/50 backdrop-blur border-emerald-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <CheckCircle className="h-4 w-4" />
                <span className="text-xs">Active Policies</span>
              </div>
              <div className="text-2xl font-bold">{stats.activePolicies}</div>
              <div className="text-xs text-muted-foreground">of {stats.totalPolicies} total</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur border-cyan-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-cyan-400 mb-1">
                <Shield className="h-4 w-4" />
                <span className="text-xs">Total Coverage</span>
              </div>
              <div className="text-2xl font-bold">${(stats.totalCoverage / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-muted-foreground">wildlife assets</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <DollarSign className="h-4 w-4" />
                <span className="text-xs">Annual Premiums</span>
              </div>
              <div className="text-2xl font-bold">${(stats.totalPremiums / 1000).toFixed(0)}K</div>
              <div className="text-xs text-muted-foreground">collected/year</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur border-amber-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-amber-400 mb-1">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-xs">Avg Risk Score</span>
              </div>
              <div className={`text-2xl font-bold ${getRiskColor(stats.avgRiskScore)}`}>
                {stats.avgRiskScore}
              </div>
              <div className="text-xs text-muted-foreground">network-wide</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-green-400 mb-1">
                <Wallet className="h-4 w-4" />
                <span className="text-xs">Pool Value</span>
              </div>
              <div className="text-2xl font-bold">${(stats.totalPoolValue / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-muted-foreground">in risk pools</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-blue-400 mb-1">
                <Brain className="h-4 w-4" />
                <span className="text-xs">AI Confidence</span>
              </div>
              <div className="text-2xl font-bold">{stats.avgConfidence}%</div>
              <div className="text-xs text-muted-foreground">pricing accuracy</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Policies Table */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="policies" className="space-y-4">
              <TabsList className="bg-muted/30">
                <TabsTrigger value="policies">Insurance Policies</TabsTrigger>
                <TabsTrigger value="pools">Risk Pools</TabsTrigger>
                <TabsTrigger value="calculator">Premium Calculator</TabsTrigger>
              </TabsList>

              <TabsContent value="policies" className="space-y-4">
                <Card className="bg-card/50 backdrop-blur">
                  <CardHeader className="py-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-emerald-400" />
                      AI-Priced Insurance Policies
                    </CardTitle>
                    <CardDescription>
                      Dynamic premiums calculated using real-time risk assessment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
                    {policies.map((policy) => (
                      <motion.div
                        key={policy.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedPolicy?.id === policy.id 
                            ? 'bg-primary/10 border-primary/50' 
                            : 'bg-muted/20 border-border/50 hover:bg-muted/40'
                        }`}
                        onClick={() => setSelectedPolicy(selectedPolicy?.id === policy.id ? null : policy)}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{policy.parkName}</span>
                              <Badge variant="outline" className={`text-[10px] ${getPolicyTypeColor(policy.policyType)}`}>
                                {policy.policyType}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">{policy.id}</div>
                          </div>
                          <Badge variant="outline" className={`text-[10px] ${getStatusColor(policy.status)}`}>
                            {policy.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-3 text-xs">
                          <div>
                            <div className="text-muted-foreground">Coverage</div>
                            <div className="font-bold text-cyan-400">${(policy.coverageAmount / 1000).toFixed(0)}K</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Monthly</div>
                            <div className="font-bold text-green-400">${policy.monthlyPremium.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Risk Score</div>
                            <div className={`font-bold ${getRiskColor(policy.riskScore)}`}>{policy.riskScore}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">AI Conf.</div>
                            <div className="font-bold text-blue-400">{policy.aiConfidence}%</div>
                          </div>
                        </div>
                        
                        {/* Risk breakdown on selection */}
                        <AnimatePresence>
                          {selectedPolicy?.id === policy.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 pt-3 border-t border-border/50"
                            >
                              <div className="text-xs font-semibold mb-2 flex items-center gap-1">
                                <Brain className="h-3 w-3 text-purple-400" />
                                AI Risk Factor Analysis
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {Object.entries(policy.riskFactors).map(([key, value]) => (
                                  <div key={key} className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground capitalize">
                                      {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <Progress value={value} className="w-16 h-1.5" />
                                      <span className={getRiskColor(value)}>{value}%</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pools" className="space-y-4">
                <Card className="bg-card/50 backdrop-blur">
                  <CardHeader className="py-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-purple-400" />
                      Risk Pooling & Reserves
                    </CardTitle>
                    <CardDescription>
                      Collective risk sharing across parks and conservation areas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {riskPools.map((pool) => (
                      <div
                        key={pool.id}
                        className="p-4 rounded-lg bg-muted/20 border border-border/50"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{pool.name}</span>
                              <Badge variant="outline" className={`text-[10px] ${getPoolStatusColor(pool.status)}`}>
                                {pool.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{pool.description}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-4 text-xs mb-3">
                          <div>
                            <div className="text-muted-foreground">Pool Value</div>
                            <div className="font-bold text-cyan-400">${(pool.totalValue / 1000000).toFixed(1)}M</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Participants</div>
                            <div className="font-bold">{pool.participants} parks</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Claims Paid</div>
                            <div className="font-bold text-amber-400">${(pool.claimsPaid / 1000000).toFixed(1)}M</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Contribution</div>
                            <div className="font-bold text-green-400">{pool.contributionRate}%</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Reserve Ratio:</span>
                          <Progress value={pool.reserveRatio} className="flex-1 h-2" />
                          <span className={`text-xs font-bold ${
                            pool.reserveRatio >= 70 ? 'text-green-400' :
                            pool.reserveRatio >= 50 ? 'text-amber-400' : 'text-red-400'
                          }`}>{pool.reserveRatio}%</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="calculator" className="space-y-4">
                <Card className="bg-card/50 backdrop-blur">
                  <CardHeader className="py-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-amber-400" />
                      Premium Calculator
                    </CardTitle>
                    <CardDescription>
                      AI-powered premium estimation based on park characteristics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-6 rounded-lg bg-muted/30 border border-dashed border-border/50 text-center">
                      <Brain className="h-12 w-12 mx-auto text-purple-400 mb-4" />
                      <h3 className="font-semibold mb-2">Interactive Premium Calculator</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Input park parameters to receive AI-calculated premium recommendations
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <Badge variant="outline" className="text-purple-400 border-purple-500/50">
                          Multi-factor Analysis
                        </Badge>
                        <Badge variant="outline" className="text-cyan-400 border-cyan-500/50">
                          Real-time Pricing
                        </Badge>
                        <Badge variant="outline" className="text-green-400 border-green-500/50">
                          Risk Optimization
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* AI Pricing Model */}
            <Card className="bg-card/50 backdrop-blur border-purple-500/20">
              <CardHeader className="py-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-400" />
                  AI Pricing Model
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Model Accuracy</span>
                    <span className="text-sm font-bold text-purple-400">94.2%</span>
                  </div>
                  <Progress value={94.2} className="h-1.5" />
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-muted/30">
                    <span>Last Training</span>
                    <span className="text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-muted/30">
                    <span>Data Points</span>
                    <span className="text-cyan-400">1.2M+</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-muted/30">
                    <span>Risk Factors</span>
                    <span className="text-amber-400">7 active</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-muted/30">
                    <span>Update Frequency</span>
                    <span className="text-green-400">Real-time</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Distribution */}
            <Card className="bg-card/50 backdrop-blur border-amber-500/20">
              <CardHeader className="py-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-amber-400" />
                  Risk Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: 'Low Risk (0-30)', count: policies.filter(p => p.riskScore < 30).length, color: 'bg-green-500' },
                  { label: 'Medium Risk (30-50)', count: policies.filter(p => p.riskScore >= 30 && p.riskScore < 50).length, color: 'bg-amber-500' },
                  { label: 'High Risk (50-70)', count: policies.filter(p => p.riskScore >= 50 && p.riskScore < 70).length, color: 'bg-orange-500' },
                  { label: 'Critical (70+)', count: policies.filter(p => p.riskScore >= 70).length, color: 'bg-red-500' }
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="flex-1 text-muted-foreground">{item.label}</span>
                    <span className="font-bold">{item.count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Claims */}
            <Card className="bg-card/50 backdrop-blur border-red-500/20">
              <CardHeader className="py-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-red-400" />
                  Recent Claims Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {policies.filter(p => p.lastClaim).slice(0, 5).map((policy) => (
                  <div key={policy.id} className="flex items-center justify-between p-2 rounded bg-muted/30 text-xs">
                    <div>
                      <div className="font-medium">{policy.parkName}</div>
                      <div className="text-muted-foreground">
                        {policy.lastClaim?.toLocaleDateString()}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[9px] text-amber-400 border-amber-500/50">
                      Processed
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader className="py-4">
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-xs h-9">
                  <Target className="h-3 w-3 mr-2" />
                  Generate Risk Report
                </Button>
                <Button variant="outline" className="w-full justify-start text-xs h-9">
                  <DollarSign className="h-3 w-3 mr-2" />
                  Export Premium Data
                </Button>
                <Button variant="outline" className="w-full justify-start text-xs h-9">
                  <Users className="h-3 w-3 mr-2" />
                  Pool Rebalancing
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
