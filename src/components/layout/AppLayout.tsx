import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { BottomNav } from './BottomNav';
import { Header } from './Header';

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
}

export function AppLayout({ children, title, showBackButton }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title={title} showBackButton={showBackButton} />
      <motion.main 
        className="flex-1 pb-20 overflow-x-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
      <BottomNav />
    </div>
  );
}
