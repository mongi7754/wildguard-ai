import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import DetectPage from "./pages/DetectPage";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/parks" element={<ProtectedRoute><ParksPage /></ProtectedRoute>} />
          <Route path="/detect" element={<ProtectedRoute><DetectPage /></ProtectedRoute>} />
          <Route path="/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
          <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
          <Route path="/drone" element={<ProtectedRoute><DronePage /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/biometric" element={<ProtectedRoute><BiometricIdentityPage /></ProtectedRoute>} />
          <Route path="/intelligence" element={<ProtectedRoute><IntelligenceGraphPage /></ProtectedRoute>} />
          <Route path="/commander" element={<ProtectedRoute><AutonomousCommanderPage /></ProtectedRoute>} />
          <Route path="/assistant" element={<ProtectedRoute><AIAssistantPage /></ProtectedRoute>} />
          <Route path="/predictions" element={<ProtectedRoute><ThreatPredictionPage /></ProtectedRoute>} />
          <Route path="/digital-twin" element={<ProtectedRoute><DigitalTwinPage /></ProtectedRoute>} />
          <Route path="/voice" element={<ProtectedRoute><VoiceCommandPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
