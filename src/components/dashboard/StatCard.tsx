import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'warning' | 'danger';
  className?: string;
}

const variantStyles = {
  default: {
    card: '',
    icon: 'bg-secondary text-secondary-foreground',
    value: 'text-foreground'
  },
  primary: {
    card: 'border-primary/30',
    icon: 'bg-primary/20 text-primary',
    value: 'text-primary'
  },
  warning: {
    card: 'border-accent/30',
    icon: 'bg-accent/20 text-accent',
    value: 'text-accent'
  },
  danger: {
    card: 'border-danger/30',
    icon: 'bg-danger/20 text-danger',
    value: 'text-danger'
  }
};

export function StatCard({ icon: Icon, label, value, trend, variant = 'default', className }: StatCardProps) {
  const styles = variantStyles[variant];
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card variant="tactical" className={cn("p-4", styles.card, className)}>
        <div className="flex items-start justify-between">
          <div className={cn("p-2 rounded-lg", styles.icon)}>
            <Icon className="w-4 h-4" />
          </div>
          {trend && (
            <span className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-success" : "text-danger"
            )}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          )}
        </div>
        <div className="mt-3">
          <p className={cn("text-2xl font-display font-bold", styles.value)}>
            {value}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {label}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
