import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import DetectPage from "./pages/DetectPage";
import IoTDashboardPage from "./pages/IoTDashboardPage";
import FireDetectionPage from "./pages/FireDetectionPage";
import LiveSatelliteMapPage from "./pages/LiveSatelliteMapPage";
import AlertsPage from "./pages/AlertsPage";
import MapPage from "./pages/MapPage";
import DronePage from "./pages/DronePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import ParksPage from "./pages/ParksPage";
import BiometricIdentityPage from "./pages/BiometricIdentityPage";
import IntelligenceGraphPage from "./pages/IntelligenceGraphPage";
import AutonomousCommanderPage from "./pages/AutonomousCommanderPage";
import AIAssistantPage from "./pages/AIAssistantPage";
import ThreatPredictionPage from "./pages/ThreatPredictionPage";
import DigitalTwinPage from "./pages/DigitalTwinPage";
import VoiceCommandPage from "./pages/VoiceCommandPage";
import AIVoiceOfParksPage from "./pages/AIVoiceOfParksPage";
import CyberSecurityPage from "./pages/CyberSecurityPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/parks" element={<ParksPage />} />
          <Route path="/detect" element={<DetectPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/drone" element={<DronePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/biometric" element={<BiometricIdentityPage />} />
          <Route path="/intelligence" element={<IntelligenceGraphPage />} />
          <Route path="/commander" element={<AutonomousCommanderPage />} />
          <Route path="/assistant" element={<AIAssistantPage />} />
          <Route path="/predictions" element={<ThreatPredictionPage />} />
          <Route path="/digital-twin" element={<DigitalTwinPage />} />
          <Route path="/voice" element={<VoiceCommandPage />} />
          <Route path="/ai-voice" element={<AIVoiceOfParksPage />} />
          <Route path="/cyber-security" element={<CyberSecurityPage />} />
          <Route path="/iot" element={<IoTDashboardPage />} />
          <Route path="/fire-detection" element={<FireDetectionPage />} />
          <Route path="/satellite-map" element={<LiveSatelliteMapPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
