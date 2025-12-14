import { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Video, VideoOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface DroneCameraProps {
  thermalMode?: boolean;
  nightVision?: boolean;
  isStreaming?: boolean;
  onCapture?: (imageData: string) => void;
}

export function DroneCamera({ 
  thermalMode, 
  nightVision, 
  isStreaming = true,
  onCapture 
}: DroneCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    setIsInitializing(true);
    setCameraError(null);
    
    try {
      // Request camera access
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Prefer back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        setStream(mediaStream);
        setHasCamera(true);
        setCameraError(null);
      }
    } catch (error) {
      console.error('Camera error:', error);
      setHasCamera(false);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setCameraError('Camera access denied. Please grant permission.');
        } else if (error.name === 'NotFoundError') {
          setCameraError('No camera found on this device.');
        } else {
          setCameraError(`Camera error: ${error.message}`);
        }
      }
    } finally {
      setIsInitializing(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setHasCamera(false);
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    // Apply filters if thermal or night vision is active
    if (thermalMode || nightVision) {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        if (thermalMode) {
          // Convert to thermal-like colors
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = Math.min(255, avg * 2);     // Red
          data[i + 1] = avg * 0.5;               // Green
          data[i + 2] = 255 - avg;               // Blue (inverted)
        } else if (nightVision) {
          // Convert to night vision green
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg * 0.2;
          data[i + 1] = Math.min(255, avg * 1.5);
          data[i + 2] = avg * 0.2;
        }
      }
      context.putImageData(imageData, 0, 0);
    }

    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    onCapture?.(imageDataUrl);
    
    toast({
      title: "Frame Captured",
      description: "Image saved for analysis",
    });
  };

  useEffect(() => {
    if (isStreaming) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isStreaming]);

  return (
    <div className="relative w-full h-full bg-forest-dark overflow-hidden">
      {/* Hidden canvas for capture processing */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Video feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-all duration-500",
          !hasCamera && "hidden",
          thermalMode && "sepia saturate-200 hue-rotate-[-20deg] contrast-125",
          nightVision && !thermalMode && "brightness-150 contrast-110 saturate-50 hue-rotate-[70deg]"
        )}
      />

      {/* Fallback/Error state */}
      {!hasCamera && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80">
          {isInitializing ? (
            <>
              <RefreshCw className="w-8 h-8 text-primary animate-spin mb-3" />
              <p className="text-sm text-muted-foreground">Initializing camera...</p>
            </>
          ) : (
            <>
              <CameraOff className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground text-center px-4 mb-4">
                {cameraError || 'Camera unavailable'}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={startCamera}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </Button>
            </>
          )}
        </div>
      )}

      {/* Visual filters overlay */}
      {hasCamera && (
        <div className={cn(
          "absolute inset-0 pointer-events-none transition-all duration-500",
          thermalMode && "bg-gradient-to-br from-orange-900/30 via-transparent to-red-900/30",
          nightVision && !thermalMode && "bg-green-900/20"
        )} />
      )}

      {/* Camera status badge */}
      <div className="absolute top-3 right-3">
        <Badge 
          variant={hasCamera ? 'success' : 'secondary'} 
          className="gap-1 text-xs"
        >
          {hasCamera ? (
            <>
              <Video className="w-3 h-3" />
              LIVE
            </>
          ) : (
            <>
              <VideoOff className="w-3 h-3" />
              OFFLINE
            </>
          )}
        </Badge>
      </div>

      {/* Capture button - only show when camera is active */}
      {hasCamera && (
        <Button
          variant="glow"
          size="icon"
          className="absolute bottom-4 right-4 rounded-full w-12 h-12 shadow-lg"
          onClick={captureFrame}
        >
          <Camera className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
}
