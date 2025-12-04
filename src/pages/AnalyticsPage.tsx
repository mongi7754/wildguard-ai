import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartPie,
  Pie,
  Cell
} from 'recharts';

const wildlifeData = [
  { name: 'Mon', elephants: 45, lions: 12, rhinos: 8 },
  { name: 'Tue', elephants: 52, lions: 14, rhinos: 7 },
  { name: 'Wed', elephants: 48, lions: 11, rhinos: 9 },
  { name: 'Thu', elephants: 47, lions: 13, rhinos: 8 },
  { name: 'Fri', elephants: 55, lions: 15, rhinos: 10 },
  { name: 'Sat', elephants: 50, lions: 12, rhinos: 8 },
  { name: 'Sun', elephants: 47, lions: 12, rhinos: 8 },
];

const threatData = [
  { name: 'Poaching', value: 12, color: 'hsl(0, 72%, 51%)' },
  { name: 'Fire', value: 8, color: 'hsl(35, 90%, 55%)' },
  { name: 'Intrusion', value: 15, color: 'hsl(200, 15%, 40%)' },
  { name: 'Environmental', value: 5, color: 'hsl(150, 60%, 45%)' },
];

const patrolData = [
  { sector: 'North', coverage: 95 },
  { sector: 'South', coverage: 88 },
  { sector: 'East', coverage: 92 },
  { sector: 'West', coverage: 78 },
  { sector: 'Central', coverage: 100 },
];

const stats = [
  { 
    label: 'Detection Rate',
    value: '94.7%',
    change: 2.3,
    positive: true,
    icon: Activity
  },
  { 
    label: 'Threats Resolved',
    value: '87%',
    change: 5.1,
    positive: true,
    icon: TrendingUp
  },
  { 
    label: 'Avg Response Time',
    value: '4.2min',
    change: -12,
    positive: true,
    icon: TrendingDown
  },
  { 
    label: 'Area Coverage',
    value: '2,450 km²',
    change: 0,
    positive: true,
    icon: BarChart3
  },
];

export default function AnalyticsPage() {
  return (
    <AppLayout title="Analytics">
      <div className="px-4 py-4 space-y-4">
        {/* Time Range */}
        <div className="flex items-center justify-between">
          <Badge variant="tactical" className="gap-1">
            <Calendar className="w-3 h-3" />
            Last 7 Days
          </Badge>
          <Badge variant="outline">Live Data</Badge>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card variant="tactical" className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-4 h-4 text-muted-foreground" />
                  {stat.change !== 0 && (
                    <span className={`text-xs flex items-center gap-0.5 ${stat.positive ? 'text-success' : 'text-danger'}`}>
                      {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {Math.abs(stat.change)}%
                    </span>
                  )}
                </div>
                <p className="text-xl font-display font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Wildlife Trends */}
        <Card variant="tactical">
          <CardHeader>
            <CardTitle className="text-sm">Wildlife Detections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={wildlifeData}>
                  <defs>
                    <linearGradient id="colorElephants" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(150, 60%, 45%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(150, 60%, 45%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 25%, 18%)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(150, 15%, 55%)" 
                    fontSize={10}
                  />
                  <YAxis 
                    stroke="hsl(150, 15%, 55%)" 
                    fontSize={10}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(160, 25%, 8%)', 
                      border: '1px solid hsl(160, 25%, 18%)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="elephants" 
                    stroke="hsl(150, 60%, 45%)" 
                    fillOpacity={1} 
                    fill="url(#colorElephants)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Threat Distribution */}
        <Card variant="tactical">
          <CardHeader>
            <CardTitle className="text-sm">Threat Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="h-32 w-32">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartPie>
                    <Pie
                      data={threatData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {threatData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </RechartPie>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {threatData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs">{item.name}</span>
                    </div>
                    <span className="text-xs font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patrol Coverage */}
        <Card variant="tactical">
          <CardHeader>
            <CardTitle className="text-sm">Patrol Coverage by Sector</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={patrolData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 25%, 18%)" />
                  <XAxis 
                    type="number" 
                    stroke="hsl(150, 15%, 55%)" 
                    fontSize={10}
                    domain={[0, 100]}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="sector" 
                    stroke="hsl(150, 15%, 55%)" 
                    fontSize={10}
                    width={50}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(160, 25%, 8%)', 
                      border: '1px solid hsl(160, 25%, 18%)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => [`${value}%`, 'Coverage']}
                  />
                  <Bar 
                    dataKey="coverage" 
                    fill="hsl(150, 60%, 45%)" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card variant="glow" className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">AI Insight</p>
              <p className="text-xs text-muted-foreground mt-1">
                Poaching activity patterns suggest increased risk in the Northern sector 
                during early morning hours (4-6 AM). Consider adjusting drone patrol schedules.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
