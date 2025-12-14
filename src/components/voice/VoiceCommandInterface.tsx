import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  AlertTriangle,
  Plane,
  MapPin,
  Activity,
  X,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface VoiceCommandInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  context?: {
    park?: string;
    activeDrones?: number;
    alertCount?: number;
    rangersActive?: number;
  };
}

interface CommandLog {
  id: string;
  type: 'user' | 'system';
  text: string;
  timestamp: Date;
  toolCalls?: Array<{ name: string; arguments: any }>;
}

export function VoiceCommandInterface({ isOpen, onClose, context }: VoiceCommandInterfaceProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [commandLog, setCommandLog] = useState<CommandLog[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const { toast } = useToast();

  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: sttSupported,
    error: sttError
  } = useSpeechRecognition();

  const {
    speak,
    stop: stopSpeaking,
    isSpeaking,
    isSupported: ttsSupported
  } = useSpeechSynthesis();

  // Process command when transcript is finalized
  const processCommand = useCallback(async (command: string) => {
    if (!command.trim() || isProcessing) return;

    setIsProcessing(true);
    
    // Add user command to log
    const userLog: CommandLog = {
      id: Date.now().toString(),
      type: 'user',
      text: command,
      timestamp: new Date()
    };
    setCommandLog(prev => [...prev, userLog]);

    try {
      const { data, error } = await supabase.functions.invoke('voice-command', {
        body: { command, context }
      });

      if (error) throw error;

      const response = data?.response || "Command processed.";
      const toolCalls = data?.toolCalls || [];

      // Add system response to log
      const systemLog: CommandLog = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        text: response,
        timestamp: new Date(),
        toolCalls
      };
      setCommandLog(prev => [...prev, systemLog]);

      // Speak the response if audio is enabled
      if (audioEnabled && ttsSupported) {
        speak(response);
      }

    } catch (error) {
      console.error('Command processing error:', error);
      const errorResponse = "Command failed. Please try again.";
      
      setCommandLog(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'system',
        text: errorResponse,
        timestamp: new Date()
      }]);

      if (audioEnabled && ttsSupported) {
        speak(errorResponse);
      }

      toast({
        title: "Command Error",
        description: "Failed to process voice command",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      resetTranscript();
    }
  }, [context, isProcessing, audioEnabled, ttsSupported, speak, toast, resetTranscript]);

  // Auto-process when user stops speaking
  useEffect(() => {
    if (!isListening && transcript.trim() && !isProcessing) {
      const timeoutId = setTimeout(() => {
        processCommand(transcript);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [isListening, transcript, isProcessing, processCommand]);

  // Handle STT errors
  useEffect(() => {
    if (sttError) {
      toast({
        title: "Voice Recognition Error",
        description: sttError,
        variant: "destructive"
      });
    }
  }, [sttError, toast]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      if (isSpeaking) stopSpeaking();
      startListening();
    }
  };

  const toggleAudio = () => {
    if (isSpeaking) stopSpeaking();
    setAudioEnabled(!audioEnabled);
  };

  const getToolIcon = (toolName: string) => {
    switch (toolName) {
      case 'deploy_drone': return <Plane className="w-3 h-3" />;
      case 'get_threat_status': return <AlertTriangle className="w-3 h-3" />;
      case 'locate_wildlife': return <MapPin className="w-3 h-3" />;
      case 'send_alert': return <Radio className="w-3 h-3" />;
      default: return <Activity className="w-3 h-3" />;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Radio className="w-6 h-6 text-primary" />
                {isListening && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse" />
                )}
              </div>
              <div>
                <h2 className="font-display font-bold text-lg">Voice Commander</h2>
                <p className="text-xs text-muted-foreground">Hands-free field operations</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleAudio}
                className={cn(!audioEnabled && "text-muted-foreground")}
              >
                {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="px-4 py-2 bg-muted/30 border-b border-border/30">
            <div className="flex items-center gap-4 text-xs">
              <Badge variant={isListening ? 'success' : 'secondary'}>
                {isListening ? 'Listening' : 'Standby'}
              </Badge>
              {isSpeaking && (
                <Badge variant="warning">Speaking</Badge>
              )}
              {isProcessing && (
                <Badge variant="secondary" className="gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Processing
                </Badge>
              )}
              <span className="text-muted-foreground ml-auto">
                Park: {context?.park || 'Masai Mara'}
              </span>
            </div>
          </div>

          {/* Command Log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {commandLog.length === 0 && (
              <div className="text-center py-12">
                <Mic className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">Press the microphone to start</p>
                <div className="mt-4 text-xs text-muted-foreground/60 space-y-1">
                  <p>Try saying:</p>
                  <p>"Any threats nearby?"</p>
                  <p>"Where are the elephants?"</p>
                  <p>"Deploy drone to sector 7"</p>
                </div>
              </div>
            )}

            {commandLog.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex",
                  log.type === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <Card
                  variant={log.type === 'user' ? 'glow' : 'tactical'}
                  className={cn(
                    "max-w-[85%] p-3",
                    log.type === 'user' && "bg-primary/10"
                  )}
                >
                  <p className="text-sm">{log.text}</p>
                  {log.toolCalls && log.toolCalls.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border/30 flex flex-wrap gap-1">
                      {log.toolCalls.map((tc, idx) => (
                        <Badge key={idx} variant="secondary" className="gap-1 text-[10px]">
                          {getToolIcon(tc.name)}
                          {tc.name.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {log.timestamp.toLocaleTimeString()}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Live Transcript */}
          {(transcript || interimTranscript) && (
            <div className="px-4 py-2 bg-muted/30 border-t border-border/30">
              <p className="text-sm font-mono">
                <span className="text-foreground">{transcript}</span>
                <span className="text-muted-foreground">{interimTranscript}</span>
              </p>
            </div>
          )}

          {/* Main Controls */}
          <div className="p-6 border-t border-border/50">
            <div className="flex items-center justify-center">
              <motion.div
                animate={isListening ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Button
                  variant={isListening ? 'danger' : 'glow'}
                  size="lg"
                  className={cn(
                    "w-20 h-20 rounded-full shadow-lg",
                    isListening && "ring-4 ring-danger/30"
                  )}
                  onClick={toggleListening}
                  disabled={!sttSupported || isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : isListening ? (
                    <MicOff className="w-8 h-8" />
                  ) : (
                    <Mic className="w-8 h-8" />
                  )}
                </Button>
              </motion.div>
            </div>

            {!sttSupported && (
              <p className="text-center text-xs text-muted-foreground mt-4">
                Voice recognition not supported in this browser
              </p>
            )}

            <p className="text-center text-xs text-muted-foreground mt-4">
              {isListening ? 'Speak your command clearly' : 'Tap to speak'}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
