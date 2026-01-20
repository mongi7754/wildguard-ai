import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileSearch, Shield, Lock, Hash, Camera, Video,
  MapPin, Clock, CheckCircle2, AlertTriangle, Download,
  Eye, FileText, Fingerprint, Link2, Database, Scale
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EvidenceRecord {
  id: string;
  caseId: string;
  type: 'image' | 'video' | 'gps' | 'sensor' | 'document';
  title: string;
  description: string;
  timestamp: Date;
  location: { lat: number; lng: number } | null;
  hash: string;
  previousHash: string;
  verified: boolean;
  courtAdmissible: boolean;
  chainOfCustody: {
    actor: string;
    action: string;
    timestamp: Date;
  }[];
  mediaUrl?: string;
}

const mockEvidence: EvidenceRecord[] = [
  {
    id: 'ev-001',
    caseId: 'POACH-2024-00089',
    type: 'video',
    title: 'Drone Footage - Suspected Poaching Activity',
    description: 'Thermal imaging footage captured by DRN-TE-002 showing suspicious vehicle and movement patterns near elephant herd.',
    timestamp: new Date('2024-01-15T03:42:00'),
    location: { lat: -3.0739, lng: 38.7600 },
    hash: 'SHA256:7f3a2e89d1c4b5f8a9c2e1d4b7a3f6e9',
    previousHash: 'SHA256:4c8b1d6e3f2a9c7b5d8e4f1a2b3c6d9e',
    verified: true,
    courtAdmissible: true,
    chainOfCustody: [
      { actor: 'DRN-TE-002 (Automated)', action: 'Captured', timestamp: new Date('2024-01-15T03:42:00') },
      { actor: 'KWS-AI System', action: 'Hash Generated', timestamp: new Date('2024-01-15T03:42:01') },
      { actor: 'Ranger J. Mwangi', action: 'Reviewed & Verified', timestamp: new Date('2024-01-15T05:15:00') },
      { actor: 'Evidence Vault', action: 'Blockchain Recorded', timestamp: new Date('2024-01-15T05:16:00') }
    ]
  },
  {
    id: 'ev-002',
    caseId: 'POACH-2024-00089',
    type: 'gps',
    title: 'Vehicle Tracking Data',
    description: 'GPS coordinates and movement pattern of unregistered vehicle in restricted zone.',
    timestamp: new Date('2024-01-15T03:38:00'),
    location: { lat: -3.0745, lng: 38.7612 },
    hash: 'SHA256:9d2c4e7f8a1b3c6d5e8f9a2b4c7d1e3f',
    previousHash: 'SHA256:7f3a2e89d1c4b5f8a9c2e1d4b7a3f6e9',
    verified: true,
    courtAdmissible: true,
    chainOfCustody: [
      { actor: 'Sensor Network', action: 'Motion Detected', timestamp: new Date('2024-01-15T03:38:00') },
      { actor: 'KWS-AI System', action: 'Vehicle Identified', timestamp: new Date('2024-01-15T03:38:02') },
      { actor: 'Evidence Vault', action: 'Blockchain Recorded', timestamp: new Date('2024-01-15T03:38:05') }
    ]
  },
  {
    id: 'ev-003',
    caseId: 'POACH-2024-00089',
    type: 'image',
    title: 'Camera Trap - Suspect Vehicle',
    description: 'High-resolution image of suspect vehicle with partial license plate visible.',
    timestamp: new Date('2024-01-15T03:40:00'),
    location: { lat: -3.0742, lng: 38.7608 },
    hash: 'SHA256:1e5d7a9c3f2b8e4d6c9a1f3b5e7d2c8a',
    previousHash: 'SHA256:9d2c4e7f8a1b3c6d5e8f9a2b4c7d1e3f',
    verified: true,
    courtAdmissible: true,
    chainOfCustody: [
      { actor: 'Camera Trap CT-TE-156', action: 'Captured', timestamp: new Date('2024-01-15T03:40:00') },
      { actor: 'KWS-AI System', action: 'AI Enhancement Applied', timestamp: new Date('2024-01-15T03:40:05') },
      { actor: 'Evidence Vault', action: 'Blockchain Recorded', timestamp: new Date('2024-01-15T03:40:08') }
    ]
  },
  {
    id: 'ev-004',
    caseId: 'FIRE-2024-00023',
    type: 'sensor',
    title: 'Fire Sensor Alert Data',
    description: 'Multi-sensor data package including smoke, temperature, and wind readings.',
    timestamp: new Date('2024-01-12T14:22:00'),
    location: { lat: -1.4061, lng: 35.0400 },
    hash: 'SHA256:6b4d9e2a8c1f5d3b7e9a4c6f2d8b1e5a',
    previousHash: 'SHA256:3a7c2e9d4b1f8a5c6e3d9b2f7a4c1e8d',
    verified: true,
    courtAdmissible: false,
    chainOfCustody: [
      { actor: 'Sensor Network', action: 'Fire Detected', timestamp: new Date('2024-01-12T14:22:00') },
      { actor: 'Evidence Vault', action: 'Blockchain Recorded', timestamp: new Date('2024-01-12T14:22:03') }
    ]
  }
];

const ForensicEvidencePage = () => {
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4 text-purple-400" />;
      case 'image': return <Camera className="h-4 w-4 text-blue-400" />;
      case 'gps': return <MapPin className="h-4 w-4 text-green-400" />;
      case 'sensor': return <Database className="h-4 w-4 text-cyan-400" />;
      case 'document': return <FileText className="h-4 w-4 text-amber-400" />;
      default: return <FileSearch className="h-4 w-4" />;
    }
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30">
              <FileSearch className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Digital Forensic Evidence Vault</h1>
              <p className="text-sm text-muted-foreground">
                Blockchain-verified, court-admissible evidence management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Shield className="h-3 w-3 mr-1" />
              Tamper-Proof
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              <Scale className="h-3 w-3 mr-1" />
              Court-Ready
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4">
          <Card className="bg-card/50 border-cyan-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-cyan-400">12,847</p>
              <p className="text-xs text-muted-foreground">Total Records</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-green-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-green-400">99.9%</p>
              <p className="text-xs text-muted-foreground">Integrity Verified</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-purple-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-purple-400">8,234</p>
              <p className="text-xs text-muted-foreground">Court Admissible</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-amber-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-amber-400">156</p>
              <p className="text-xs text-muted-foreground">Active Cases</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-red-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-red-400">89%</p>
              <p className="text-xs text-muted-foreground">Conviction Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <FileSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by case ID, hash, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Hash className="h-4 w-4 mr-2" />
            Verify Hash
          </Button>
        </div>

        {/* Evidence Grid & Detail */}
        <div className="grid grid-cols-3 gap-6">
          {/* Evidence List */}
          <div className="col-span-2 space-y-3">
            <AnimatePresence>
              {mockEvidence.map((evidence, index) => (
                <motion.div
                  key={evidence.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all ${
                      selectedEvidence?.id === evidence.id 
                        ? 'bg-primary/10 border-primary/50' 
                        : 'bg-card/50 hover:bg-card/80'
                    }`}
                    onClick={() => setSelectedEvidence(evidence)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-muted/50">
                            {getTypeIcon(evidence.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-xs text-cyan-400">{evidence.caseId}</span>
                              {evidence.verified && (
                                <Badge className="bg-green-500/20 text-green-400 text-[10px]">
                                  <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />
                                  Verified
                                </Badge>
                              )}
                              {evidence.courtAdmissible && (
                                <Badge className="bg-purple-500/20 text-purple-400 text-[10px]">
                                  <Scale className="h-2.5 w-2.5 mr-0.5" />
                                  Court-Ready
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-semibold text-sm">{evidence.title}</h3>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {evidence.description}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {evidence.timestamp.toLocaleString()}
                              </span>
                              {evidence.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {evidence.location.lat.toFixed(4)}°
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {evidence.type}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Detail Panel */}
          <div>
            {selectedEvidence ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <Card className="bg-card/50 border-red-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      {getTypeIcon(selectedEvidence.type)}
                      Evidence Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/30 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Case ID</p>
                      <p className="font-mono text-cyan-400">{selectedEvidence.caseId}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Cryptographic Hash</p>
                      <code className="text-[10px] bg-muted/50 px-2 py-1 rounded block overflow-hidden text-ellipsis text-green-400">
                        {selectedEvidence.hash}
                      </code>
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Previous Hash</p>
                      <code className="text-[10px] bg-muted/50 px-2 py-1 rounded block overflow-hidden text-ellipsis">
                        {selectedEvidence.previousHash}
                      </code>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {selectedEvidence.verified && (
                        <Badge className="bg-green-500/20 text-green-400">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Integrity Verified
                        </Badge>
                      )}
                      {selectedEvidence.courtAdmissible && (
                        <Badge className="bg-purple-500/20 text-purple-400">
                          <Scale className="h-3 w-3 mr-1" />
                          Admissible
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="h-3 w-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Chain of Custody */}
                <Card className="bg-card/50 border-amber-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-amber-400" />
                      Chain of Custody
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedEvidence.chainOfCustody.map((entry, idx) => (
                        <div key={idx} className="relative pl-4 pb-3 border-l-2 border-border/50 last:pb-0">
                          <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-cyan-400 -translate-x-[5px]" />
                          <p className="text-xs font-medium">{entry.action}</p>
                          <p className="text-[10px] text-muted-foreground">{entry.actor}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {entry.timestamp.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="bg-card/50 border-dashed h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <Lock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Select evidence to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ForensicEvidencePage;
