import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Mic, 
  MicOff,
  Bot,
  User,
  Loader2,
  Shield,
  Leaf
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestedQueries = [
  "What is the current national park status?",
  "Where is the nearest elephant herd?",
  "Show me wildlife movement patterns",
  "What's the fire risk level today?",
  "Generate a daily intelligence brief",
  "Environmental risk assessment",
];

export default function AIAssistantPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `I am FAUNORA - the National Environmental and Wildlife Intelligence System.

I operate as a sovereign, ethical, and autonomous AI platform supporting government decision-making for wildlife conservation, public safety, climate resilience, and national natural asset protection.

How may I assist you today? I can provide:
• National aerial situation awareness
• Wildlife intelligence & movement tracking
• Incident, risk & early warning management
• Climate & environmental analysis
• Autonomous decision support
• Government dashboard & reporting`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-command-assistant', {
        body: { query: text }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data?.response || "I couldn't process that request. Please try again.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('FAUNORA error:', error);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: error instanceof Error && error.message.includes('429') 
          ? "FAUNORA is currently experiencing high demand. Please try again in a moment."
          : error instanceof Error && error.message.includes('402')
          ? "FAUNORA requires additional credits. Please contact your administrator."
          : "I apologize, I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast({
        title: "Voice Input",
        description: "Voice recognition activated (simulated)",
      });
    }
  };

  return (
    <AppLayout title="FAUNORA">
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Header Banner */}
        <div className="px-4 py-3 bg-gradient-to-r from-primary/10 to-success/10 border-b border-primary/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">FAUNORA Intelligence System</p>
              <p className="text-[10px] text-muted-foreground">National Environmental & Wildlife Command</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide">
          {messages.map((message, i) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i === messages.length - 1 ? 0 : 0 }}
              className={cn(
                "flex gap-3",
                message.role === 'user' && "flex-row-reverse"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                message.role === 'assistant' ? "bg-primary/20" : "bg-secondary"
              )}>
                {message.role === 'assistant' ? (
                  <Leaf className="w-4 h-4 text-primary" />
                ) : (
                  <User className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <Card variant={message.role === 'assistant' ? 'tactical' : 'glow'} 
                className={cn(
                  "max-w-[80%] p-3",
                  message.role === 'user' && "bg-primary/10"
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-[10px] text-muted-foreground mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </Card>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-primary" />
              </div>
              <Card variant="tactical" className="p-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">FAUNORA processing...</span>
                </div>
              </Card>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Queries */}
        {messages.length === 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-muted-foreground mb-2">Suggested queries:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.map((query, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => sendMessage(query)}
                >
                  {query}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Button
              type="button"
              variant={isListening ? 'default' : 'outline'}
              size="icon"
              onClick={toggleVoice}
              className={cn(isListening && "animate-pulse")}
            >
              {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask FAUNORA..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
