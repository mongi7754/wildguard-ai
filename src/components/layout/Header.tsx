import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Settings, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}

export function Header({ title, showBackButton }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 safe-top">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3">
          {showBackButton ? (
            <Button 
              variant="ghost" 
              size="icon-sm" 
              onClick={() => navigate(-1)}
              className="text-muted-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          ) : (
            <Link to="/" className="flex items-center gap-2">
              <motion.div 
                className="relative w-8 h-8 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-primary/20 rounded-lg animate-pulse-glow" />
                <Shield className="w-5 h-5 text-primary relative z-10" />
              </motion.div>
              <span className="font-display text-sm font-bold tracking-wider text-glow">
                FAUNORA
              </span>
            </Link>
          )}
          {title && (
            <h1 className="font-display text-sm font-semibold text-foreground ml-2">
              {title}
            </h1>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" className="relative" asChild>
            <Link to="/alerts">
              <Bell className="w-5 h-5" />
              <Badge 
                variant="danger" 
                className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-[10px]"
              >
                4
              </Badge>
            </Link>
          </Button>
          <Button variant="ghost" size="icon-sm" asChild>
            <Link to="/settings">
              <Settings className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
