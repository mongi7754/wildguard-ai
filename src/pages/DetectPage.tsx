import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  Scan, 
  Crosshair,
  Check,
  AlertTriangle,
  RefreshCw,
  ImageIcon
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Detection {
  id: string;
  type: 'wildlife' | 'threat' | 'vehicle';
  label: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

const mockDetections: Detection[] = [
  { id: '1', type: 'wildlife', label: 'African Elephant', confidence: 0.97, x: 20, y: 25, width: 35, height: 45 },
  { id: '2', type: 'wildlife', label: 'Zebra', confidence: 0.89, x: 65, y: 40, width: 20, height: 30 },
];

export default function DetectPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    setHasImage(true);
    setDetections([]);
    setScanProgress(0);
  };

  const handleScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setDetections([]);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setDetections(mockDetections);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleReset = () => {
    setHasImage(false);
    setDetections([]);
    setScanProgress(0);
  };

  return (
    <AppLayout title="AI Detection">
      <div className="px-4 py-4 space-y-4">
        {/* Detection Area */}
        <Card variant="glow" className="overflow-hidden">
          <div className="relative aspect-[4/3] bg-muted">
            {!hasImage ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                  <ImageIcon className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload an image or capture from camera
                </p>
                <div className="flex gap-3">
                  <Button variant="tactical" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                  <Button variant="default" onClick={handleFileSelect}>
                    <Camera className="w-4 h-4 mr-2" />
                    Camera
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            ) : (
              <>
                {/* Simulated image background */}
                <div className="absolute inset-0 bg-gradient-to-br from-forest-dark to-forest opacity-30" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAyMCAwIEwgMCAwIDAgMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxMDAsMjAwLDE1MCwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />
                
                {/* Scanning overlay */}
                {isScanning && (
                  <motion.div 
                    className="absolute inset-0 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                      animate={{ 
                        top: ['0%', '100%', '0%']
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    <div className="absolute inset-0 bg-primary/5" />
                  </motion.div>
                )}

                {/* Detection boxes */}
                <AnimatePresence>
                  {detections.map((detection) => (
                    <motion.div
                      key={detection.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={cn(
                        "absolute border-2 rounded",
                        detection.type === 'wildlife' ? "border-primary" :
                        detection.type === 'threat' ? "border-danger" : "border-accent"
                      )}
                      style={{
                        left: `${detection.x}%`,
                        top: `${detection.y}%`,
                        width: `${detection.width}%`,
                        height: `${detection.height}%`
                      }}
                    >
                      <div className={cn(
                        "absolute -top-6 left-0 px-2 py-0.5 rounded text-xs font-medium",
                        detection.type === 'wildlife' ? "bg-primary text-primary-foreground" :
                        detection.type === 'threat' ? "bg-danger text-danger-foreground" : "bg-accent text-accent-foreground"
                      )}>
                        {detection.label} ({Math.round(detection.confidence * 100)}%)
                      </div>
                      <Crosshair className={cn(
                        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 opacity-50",
                        detection.type === 'wildlife' ? "text-primary" :
                        detection.type === 'threat' ? "text-danger" : "text-accent"
                      )} />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Crosshair overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-primary/20" />
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/20" />
                </div>

                {/* Corner brackets */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/50" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/50" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/50" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/50" />
              </>
            )}
          </div>
        </Card>

        {/* Progress & Actions */}
        {hasImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card variant="tactical">
              <CardContent className="p-4">
                {isScanning ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Analyzing...</span>
                      <span className="text-sm text-primary">{scanProgress}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${scanProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Running YOLOv10 + SAM2 detection models...
                    </p>
                  </div>
                ) : detections.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-success" />
                      <span className="font-medium">Detection Complete</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Found {detections.length} objects in image
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleScan}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Re-scan
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleReset}>
                        New Image
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Button variant="glow" className="flex-1" onClick={handleScan}>
                      <Scan className="w-4 h-4 mr-2" />
                      Start AI Detection
                    </Button>
                    <Button variant="outline" onClick={handleReset}>
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Detection Results */}
        {detections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <h3 className="font-display font-semibold text-sm">Detection Results</h3>
            {detections.map((detection) => (
              <Card key={detection.id} variant="tactical" className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      detection.type === 'wildlife' ? "bg-primary/20 text-primary" :
                      detection.type === 'threat' ? "bg-danger/20 text-danger" : "bg-accent/20 text-accent"
                    )}>
                      {detection.type === 'wildlife' ? '🐘' : 
                       detection.type === 'threat' ? <AlertTriangle className="w-5 h-5" /> : '🚗'}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{detection.label}</p>
                      <p className="text-xs text-muted-foreground capitalize">{detection.type}</p>
                    </div>
                  </div>
                  <Badge variant={detection.confidence > 0.9 ? 'success' : 'warning'}>
                    {Math.round(detection.confidence * 100)}%
                  </Badge>
                </div>
              </Card>
            ))}
          </motion.div>
        )}

        {/* AI Models Info */}
        <Card variant="ghost" className="p-4 bg-secondary/30">
          <div className="flex items-start gap-3">
            <Scan className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">AI-Powered Detection</p>
              <p className="text-xs text-muted-foreground mt-1">
                Using YOLOv10 for real-time object detection and SAM2 for precise segmentation. 
                Supports wildlife species, human intrusion, vehicles, and environmental threats.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
