import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield,
  AlertTriangle,
  Activity,
  Lock,
  Eye,
  Server,
  Database,
  Cloud,
  Wifi,
  Key,
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  Terminal,
  Fingerprint,
  Radio
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface SecurityEvent {
  id: string;
  type: 'threat_detected' | 'access_attempt' | 'anomaly' | 'resolved' | 'info';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  source: string;
  timestamp: Date;
  status: 'active' | 'investigating' | 'resolved';
}

interface SystemHealth {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  lastCheck: Date;
}

const mockEvents: SecurityEvent[] = [
  { id: '1', type: 'access_attempt', severity: 'medium', message: 'Failed login attempt from unknown IP', source: 'Auth Gateway', timestamp: new Date(Date.now() - 5 * 60000), status: 'resolved' },
  { id: '2', type: 'anomaly', severity: 'low', message: 'Unusual API call pattern detected', source: 'API Monitor', timestamp: new Date(Date.now() - 15 * 60000), status: 'investigating' },
  { id: '3', type: 'info', severity: 'low', message: 'Scheduled security scan completed', source: 'Scanner', timestamp: new Date(Date.now() - 30 * 60000), status: 'resolved' },
  { id: '4', type: 'resolved', severity: 'medium', message: 'Rate limiting triggered and contained', source: 'Firewall', timestamp: new Date(Date.now() - 45 * 60000), status: 'resolved' },
  { id: '5', type: 'threat_detected', severity: 'high', message: 'Potential SQL injection attempt blocked', source: 'WAF', timestamp: new Date(Date.now() - 60 * 60000), status: 'resolved' },
];

const systemHealth: SystemHealth[] = [
  { name: 'AI Pipeline', status: 'healthy', uptime: 99.99, lastCheck: new Date() },
  { name: 'Database Cluster', status: 'healthy', uptime: 99.95, lastCheck: new Date() },
  { name: 'API Gateway', status: 'healthy', uptime: 100, lastCheck: new Date() },
  { name: 'Satellite Link', status: 'warning', uptime: 98.5, lastCheck: new Date() },
  { name: 'Edge Functions', status: 'healthy', uptime: 99.9, lastCheck: new Date() },
  { name: 'Sensor Network', status: 'healthy', uptime: 99.7, lastCheck: new Date() },
];

const severityColors = {
  critical: 'text-danger bg-danger/20 border-danger/50',
  high: 'text-orange-400 bg-orange-500/20 border-orange-500/50',
  medium: 'text-accent bg-accent/20 border-accent/50',
  low: 'text-success bg-success/20 border-success/50',
};

const statusIcons = {
  healthy: <ShieldCheck className="w-4 h-4 text-success" />,
  warning: <ShieldAlert className="w-4 h-4 text-accent" />,
  critical: <AlertTriangle className="w-4 h-4 text-danger" />,
};

export default function CyberSecurityPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [threatLevel, setThreatLevel] = useState(12);
  const [events, setEvents] = useState(mockEvents);
  
  const runSecurityScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const getTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <AppLayout title="Cyber Defense">
      <div className="px-4 py-4 space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-3">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-xl font-bold">Cyber Defense Center</h2>
          <p className="text-sm text-muted-foreground mt-1">
            AI-powered security monitoring & threat response
          </p>
        </motion.div>

        {/* Security Status Overview */}
        <div className="grid grid-cols-3 gap-3">
          <Card variant="glow" className="p-3 text-center">
            <ShieldCheck className="w-6 h-6 text-success mx-auto mb-1" />
            <p className="text-xl font-bold text-success">SECURE</p>
            <p className="text-[10px] text-muted-foreground">System Status</p>
          </Card>
          <Card variant="tactical" className="p-3 text-center">
            <Activity className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="text-xl font-bold">{threatLevel}%</p>
            <p className="text-[10px] text-muted-foreground">Threat Level</p>
          </Card>
          <Card variant="tactical" className="p-3 text-center">
            <Eye className="w-6 h-6 text-accent mx-auto mb-1" />
            <p className="text-xl font-bold">24/7</p>
            <p className="text-[10px] text-muted-foreground">Monitoring</p>
          </Card>
        </div>

        {/* Security Scan */}
        <Card variant="tactical">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Terminal className="w-4 h-4 text-primary" />
                Security Scanner
              </CardTitle>
              <Badge variant="success">Auto-Scan: ON</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="glow" 
              className="w-full"
              onClick={runSecurityScan}
              disabled={isScanning}
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", isScanning && "animate-spin")} />
              {isScanning ? 'Scanning...' : 'Run Security Scan'}
            </Button>
            
            <AnimatePresence>
              {isScanning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Progress value={scanProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Scanning infrastructure... {scanProgress}%
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* System Health Grid */}
        <Card variant="tactical">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Server className="w-4 h-4 text-primary" />
              Infrastructure Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {systemHealth.map((system) => (
                <div
                  key={system.name}
                  className={cn(
                    "p-3 rounded-lg border transition-colors",
                    system.status === 'healthy' && "bg-success/5 border-success/30",
                    system.status === 'warning' && "bg-accent/10 border-accent/30",
                    system.status === 'critical' && "bg-danger/10 border-danger/30"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium truncate">{system.name}</span>
                    {statusIcons[system.status]}
                  </div>
                  <p className="text-lg font-bold">{system.uptime}%</p>
                  <p className="text-[10px] text-muted-foreground">Uptime</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <Card variant="tactical" className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Lock className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Zero-Trust</span>
            </div>
            <Badge variant="success" className="w-full justify-center">ENFORCED</Badge>
          </Card>
          <Card variant="tactical" className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Key className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Encryption</span>
            </div>
            <Badge variant="success" className="w-full justify-center">AES-256</Badge>
          </Card>
          <Card variant="tactical" className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Fingerprint className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Auth Status</span>
            </div>
            <Badge variant="success" className="w-full justify-center">MFA ACTIVE</Badge>
          </Card>
          <Card variant="tactical" className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Radio className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Firewall</span>
            </div>
            <Badge variant="success" className="w-full justify-center">ONLINE</Badge>
          </Card>
        </div>

        {/* Recent Security Events */}
        <Card variant="tactical">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-accent" />
                Security Events
              </CardTitle>
              <Badge variant="tactical">{events.length} events</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 max-h-64 overflow-y-auto">
            {events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "p-3 rounded-lg border flex items-start gap-3",
                  severityColors[event.severity]
                )}
              >
                <div className="shrink-0 mt-0.5">
                  {event.type === 'threat_detected' && <ShieldAlert className="w-4 h-4" />}
                  {event.type === 'access_attempt' && <Lock className="w-4 h-4" />}
                  {event.type === 'anomaly' && <Activity className="w-4 h-4" />}
                  {event.type === 'resolved' && <ShieldCheck className="w-4 h-4" />}
                  {event.type === 'info' && <Eye className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{event.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] opacity-70">{event.source}</span>
                    <span className="text-[10px] opacity-50">•</span>
                    <span className="text-[10px] opacity-50">{getTimeAgo(event.timestamp)}</span>
                  </div>
                </div>
                <Badge 
                  variant={event.status === 'resolved' ? 'success' : event.status === 'investigating' ? 'warning' : 'danger'}
                  className="text-[10px] shrink-0"
                >
                  {event.status}
                </Badge>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* AI Defense Status */}
        <Card variant="glow" className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">AI Cyber Defense Active</p>
              <p className="text-xs text-muted-foreground mt-1">
                AICSDO (AI Cyber Security Defense Officer) is continuously monitoring 
                all systems for threats, anomalies, and unauthorized access attempts. 
                Zero-trust architecture enforced across all endpoints.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
