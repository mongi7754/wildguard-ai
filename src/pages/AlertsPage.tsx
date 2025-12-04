import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Filter,
  AlertTriangle,
  Flame,
  Car,
  Radio,
  User,
  Droplets
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AlertCard } from '@/components/alerts/AlertCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockAlerts } from '@/data/mockData';
import { cn } from '@/lib/utils';

const filterOptions = [
  { id: 'all', label: 'All', icon: Filter },
  { id: 'poacher', label: 'Poacher', icon: User },
  { id: 'fire', label: 'Fire', icon: Flame },
  { id: 'vehicle', label: 'Vehicle', icon: Car },
  { id: 'acoustic', label: 'Acoustic', icon: Radio },
  { id: 'environmental', label: 'Environment', icon: Droplets },
];

const severityFilters = ['all', 'critical', 'high', 'medium', 'low'];

export default function AlertsPage() {
  const [typeFilter, setTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  const filteredAlerts = mockAlerts.filter(alert => {
    if (typeFilter !== 'all' && alert.type !== typeFilter) return false;
    if (severityFilter !== 'all' && alert.severity !== severityFilter) return false;
    return true;
  });

  const activeCount = mockAlerts.filter(a => a.status === 'active').length;
  const criticalCount = mockAlerts.filter(a => a.severity === 'critical').length;

  return (
    <AppLayout title="Threat Alerts">
      <div className="px-4 py-4 space-y-4">
        {/* Stats Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 p-3 rounded-xl bg-danger/10 border border-danger/30">
            <AlertTriangle className="w-4 h-4 text-danger" />
            <span className="text-sm font-medium">{activeCount} Active</span>
          </div>
          <div className="flex-1 flex items-center gap-2 p-3 rounded-xl bg-accent/10 border border-accent/30">
            <Flame className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">{criticalCount} Critical</span>
          </div>
        </div>

        {/* Type Filters */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-2 pb-2">
            {filterOptions.map((option) => {
              const Icon = option.icon;
              const isActive = typeFilter === option.id;
              return (
                <Button
                  key={option.id}
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  className={cn(
                    "shrink-0",
                    !isActive && "text-muted-foreground"
                  )}
                  onClick={() => setTypeFilter(option.id)}
                >
                  <Icon className="w-3 h-3 mr-1.5" />
                  {option.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Severity Filters */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Severity:</span>
          <div className="flex gap-1.5">
            {severityFilters.map((severity) => (
              <Badge
                key={severity}
                variant={severityFilter === severity ? 
                  (severity === 'critical' ? 'danger' : 
                   severity === 'high' ? 'warning' : 
                   severity === 'medium' ? 'warning' : 
                   severity === 'low' ? 'success' : 'default') 
                  : 'outline'
                }
                className={cn(
                  "cursor-pointer capitalize text-[10px]",
                  severityFilter !== severity && "opacity-60 hover:opacity-100"
                )}
                onClick={() => setSeverityFilter(severity)}
              >
                {severity}
              </Badge>
            ))}
          </div>
        </div>

        {/* Alerts List */}
        <motion.div 
          className="space-y-3"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.05 } }
          }}
        >
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0 }
                }}
              >
                <AlertCard alert={alert} />
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No alerts matching filters</p>
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}
