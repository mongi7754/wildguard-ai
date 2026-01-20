import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, FileText, DollarSign, Clock, CheckCircle2,
  AlertTriangle, MapPin, Phone, Search, Filter,
  MessageSquare, Shield, TrendingUp, Award, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CompensationClaim {
  id: string;
  claimNumber: string;
  type: 'crop_damage' | 'livestock_loss' | 'property_damage' | 'injury';
  claimant: {
    name: string;
    phone: string;
    county: string;
    village: string;
  };
  incident: {
    date: Date;
    animal: string;
    description: string;
    location: { lat: number; lng: number };
  };
  amount: number;
  status: 'pending' | 'reviewing' | 'approved' | 'paid' | 'rejected';
  aiConfidence: number;
  fraudRisk: 'low' | 'medium' | 'high';
  submittedAt: Date;
  processedAt?: Date;
}

const mockClaims: CompensationClaim[] = [
  {
    id: 'clm-1',
    claimNumber: 'KWS-COMP-2024-00456',
    type: 'crop_damage',
    claimant: {
      name: 'James Kiprop',
      phone: '+254 712 345 678',
      county: 'Narok',
      village: 'Mara Springs'
    },
    incident: {
      date: new Date('2024-01-10'),
      animal: 'Elephant',
      description: 'Three elephants damaged 2 acres of maize crop at night.',
      location: { lat: -1.4567, lng: 35.1234 }
    },
    amount: 85000,
    status: 'approved',
    aiConfidence: 92,
    fraudRisk: 'low',
    submittedAt: new Date('2024-01-11'),
    processedAt: new Date('2024-01-14')
  },
  {
    id: 'clm-2',
    claimNumber: 'KWS-COMP-2024-00457',
    type: 'livestock_loss',
    claimant: {
      name: 'Mary Wanjiku',
      phone: '+254 723 456 789',
      county: 'Laikipia',
      village: 'Nanyuki West'
    },
    incident: {
      date: new Date('2024-01-12'),
      animal: 'Lion',
      description: 'Lion attack killed 3 goats from enclosed boma at night.',
      location: { lat: 0.0123, lng: 37.0456 }
    },
    amount: 45000,
    status: 'reviewing',
    aiConfidence: 78,
    fraudRisk: 'medium',
    submittedAt: new Date('2024-01-13')
  },
  {
    id: 'clm-3',
    claimNumber: 'KWS-COMP-2024-00458',
    type: 'property_damage',
    claimant: {
      name: 'Peter Ochieng',
      phone: '+254 734 567 890',
      county: 'Kajiado',
      village: 'Amboseli Gate'
    },
    incident: {
      date: new Date('2024-01-14'),
      animal: 'Elephant',
      description: 'Elephants destroyed water tank and fence during drought.',
      location: { lat: -2.6543, lng: 37.2876 }
    },
    amount: 120000,
    status: 'pending',
    aiConfidence: 85,
    fraudRisk: 'low',
    submittedAt: new Date('2024-01-15')
  },
  {
    id: 'clm-4',
    claimNumber: 'KWS-COMP-2024-00459',
    type: 'injury',
    claimant: {
      name: 'Sarah Mutua',
      phone: '+254 745 678 901',
      county: 'Taita Taveta',
      village: 'Tsavo Gate'
    },
    incident: {
      date: new Date('2024-01-08'),
      animal: 'Buffalo',
      description: 'Buffalo charged and injured farmer while protecting crops.',
      location: { lat: -3.0987, lng: 38.5432 }
    },
    amount: 250000,
    status: 'paid',
    aiConfidence: 95,
    fraudRisk: 'low',
    submittedAt: new Date('2024-01-09'),
    processedAt: new Date('2024-01-12')
  }
];

const CommunityServicePage = () => {
  const [selectedClaim, setSelectedClaim] = useState<CompensationClaim | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-400 bg-green-500/20 border-green-500/50';
      case 'approved': return 'text-blue-400 bg-blue-500/20 border-blue-500/50';
      case 'reviewing': return 'text-amber-400 bg-amber-500/20 border-amber-500/50';
      case 'pending': return 'text-purple-400 bg-purple-500/20 border-purple-500/50';
      case 'rejected': return 'text-red-400 bg-red-500/20 border-red-500/50';
      default: return 'text-muted-foreground';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'crop_damage': return 'Crop Damage';
      case 'livestock_loss': return 'Livestock Loss';
      case 'property_damage': return 'Property Damage';
      case 'injury': return 'Injury';
      default: return type;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-amber-400';
      case 'high': return 'text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  const filteredClaims = mockClaims.filter(claim => {
    if (activeTab !== 'all' && claim.status !== activeTab) return false;
    if (searchQuery) {
      return claim.claimNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
             claim.claimant.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Community & Compensation Service</h1>
              <p className="text-sm text-muted-foreground">
                AI-powered wildlife conflict compensation management
              </p>
            </div>
          </div>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            New Claim
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4">
          <Card className="bg-card/50 border-blue-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-blue-400">2,847</p>
              <p className="text-xs text-muted-foreground">Total Claims (2024)</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-green-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-green-400">KES 156M</p>
              <p className="text-xs text-muted-foreground">Paid Out</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-purple-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-purple-400">4.2 days</p>
              <p className="text-xs text-muted-foreground">Avg. Processing</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-amber-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-amber-400">342</p>
              <p className="text-xs text-muted-foreground">Pending Review</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-red-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-red-400">12</p>
              <p className="text-xs text-muted-foreground">Fraud Flagged</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs & Search */}
        <div className="flex items-center justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Claims</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="reviewing">Reviewing</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search claims..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Claims Grid */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-3">
            <AnimatePresence>
              {filteredClaims.map((claim, index) => (
                <motion.div
                  key={claim.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all ${
                      selectedClaim?.id === claim.id 
                        ? 'bg-primary/10 border-primary/50' 
                        : 'bg-card/50 hover:bg-card/80'
                    }`}
                    onClick={() => setSelectedClaim(claim)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs text-cyan-400">{claim.claimNumber}</span>
                            <Badge variant="outline" className={getStatusColor(claim.status)}>
                              {claim.status}
                            </Badge>
                            <Badge variant="outline" className="text-muted-foreground">
                              {getTypeLabel(claim.type)}
                            </Badge>
                          </div>
                          <h3 className="font-semibold">{claim.claimant.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {claim.incident.animal} - {claim.incident.description.slice(0, 60)}...
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {claim.claimant.county}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {claim.submittedAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-400">
                            KES {claim.amount.toLocaleString()}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-muted-foreground">AI Confidence:</span>
                            <span className="text-xs font-medium text-cyan-400">{claim.aiConfidence}%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">Fraud Risk:</span>
                            <span className={`text-xs font-medium ${getRiskColor(claim.fraudRisk)}`}>
                              {claim.fraudRisk}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Detail Panel */}
          <div>
            {selectedClaim ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <Card className="bg-card/50 border-blue-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                      <span>Claim Details</span>
                      <Badge className={getStatusColor(selectedClaim.status)}>
                        {selectedClaim.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Claimant</p>
                      <p className="font-semibold">{selectedClaim.claimant.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedClaim.claimant.phone}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">County</p>
                        <p className="font-medium">{selectedClaim.claimant.county}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Village</p>
                        <p className="font-medium">{selectedClaim.claimant.village}</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-border/50 pt-3">
                      <p className="text-xs text-muted-foreground mb-1">Incident Details</p>
                      <p className="text-sm">{selectedClaim.incident.description}</p>
                    </div>
                    
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">AI Assessment</span>
                        <span className="text-cyan-400 font-bold">{selectedClaim.aiConfidence}%</span>
                      </div>
                      <Progress value={selectedClaim.aiConfidence} className="h-2" />
                    </div>
                    
                    <div className="flex gap-2">
                      {selectedClaim.status === 'pending' || selectedClaim.status === 'reviewing' ? (
                        <>
                          <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive" className="flex-1">
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" variant="outline" className="flex-1">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Contact
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Community Score */}
                <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Award className="h-4 w-4 text-amber-400" />
                      Community Conservation Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="text-3xl font-bold text-amber-400">78</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1 mb-1">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} className={`h-4 w-4 ${i <= 4 ? 'text-amber-400 fill-amber-400' : 'text-muted'}`} />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">Good standing - Eligible for fast-track</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="bg-card/50 border-dashed h-[400px] flex items-center justify-center">
                <CardContent className="text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Select a claim to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CommunityServicePage;
