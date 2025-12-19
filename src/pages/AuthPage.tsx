import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, Fingerprint, Radio, Satellite, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import faunoraWallpaper from '@/assets/faunora-wallpaper.jpg';

export default function AuthPage() {
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Generate random 6-digit OTP
  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate credential verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);
    
    // In production, this would be sent via SMS/Email
    toast({
      title: "OTP Sent",
      description: `Your verification code is: ${newOtp}`,
    });
    
    setStep('otp');
    setIsLoading(false);
  };

  const handleOtpVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit code",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (otp === generatedOtp) {
      toast({
        title: "Access Granted",
        description: "Welcome to FAUNORA Command Center",
      });
      localStorage.setItem('faunora_authenticated', 'true');
      navigate('/');
    } else {
      toast({
        title: "Invalid Code",
        description: "The verification code is incorrect",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  const resendOtp = () => {
    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);
    setOtp('');
    toast({
      title: "New OTP Sent",
      description: `Your new verification code is: ${newOtp}`,
    });
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

            <AnimatePresence mode="wait">
              {step === 'credentials' ? (
                <motion.form
                  key="credentials"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleCredentialSubmit}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <Lock className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h2 className="font-display text-xl text-foreground">SECURE ACCESS</h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      Enter your credentials to continue
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
                      />
                    </div>
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
                      "AUTHENTICATE"
                    )}
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h2 className="font-display text-xl text-foreground">VERIFICATION CODE</h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      Enter the 6-digit code sent to your device
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <InputOTP 
                      maxLength={6} 
                      value={otp} 
                      onChange={setOtp}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="w-12 h-14 text-xl font-display bg-muted/50 border-border/50" />
                        <InputOTPSlot index={1} className="w-12 h-14 text-xl font-display bg-muted/50 border-border/50" />
                        <InputOTPSlot index={2} className="w-12 h-14 text-xl font-display bg-muted/50 border-border/50" />
                        <InputOTPSlot index={3} className="w-12 h-14 text-xl font-display bg-muted/50 border-border/50" />
                        <InputOTPSlot index={4} className="w-12 h-14 text-xl font-display bg-muted/50 border-border/50" />
                        <InputOTPSlot index={5} className="w-12 h-14 text-xl font-display bg-muted/50 border-border/50" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <Button 
                    onClick={handleOtpVerify}
                    className="w-full h-12 font-display tracking-wider"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? (
                      <motion.div
                        className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      "VERIFY & ACCESS"
                    )}
                  </Button>

                  <div className="flex justify-between items-center text-sm">
                    <button
                      type="button"
                      onClick={() => setStep('credentials')}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={resendOtp}
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      Resend Code
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Info */}
          <motion.div 
            className="text-center mt-6 text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p>Government Authorized System • Level 5 Security</p>
            <p className="mt-1">Wildlife Conservation & Environmental Protection Division</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
