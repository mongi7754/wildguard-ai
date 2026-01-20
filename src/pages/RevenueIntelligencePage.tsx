import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, TrendingUp, TrendingDown, AlertTriangle,
  BarChart3, PieChart, Calendar, MapPin, Users, Ticket,
  CreditCard, Smartphone, Globe, ArrowUpRight, ArrowDownRight,
  Sparkles, Target, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 245, target: 230, tourism: 180, fees: 65 },
  { month: 'Feb', revenue: 268, target: 245, tourism: 195, fees: 73 },
  { month: 'Mar', revenue: 312, target: 280, tourism: 230, fees: 82 },
  { month: 'Apr', revenue: 298, target: 290, tourism: 215, fees: 83 },
  { month: 'May', revenue: 356, target: 320, tourism: 268, fees: 88 },
  { month: 'Jun', revenue: 389, target: 350, tourism: 295, fees: 94 },
  { month: 'Jul', revenue: 478, target: 420, tourism: 368, fees: 110 },
  { month: 'Aug', revenue: 512, target: 450, tourism: 398, fees: 114 },
  { month: 'Sep', revenue: 445, target: 400, tourism: 340, fees: 105 },
  { month: 'Oct', revenue: 398, target: 380, tourism: 298, fees: 100 },
  { month: 'Nov', revenue: 325, target: 310, tourism: 245, fees: 80 },
  { month: 'Dec', revenue: 367, target: 340, tourism: 280, fees: 87 }
];

const parkRevenue = [
  { park: 'Maasai Mara', revenue: 1.8, growth: 15.2 },
  { park: 'Amboseli', revenue: 0.92, growth: 8.7 },
  { park: 'Tsavo', revenue: 0.78, growth: -2.3 },
  { park: 'Lake Nakuru', revenue: 0.45, growth: 12.1 },
  { park: 'Mt Kenya', revenue: 0.38, growth: 6.8 }
];

const fraudAlerts = [
  { id: 1, type: 'Duplicate Ticket', location: 'Maasai Mara Gate 3', amount: 45000, severity: 'high' },
  { id: 2, type: 'Revenue Mismatch', location: 'Amboseli Main', amount: 128000, severity: 'medium' },
  { id: 3, type: 'Unusual Pattern', location: 'Tsavo West', amount: 23000, severity: 'low' }
];

const RevenueIntelligencePage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30">
              <DollarSign className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Revenue & Economic Intelligence</h1>
              <p className="text-sm text-muted-foreground">
                AI-powered revenue optimization and fraud detection
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.4% YoY
            </Badge>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Total Revenue (YTD)</span>
                  <DollarSign className="h-4 w-4 text-green-400" />
                </div>
                <p className="text-3xl font-bold text-green-400">KES 4.39B</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-green-400">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>12.4% vs last year</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Monthly Average</span>
                  <BarChart3 className="h-4 w-4 text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-blue-400">KES 366M</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-blue-400">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>8.2% above target</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Tourist Visitors</span>
                  <Users className="h-4 w-4 text-purple-400" />
                </div>
                <p className="text-3xl font-bold text-purple-400">2.4M</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-purple-400">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>18.7% growth</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Fraud Prevented</span>
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                </div>
                <p className="text-3xl font-bold text-amber-400">KES 89M</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-amber-400">
                  <Sparkles className="h-3 w-3" />
                  <span>AI Detection Active</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-6">
          {/* Revenue Trend */}
          <Card className="col-span-2 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  Revenue Performance
                </span>
                <div className="flex gap-2">
                  {['daily', 'weekly', 'monthly'].map((period) => (
                    <Button
                      key={period}
                      variant={selectedPeriod === period ? 'secondary' : 'ghost'}
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setSelectedPeriod(period)}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </Button>
                  ))}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#22c55e" fill="#22c55e20" strokeWidth={2} />
                    <Area type="monotone" dataKey="target" stroke="#6366f1" fill="#6366f120" strokeWidth={2} strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Park Revenue Breakdown */}
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-400" />
                Revenue by Park
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {parkRevenue.map((park, index) => (
                <motion.div
                  key={park.park}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/20"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{park.park}</p>
                    <p className="text-xs text-muted-foreground">KES {park.revenue}B</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={park.growth >= 0 
                      ? 'text-green-400 border-green-500/50' 
                      : 'text-red-400 border-red-500/50'
                    }
                  >
                    {park.growth >= 0 ? '+' : ''}{park.growth}%
                  </Badge>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Fraud Detection & AI Pricing */}
        <div className="grid grid-cols-2 gap-6">
          {/* Fraud Alerts */}
          <Card className="bg-card/50 border-amber-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                AI Fraud Detection Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {fraudAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg border ${
                    alert.severity === 'high' 
                      ? 'bg-red-500/10 border-red-500/30' 
                      : alert.severity === 'medium'
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-blue-500/10 border-blue-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Badge 
                      variant="outline"
                      className={
                        alert.severity === 'high' 
                          ? 'text-red-400 border-red-500/50' 
                          : alert.severity === 'medium'
                          ? 'text-amber-400 border-amber-500/50'
                          : 'text-blue-400 border-blue-500/50'
                      }
                    >
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{alert.location}</span>
                  </div>
                  <p className="text-sm font-medium">{alert.type}</p>
                  <p className="text-xs text-muted-foreground">
                    Potential loss: <span className="text-amber-400 font-medium">KES {alert.amount.toLocaleString()}</span>
                  </p>
                </motion.div>
              ))}
              <Button variant="outline" className="w-full mt-2">
                View All Alerts
              </Button>
            </CardContent>
          </Card>

          {/* Dynamic Pricing */}
          <Card className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                AI Dynamic Pricing Engine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted/20 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Current Price Index</p>
                  <p className="text-2xl font-bold text-purple-400">1.15x</p>
                  <Badge className="bg-green-500/20 text-green-400 text-[10px] mt-1">Peak Season</Badge>
                </div>
                <div className="p-3 rounded-lg bg-muted/20 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Revenue Uplift</p>
                  <p className="text-2xl font-bold text-green-400">+18%</p>
                  <Badge className="bg-purple-500/20 text-purple-400 text-[10px] mt-1">AI Optimized</Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Demand Elasticity</span>
                  <span className="font-medium">0.35</span>
                </div>
                <Progress value={35} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Occupancy Rate</span>
                  <span className="font-medium text-green-400">87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
              
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-medium text-green-400">AI Recommendation</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Increase Maasai Mara entry fee by 12% during Aug-Sep migration peak. 
                  Projected additional revenue: KES 45M
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods */}
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-cyan-400" />
              Payment Channels Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
                <Smartphone className="h-8 w-8 mx-auto mb-2 text-green-400" />
                <p className="text-sm font-medium">M-Pesa</p>
                <p className="text-2xl font-bold text-green-400">62%</p>
                <p className="text-xs text-muted-foreground">KES 2.72B</p>
              </div>
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-center">
                <CreditCard className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                <p className="text-sm font-medium">Card</p>
                <p className="text-2xl font-bold text-blue-400">28%</p>
                <p className="text-xs text-muted-foreground">KES 1.23B</p>
              </div>
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30 text-center">
                <Globe className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                <p className="text-sm font-medium">Online</p>
                <p className="text-2xl font-bold text-purple-400">8%</p>
                <p className="text-xs text-muted-foreground">KES 351M</p>
              </div>
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-center">
                <Ticket className="h-8 w-8 mx-auto mb-2 text-amber-400" />
                <p className="text-sm font-medium">Cash</p>
                <p className="text-2xl font-bold text-amber-400">2%</p>
                <p className="text-xs text-muted-foreground">KES 88M</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default RevenueIntelligencePage;
