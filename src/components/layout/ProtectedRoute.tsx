import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Still loading
  if (session === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Shield className="w-12 h-12 text-primary animate-pulse" />
          <p className="text-muted-foreground font-display">Verifying Access...</p>
        </motion.div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}