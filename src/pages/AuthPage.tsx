import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Fingerprint, Radio, Satellite, Lock, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import faunoraWallpaper from '@/assets/faunora-wallpaper.jpg';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateForm = (): boolean => {
    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return false;
    }

    // Password validation
    if (password.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return false;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Login Failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive"
          });
        } else {
          throw error;
        }
        return;
      }

      if (data.session) {
        toast({
          title: "Access Granted",
          description: "Welcome to FAUNORA Command Center",
        });
        navigate('/');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: error.message || "Login failed",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast({
            title: "Account Exists",
            description: "An account with this email already exists. Please login instead.",
            variant: "destructive"
          });
          setMode('login');
        } else {
          throw error;
        }
        return;
      }

      if (data.session) {
        toast({
          title: "Access Granted",
          description: "Welcome to FAUNORA Command Center",
        });
        navigate('/');
      } else if (data.user) {
        toast({
          title: "Registration Successful",
          description: "You can now login with your credentials",
        });
        setMode('login');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: error.message || "Registration failed",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Wallpaper Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${faunoraWallpaper})` }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-background/90" />
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.1) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Radar Animation */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 opacity-10">
        <div className="absolute inset-0 rounded-full border border-primary animate-radar" />
        <div className="absolute inset-0 rounded-full border border-primary animate-radar" style={{ animationDelay: '0.5s' }} />
        <div className="absolute inset-0 rounded-full border border-primary animate-radar" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Logo & Title */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Shield className="w-16 h-16 text-primary" />
              <Eye className="w-6 h-6 text-accent absolute -bottom-1 -right-1" />
            </div>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground text-glow tracking-wider">
            FAUNORA
          </h1>
          <p className="text-muted-foreground mt-2 text-sm tracking-widest uppercase">
            Aerial Intelligence Engine
          </p>
        </motion.div>

        {/* Auth Card */}
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="gradient-card border border-border/50 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
            {/* Status Icons */}
            <div className="flex justify-center gap-6 mb-8">
              <motion.div 
                className="flex flex-col items-center gap-1"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Satellite className="w-5 h-5 text-primary" />
                <span className="text-[10px] text-muted-foreground">SATELLITE</span>
              </motion.div>
              <motion.div 
                className="flex flex-col items-center gap-1"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              >
                <Radio className="w-5 h-5 text-primary" />
                <span className="text-[10px] text-muted-foreground">COMMS</span>
              </motion.div>
              <motion.div 
                className="flex flex-col items-center gap-1"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              >
                <Fingerprint className="w-5 h-5 text-primary" />
                <span className="text-[10px] text-muted-foreground">BIOMETRIC</span>
              </motion.div>
            </div>

            <motion.form
              key={mode}
              initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={mode === 'login' ? handleLogin : handleSignup}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                {mode === 'login' ? (
                  <Lock className="w-8 h-8 text-primary mx-auto mb-2" />
                ) : (
                  <UserPlus className="w-8 h-8 text-primary mx-auto mb-2" />
                )}
                <h2 className="font-display text-xl text-foreground">
                  {mode === 'login' ? 'SECURE ACCESS' : 'CREATE ACCOUNT'}
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  {mode === 'login' 
                    ? 'Enter your credentials to continue' 
                    : 'Register for system access'}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
                    Operator Email
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operator@faunora.gov"
                    className="bg-muted/50 border-border/50 focus:border-primary"
                    autoComplete="email"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
                    Access Key
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="bg-muted/50 border-border/50 focus:border-primary"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  />
                </div>

                {mode === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
                      Confirm Access Key
                    </label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="bg-muted/50 border-border/50 focus:border-primary"
                      autoComplete="new-password"
                    />
                  </motion.div>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 font-display tracking-wider"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  mode === 'login' ? "AUTHENTICATE" : "REGISTER"
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'login' ? 'signup' : 'login');
                    setPassword('');
                    setConfirmPassword('');
                  }}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {mode === 'login' 
                    ? "Need access? Request credentials" 
                    : "Already have access? Login"}
                </button>
              </div>
            </motion.form>
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.p 
          className="text-muted-foreground/50 text-xs mt-8 text-center max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          🔒 Government Authorized System • Wildlife Conservation Division
          <br />
          Unauthorized access is strictly prohibited
        </motion.p>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes radar {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        .animate-radar {
          animation: radar 3s ease-out infinite;
        }
        .text-glow {
          text-shadow: 0 0 20px hsl(var(--primary) / 0.5);
        }
        .gradient-card {
          background: linear-gradient(145deg, 
            hsl(var(--card) / 0.9) 0%, 
            hsl(var(--card) / 0.7) 100%
          );
        }
      `}</style>
    </div>
  );
}
