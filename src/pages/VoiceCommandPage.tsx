import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mic,
  Radio,
  Shield,
  Plane,
  MapPin,
  AlertTriangle,
  Volume2,
  Settings,
  History
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VoiceCommandInterface } from '@/components/voice/VoiceCommandInterface';
import { cn } from '@/lib/utils';

const quickCommands = [
  { id: 1, command: 'Any threats nearby?', icon: AlertTriangle, category: 'Threats' },
  { id: 2, command: 'Where are the elephants?', icon: MapPin, category: 'Wildlife' },
  { id: 3, command: 'Deploy drone to sector 7', icon: Plane, category: 'Drones' },
  { id: 4, command: 'Alert status report', icon: Radio, category: 'Status' },
  { id: 5, command: 'Patrol recommendations', icon: Shield, category: 'Patrol' },
  { id: 6, command: 'Weather conditions', icon: Settings, category: 'Environment' }
];

const recentCommands = [
  { command: 'Deploy drone to watering hole', time: '2 min ago', status: 'completed' },
  { command: 'Locate rhino herd', time: '15 min ago', status: 'completed' },
  { command: 'Threat status in sector 3', time: '1 hour ago', status: 'completed' }
];

export default function VoiceCommandPage() {
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const context = {
    park: 'Masai Mara',
    activeDrones: 3,
    alertCount: 2,
    rangersActive: 5
  };

  return (
    <AppLayout title="Voice Commander">
      <div className="px-4 py-4 space-y-4">
        {/* Hero Section */}
        <Card variant="glow" className="overflow-hidden">
          <div className="relative p-6 text-center">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                  background: [
                    'radial-gradient(circle at 30% 50%, hsl(var(--primary)) 0%, transparent 50%)',
                    'radial-gradient(circle at 70% 50%, hsl(var(--primary)) 0%, transparent 50%)',
                    'radial-gradient(circle at 30% 50%, hsl(var(--primary)) 0%, transparent 50%)'
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </div>

            <div className="relative z-10">
              <motion.div
                className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Mic className="w-12 h-12 text-primary" />
              </motion.div>

              <h2 className="font-display font-bold text-xl mb-2">Voice-First Interface</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Hands-free field operations with natural language commands
              </p>

              <Button
                variant="glow"
                size="lg"
                className="gap-2"
                onClick={() => setIsVoiceActive(true)}
              >
                <Radio className="w-5 h-5" />
                Activate Voice Commander
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Commands */}
        <Card variant="tactical">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-primary" />
              Quick Commands
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {quickCommands.map((cmd) => (
                <motion.div
                  key={cmd.id}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    className="w-full h-auto py-3 flex-col gap-2 text-left"
                    onClick={() => setIsVoiceActive(true)}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <cmd.icon className="w-4 h-4 text-primary" />
                      <Badge variant="secondary" className="text-[10px] ml-auto">
                        {cmd.category}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground w-full">
                      "{cmd.command}"
                    </span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Capabilities */}
        <Card variant="tactical">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Voice Capabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Threat Detection</h4>
                  <p className="text-xs text-muted-foreground">
                    Ask about nearby threats, alerts, and suspicious activity
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Wildlife Location</h4>
                  <p className="text-xs text-muted-foreground">
                    Locate elephant herds, rhinos, lions, and other tracked species
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Plane className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Drone Deployment</h4>
                  <p className="text-xs text-muted-foreground">
                    Deploy drones for patrol, investigation, or tracking missions
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-danger/20 flex items-center justify-center flex-shrink-0">
                  <Radio className="w-4 h-4 text-danger" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Alert Broadcasting</h4>
                  <p className="text-xs text-muted-foreground">
                    Send alerts to ranger teams with voice commands
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Commands */}
        <Card variant="tactical">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <History className="w-4 h-4 text-primary" />
              Recent Commands
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentCommands.map((cmd, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">"{cmd.command}"</p>
                    <p className="text-xs text-muted-foreground">{cmd.time}</p>
                  </div>
                  <Badge variant="success" className="text-[10px]">
                    {cmd.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Voice Command Overlay */}
      <VoiceCommandInterface
        isOpen={isVoiceActive}
        onClose={() => setIsVoiceActive(false)}
        context={context}
      />
    </AppLayout>
  );
}
