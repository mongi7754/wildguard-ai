import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { FireMetricsCards } from '@/components/fire/FireMetricsCards';
import { SmokeDetectionGrid } from '@/components/fire/SmokeDetectionGrid';
import { FireRiskPrediction } from '@/components/fire/FireRiskPrediction';
import { EmergencyEscalation } from '@/components/fire/EmergencyEscalation';
import { fireSensors, fireAlerts as initialAlerts, fireRiskZones } from '@/data/fireDetectionData';
import { FireAlert } from '@/types/fire';
import { Flame } from 'lucide-react';
import { toast } from 'sonner';

const FireDetectionPage = () => {
  const [alerts, setAlerts] = useState<FireAlert[]>(initialAlerts);

  const activeSensors = fireSensors.filter(s => s.status === 'active').length;
  const triggeredSensors = fireSensors.filter(s => s.status === 'triggered').length;
  const activeAlerts = alerts.filter(a => a.status === 'active').length;
  const highRiskZones = fireRiskZones.filter(z => z.riskLevel === 'high' || z.riskLevel === 'extreme').length;
  const avgConfidence = Math.round(
    fireSensors.reduce((acc, s) => acc + (s.aiConfidence || 0), 0) / fireSensors.length
  );

  const handleAcknowledge = (alertId: string, stepIndex: number) => {
    setAlerts(prev => prev.map(alert => {
      if (alert.id === alertId) {
        const updatedSteps = [...alert.escalationStatus];
        updatedSteps[stepIndex] = {
          ...updatedSteps[stepIndex],
          acknowledged: true,
          acknowledgedBy: 'Current User',
          acknowledgedAt: new Date().toISOString()
        };
        return { ...alert, escalationStatus: updatedSteps };
      }
      return alert;
    }));
    toast.success('Escalation step acknowledged');
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/10">
            <Flame className="h-6 w-6 text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Fire & Smoke Detection System</h1>
            <p className="text-muted-foreground">AI-powered fire detection with automated emergency response</p>
          </div>
        </div>

        <FireMetricsCards
          totalSensors={fireSensors.length}
          activeSensors={activeSensors}
          triggeredSensors={triggeredSensors}
          activeAlerts={activeAlerts}
          riskZonesHigh={highRiskZones}
          avgAiConfidence={avgConfidence}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SmokeDetectionGrid sensors={fireSensors} />
          <FireRiskPrediction riskZones={fireRiskZones} />
        </div>

        <EmergencyEscalation alerts={alerts} onAcknowledge={handleAcknowledge} />
      </div>
    </AppLayout>
  );
};

export default FireDetectionPage;
