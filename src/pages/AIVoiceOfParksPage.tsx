import { useState, useRef, useEffect, useCallback } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { kenyanParks, getParkStats } from '@/data/parksData';
import { historicalThreats, getThreatStats } from '@/data/historicalThreats';
import { generateParkWeatherData, getNetworkWeatherStats } from '@/data/weatherData';
import { 
  Mic, MicOff, Volume2, VolumeX, Send, Bot, User, 
  FileText, AlertTriangle, TrendingUp, Shield, Flame,
  Clock, MapPin, RefreshCw, Download, Sparkles, Play,
  Pause, Radio, Thermometer, Droplets
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  park?: string;
}

interface ParkReport {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'emergency' | 'briefing';
  park: string;
  content: string;
  timestamp: Date;
  metrics?: {
    wildlife: number;
    threats: number;
    revenue: number;
    rangers: number;
  };
}

const AIVoiceOfParksPage = () => {
  const [selectedPark, setSelectedPark] = useState<string>('all');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reports, setReports] = useState<ParkReport[]>([]);
  const [activeTab, setActiveTab] = useState('chat');
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [weatherData, setWeatherData] = useState(() => generateParkWeatherData());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Generate initial greeting
  useEffect(() => {
    const parkName = selectedPark === 'all' 
      ? 'Kenya National Parks Network'
      : kenyanParks.find(p => p.id === selectedPark)?.name || 'the park';
    
    const greeting: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `I am the AI Voice of ${parkName}. I continuously analyze satellite data, ranger activity, wildlife movement, climate trends, and financial indicators to provide accurate, real-time intelligence to the Government of Kenya.\n\nHow may I assist you today? You can ask about:\n• Current security situation\n• Wildlife health and population\n• Fire risk assessment\n• Revenue and compensation data\n• Any operational concerns`,
      timestamp: new Date(),
      park: selectedPark
    };
    setMessages([greeting]);
  }, [selectedPark]);

  const generateParkContext = useCallback(() => {
    const stats = getParkStats();
    const threatStats = getThreatStats();
    const weatherStats = getNetworkWeatherStats(weatherData);
    const park = selectedPark === 'all' 
      ? null 
      : kenyanParks.find(p => p.id === selectedPark);

    let context = `You are the AI Voice of ${park ? park.name : 'Kenya National Parks Network'}.
    
CURRENT STATUS:
- Total Parks: ${stats.totalParks}
- Total Area: ${stats.totalArea.toLocaleString()} km²
- Active Rangers: ${stats.totalRangers} teams
- Operational Drones: ${stats.totalDrones}
- Recent Alerts: ${stats.totalAlerts}

WEATHER & FIRE RISK:
- Average Temperature: ${weatherStats.avgTemp}°C
- Average Humidity: ${weatherStats.avgHumidity}%
- Network Fire Risk Score: ${weatherStats.avgFireRisk}%
- Parks at Extreme Fire Risk: ${weatherStats.extremeFireCount} (${weatherStats.extremeFireParks.join(', ') || 'None'})
- Parks at High Fire Risk: ${weatherStats.highFireCount} (${weatherStats.highFireParks.join(', ') || 'None'})
- Active Weather Alerts: ${weatherStats.totalAlerts}

THREAT ANALYSIS (Last 7 Days):
- Total Incidents: ${threatStats.total}
- Resolved: ${threatStats.resolved}
- Average Response Time: ${threatStats.avgResponseTime.toFixed(1)} minutes
- Critical: ${threatStats.bySeverity.critical}
- High: ${threatStats.bySeverity.high}
- Medium: ${threatStats.bySeverity.medium}
- Low: ${threatStats.bySeverity.low}

`;

    if (park) {
      const parkWeather = weatherData.find(w => w.parkId === park.id.replace('masai_mara', 'masai-mara').replace(/_/g, '-'));
      context += `
SPECIFIC PARK DATA - ${park.name}:
- Location: ${park.region}, ${park.country}
- Area: ${park.area.toLocaleString()} km²
- Established: ${park.established}
- Conservation Status: ${park.conservationStatus.toUpperCase()}
- Key Wildlife: ${park.keyWildlife.join(', ')}
- Active Threats: ${park.threats.join(', ')}
- Ranger Teams: ${park.rangerTeams}
- Active Drones: ${park.activeDrones}
- Recent Alerts: ${park.recentAlerts}
${parkWeather ? `
CURRENT WEATHER:
- Temperature: ${parkWeather.temperature}°C
- Humidity: ${parkWeather.humidity}%
- Wind: ${parkWeather.windSpeed} km/h ${parkWeather.windDirection}
- Conditions: ${parkWeather.conditions}
- Fire Risk: ${parkWeather.fireRisk.toUpperCase()} (${parkWeather.fireRiskScore}%)
` : ''}`;
    }

    return context;
  }, [selectedPark, weatherData]);

  // Voice playback function
  const speakText = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) {
      toast.error('Speech synthesis not supported in this browser');
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to find a good voice
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) 
      || voices.find(v => v.lang.startsWith('en'));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsPlayingVoice(true);
    utterance.onend = () => setIsPlayingVoice(false);
    utterance.onerror = () => setIsPlayingVoice(false);

    setCurrentUtterance(utterance);
    speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    speechSynthesis.cancel();
    setIsPlayingVoice(false);
  }, []);

  // Auto-brief function
  const generateVoiceBriefing = useCallback(async () => {
    setIsLoading(true);
    const park = selectedPark === 'all' ? null : kenyanParks.find(p => p.id === selectedPark);
    
    try {
      const context = generateParkContext();
      
      const { data, error } = await supabase.functions.invoke('ai-voice-of-parks', {
        body: {
          message: `Generate a concise 60-second voice briefing for senior government leadership. Start with "I am ${park ? park.name : 'the Kenya National Parks Network'}." Include: current status, critical threats, weather/fire risk, and top 3 recommendations. Keep it natural for speech synthesis.`,
          context: context,
          parkId: selectedPark,
          reportType: 'voice_briefing'
        }
      });

      if (error) throw error;

      const briefingText = data.response;
      
      // Add to messages
      const briefingMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: briefingText,
        timestamp: new Date(),
        park: selectedPark
      };
      setMessages(prev => [...prev, briefingMessage]);

      // Speak the briefing if voice is enabled
      if (isSpeaking) {
        speakText(briefingText);
      }

      toast.success('Voice briefing generated');
    } catch (error) {
      console.error('Voice briefing error:', error);
      toast.error('Failed to generate voice briefing');
    } finally {
      setIsLoading(false);
    }
  }, [selectedPark, generateParkContext, isSpeaking, speakText]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const context = generateParkContext();
      
      const { data, error } = await supabase.functions.invoke('ai-voice-of-parks', {
        body: {
          message: inputMessage.trim(),
          context: context,
          parkId: selectedPark
        }
      });

      if (error) throw error;

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response || 'I apologize, I was unable to process your request. Please try again.',
        timestamp: new Date(),
        park: selectedPark
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (isSpeaking && 'speechSynthesis' in window) {
        speakText(data.response);
      }
    } catch (error) {
      console.error('AI Voice error:', error);
      toast.error('Failed to get response from AI Voice');
      
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'I apologize, I am experiencing technical difficulties. Please try again shortly.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = async (type: 'daily' | 'weekly' | 'emergency' | 'briefing') => {
    setIsLoading(true);
    const park = selectedPark === 'all' ? kenyanParks[0] : kenyanParks.find(p => p.id === selectedPark);
    
    try {
      const context = generateParkContext();
      const reportPrompts = {
        daily: 'Generate a comprehensive Daily Situation Report for today.',
        weekly: 'Generate a Weekly Intelligence Brief summarizing the past 7 days.',
        emergency: 'Generate an Emergency Incident Report based on current threat data.',
        briefing: 'Generate a 60-second Leadership Briefing with only critical issues and recommendations.'
      };

      const { data, error } = await supabase.functions.invoke('ai-voice-of-parks', {
        body: {
          message: reportPrompts[type],
          context: context,
          parkId: selectedPark,
          reportType: type
        }
      });

      if (error) throw error;

      const newReport: ParkReport = {
        id: crypto.randomUUID(),
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Report - ${park?.name || 'All Parks'}`,
        type,
        park: park?.name || 'All Parks',
        content: data.response,
        timestamp: new Date(),
        metrics: {
          wildlife: Math.floor(Math.random() * 500) + 100,
          threats: Math.floor(Math.random() * 10),
          revenue: Math.floor(Math.random() * 10000000) + 5000000,
          rangers: Math.floor(Math.random() * 50) + 20
        }
      };

      setReports(prev => [newReport, ...prev]);
      setActiveTab('reports');
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} report generated`);
    } catch (error) {
      console.error('Report generation error:', error);
      toast.error('Failed to generate report');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => {
      setIsListening(false);
      toast.error('Voice recognition failed');
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
    };

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const currentPark = selectedPark === 'all' ? null : kenyanParks.find(p => p.id === selectedPark);

  return (
    <AppLayout>
      <div className="h-[calc(100vh-4rem)] flex flex-col p-4 gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20">
              <Bot className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                AI Voice of the Parks
                <Badge variant="outline" className="text-emerald-400 border-emerald-500/50">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </h1>
              <p className="text-sm text-muted-foreground">
                Autonomous Intelligence Agent for Kenya National Parks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select value={selectedPark} onValueChange={setSelectedPark}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Park" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Parks Network</SelectItem>
                {kenyanParks.map(park => (
                  <SelectItem key={park.id} value={park.id}>
                    {park.imageEmoji} {park.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="default"
              size="sm"
              onClick={generateVoiceBriefing}
              disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isPlayingVoice ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              Voice Briefing
            </Button>

            <Button
              variant={isSpeaking ? "secondary" : "outline"}
              size="icon"
              onClick={() => {
                if (isPlayingVoice) stopSpeaking();
                setIsSpeaking(!isSpeaking);
              }}
              title={isSpeaking ? "Mute voice" : "Enable voice"}
            >
              {isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex gap-4 min-h-0">
          {/* Left Panel - Park Status */}
          <Card className="w-80 bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-400" />
                {currentPark ? currentPark.name : 'Network Status'}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-4">
              {currentPark ? (
                <>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-4xl mb-2">{currentPark.imageEmoji}</div>
                    <Badge className={
                      currentPark.conservationStatus === 'stable' ? 'bg-green-500' :
                      currentPark.conservationStatus === 'vulnerable' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }>
                      {currentPark.conservationStatus.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-muted/20 rounded">
                      <div className="text-muted-foreground">Area</div>
                      <div className="font-bold">{currentPark.area.toLocaleString()} km²</div>
                    </div>
                    <div className="p-2 bg-muted/20 rounded">
                      <div className="text-muted-foreground">Rangers</div>
                      <div className="font-bold">{currentPark.rangerTeams} teams</div>
                    </div>
                    <div className="p-2 bg-muted/20 rounded">
                      <div className="text-muted-foreground">Drones</div>
                      <div className="font-bold">{currentPark.activeDrones} active</div>
                    </div>
                    <div className="p-2 bg-muted/20 rounded">
                      <div className="text-muted-foreground">Alerts</div>
                      <div className="font-bold text-amber-400">{currentPark.recentAlerts}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Key Wildlife</div>
                    <div className="flex flex-wrap gap-1">
                      {currentPark.keyWildlife.slice(0, 5).map(animal => (
                        <Badge key={animal} variant="outline" className="text-[10px]">
                          {animal}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Active Threats</div>
                    <div className="flex flex-wrap gap-1">
                      {currentPark.threats.map(threat => (
                        <Badge key={threat} variant="destructive" className="text-[10px]">
                          {threat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  {(() => {
                    const stats = getParkStats();
                    return (
                      <>
                        <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                          <div className="text-xs text-muted-foreground">Total Parks</div>
                          <div className="text-2xl font-bold text-emerald-400">{stats.totalParks}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2 bg-muted/20 rounded">
                            <div className="text-muted-foreground">Total Area</div>
                            <div className="font-bold">{stats.totalArea.toLocaleString()} km²</div>
                          </div>
                          <div className="p-2 bg-muted/20 rounded">
                            <div className="text-muted-foreground">Rangers</div>
                            <div className="font-bold">{stats.totalRangers} teams</div>
                          </div>
                          <div className="p-2 bg-muted/20 rounded">
                            <div className="text-muted-foreground">Drones</div>
                            <div className="font-bold">{stats.totalDrones} active</div>
                          </div>
                          <div className="p-2 bg-muted/20 rounded">
                            <div className="text-muted-foreground">Alerts</div>
                            <div className="font-bold text-amber-400">{stats.totalAlerts}</div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Quick Report Buttons */}
              <div className="pt-4 border-t border-border/50">
                <div className="text-xs text-muted-foreground mb-2">Generate Reports</div>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" onClick={() => generateReport('daily')} disabled={isLoading}>
                    <FileText className="h-3 w-3 mr-1" />
                    Daily
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => generateReport('weekly')} disabled={isLoading}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Weekly
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => generateReport('emergency')} disabled={isLoading}>
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Emergency
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => generateReport('briefing')} disabled={isLoading}>
                    <Clock className="h-3 w-3 mr-1" />
                    Briefing
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Center - Chat/Reports */}
          <Card className="flex-1 bg-card/50 backdrop-blur border-border/50 flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="mx-4 mt-4 w-fit">
                <TabsTrigger value="chat">
                  <Bot className="h-4 w-4 mr-2" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="reports">
                  <FileText className="h-4 w-4 mr-2" />
                  Reports ({reports.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="flex-1 flex flex-col p-4 pt-2">
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {message.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                              <Bot className="h-4 w-4 text-emerald-400" />
                            </div>
                          )}
                          <div className={`max-w-[70%] p-3 rounded-lg ${
                            message.role === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted/50'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p className="text-[10px] opacity-60 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                          {message.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {isLoading && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-emerald-400 animate-pulse" />
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input area */}
                <div className="pt-4 border-t border-border/50 mt-4">
                  <div className="flex gap-2">
                    <Button
                      variant={isListening ? "secondary" : "outline"}
                      size="icon"
                      onClick={handleVoiceInput}
                      className={isListening ? 'animate-pulse' : ''}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    <Textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask the AI Voice about park status, threats, wildlife, or request reports..."
                      className="min-h-[44px] max-h-32 resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reports" className="flex-1 p-4 pt-2">
                <ScrollArea className="h-full">
                  <div className="space-y-4">
                    {reports.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No reports generated yet</p>
                        <p className="text-sm">Use the sidebar to generate reports</p>
                      </div>
                    ) : (
                      reports.map(report => (
                        <Card key={report.id} className="bg-muted/20">
                          <CardHeader className="py-3 px-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-sm">{report.title}</CardTitle>
                                <p className="text-xs text-muted-foreground">
                                  {report.timestamp.toLocaleString()}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Badge variant="outline" className="text-[10px]">
                                  {report.type}
                                </Badge>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <Download className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="px-4 pb-4">
                            {report.metrics && (
                              <div className="grid grid-cols-4 gap-2 mb-4 text-xs">
                                <div className="p-2 bg-background/50 rounded text-center">
                                  <div className="text-muted-foreground">Wildlife</div>
                                  <div className="font-bold text-emerald-400">{report.metrics.wildlife}</div>
                                </div>
                                <div className="p-2 bg-background/50 rounded text-center">
                                  <div className="text-muted-foreground">Threats</div>
                                  <div className="font-bold text-red-400">{report.metrics.threats}</div>
                                </div>
                                <div className="p-2 bg-background/50 rounded text-center">
                                  <div className="text-muted-foreground">Revenue</div>
                                  <div className="font-bold text-amber-400">KES {(report.metrics.revenue / 1000000).toFixed(1)}M</div>
                                </div>
                                <div className="p-2 bg-background/50 rounded text-center">
                                  <div className="text-muted-foreground">Rangers</div>
                                  <div className="font-bold text-cyan-400">{report.metrics.rangers}</div>
                                </div>
                              </div>
                            )}
                            <div className="text-sm whitespace-pre-wrap bg-background/30 p-3 rounded max-h-64 overflow-y-auto">
                              {report.content}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Right Panel - Threat Summary */}
          <Card className="w-72 bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="h-4 w-4 text-red-400" />
                Threat Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-4">
              {(() => {
                const stats = getThreatStats();
                return (
                  <>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                        <div className="text-muted-foreground">Critical</div>
                        <div className="text-xl font-bold text-red-400">{stats.bySeverity.critical}</div>
                      </div>
                      <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                        <div className="text-muted-foreground">High</div>
                        <div className="text-xl font-bold text-orange-400">{stats.bySeverity.high}</div>
                      </div>
                      <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                        <div className="text-muted-foreground">Medium</div>
                        <div className="text-xl font-bold text-yellow-400">{stats.bySeverity.medium}</div>
                      </div>
                      <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="text-muted-foreground">Low</div>
                        <div className="text-xl font-bold text-blue-400">{stats.bySeverity.low}</div>
                      </div>
                    </div>

                    <div className="p-3 bg-muted/20 rounded-lg">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Resolution Rate</span>
                        <span className="text-emerald-400">{((stats.resolved / stats.total) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 transition-all"
                          style={{ width: `${(stats.resolved / stats.total) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-muted/20 rounded-lg text-xs">
                      <div className="text-muted-foreground">Avg Response Time</div>
                      <div className="text-lg font-bold text-cyan-400">{stats.avgResponseTime.toFixed(1)} min</div>
                    </div>

                    <div className="pt-4 border-t border-border/50">
                      <div className="text-xs text-muted-foreground mb-2">Recent Incidents</div>
                      <div className="space-y-2">
                        {historicalThreats.slice(0, 4).map(threat => (
                          <div 
                            key={threat.id}
                            className="p-2 bg-muted/20 rounded text-xs flex items-center gap-2"
                          >
                            {threat.type === 'poaching' && <Shield className="h-3 w-3 text-red-400" />}
                            {threat.type === 'fire' && <Flame className="h-3 w-3 text-orange-400" />}
                            {threat.type === 'wildlife_conflict' && <AlertTriangle className="h-3 w-3 text-yellow-400" />}
                            <span className="flex-1 truncate">{threat.park}</span>
                            <Badge 
                              variant="outline" 
                              className={`text-[8px] ${
                                threat.resolved ? 'text-green-400' : 'text-red-400'
                              }`}
                            >
                              {threat.resolved ? 'Resolved' : 'Active'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default AIVoiceOfParksPage;
