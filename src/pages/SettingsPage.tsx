import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User,
  Shield,
  Bell,
  Lock,
  Smartphone,
  Globe,
  Moon,
  LogOut,
  ChevronRight,
  Fingerprint,
  Key,
  Users,
  Database,
  Wifi
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

const settingGroups = [
  {
    title: 'Account',
    items: [
      { icon: User, label: 'Profile', description: 'Manage your profile', badge: null },
      { icon: Shield, label: 'Role', description: 'Admin Access', badge: 'Admin' },
      { icon: Lock, label: 'Security', description: 'Password & 2FA', badge: null },
    ]
  },
  {
    title: 'Security',
    items: [
      { icon: Fingerprint, label: 'Biometric Login', description: 'Use fingerprint or face', toggle: true },
      { icon: Key, label: 'API Keys', description: 'Manage API access', badge: '3 active' },
      { icon: Users, label: 'Team Access', description: 'Manage permissions', badge: null },
    ]
  },
  {
    title: 'System',
    items: [
      { icon: Bell, label: 'Notifications', description: 'Alert preferences', badge: null },
      { icon: Database, label: 'Offline Mode', description: 'Cache data locally', toggle: true },
      { icon: Wifi, label: 'Sync Status', description: 'Last sync: 2 min ago', badge: 'Connected' },
      { icon: Globe, label: 'Language', description: 'English (US)', badge: null },
    ]
  }
];

export default function SettingsPage() {
  const [biometric, setBiometric] = useState(true);
  const [offline, setOffline] = useState(false);

  return (
    <AppLayout title="Settings">
      <div className="px-4 py-4 space-y-6">
        {/* User Profile Card */}
        <Card variant="glow">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-forest flex items-center justify-center">
                <User className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold">John Ranger</h3>
                <p className="text-sm text-muted-foreground">Field Operations Lead</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="tactical">Admin</Badge>
                  <Badge variant="success">Online</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Groups */}
        {settingGroups.map((group, gi) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.1 }}
          >
            <h3 className="font-display text-sm font-semibold text-muted-foreground mb-3">
              {group.title}
            </h3>
            <Card variant="tactical">
              <div className="divide-y divide-border">
                {group.items.map((item, i) => (
                  <div 
                    key={item.label}
                    className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-secondary">
                        <item.icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    
                    {item.toggle !== undefined ? (
                      <Switch 
                        checked={item.label === 'Biometric Login' ? biometric : offline}
                        onCheckedChange={(checked) => {
                          if (item.label === 'Biometric Login') setBiometric(checked);
                          else setOffline(checked);
                        }}
                      />
                    ) : item.badge ? (
                      <Badge variant="outline" className="text-xs">
                        {item.badge}
                      </Badge>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}

        {/* Device Info */}
        <Card variant="ghost" className="p-4 bg-secondary/30">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Device Bound</p>
              <p className="text-xs text-muted-foreground">
                This device is registered for secure access
              </p>
            </div>
          </div>
        </Card>

        {/* Logout Button */}
        <Button variant="outline" className="w-full" size="lg">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>

        {/* Version Info */}
        <p className="text-center text-xs text-muted-foreground">
          FAUNORA Intelligence System v3.0.0 • Build 2024.12
        </p>
      </div>
    </AppLayout>
  );
}
