import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Upload, Camera, FileText, AlertTriangle, Brain,
  MapPin, Calendar, DollarSign, CheckCircle, Loader2,
  Image, Trash2, Shield, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface ClaimsSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  parkId?: string;
}

interface ClaimFormData {
  claimType: string;
  parkId: string;
  incidentDate: string;
  description: string;
  estimatedLoss: string;
  location: { lat: string; lng: string };
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

interface UploadedPhoto {
  id: string;
  file: File;
  preview: string;
  aiAnalysis?: {
    verified: boolean;
    confidence: number;
    findings: string[];
    fraudRisk: 'low' | 'medium' | 'high';
  };
}

export const ClaimsSubmissionModal = ({ isOpen, onClose, parkId }: ClaimsSubmissionModalProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [formData, setFormData] = useState<ClaimFormData>({
    claimType: '',
    parkId: parkId || '',
    incidentDate: '',
    description: '',
    estimatedLoss: '',
    location: { lat: '', lng: '' },
    contactName: '',
    contactPhone: '',
    contactEmail: ''
  });

  const claimTypes = [
    { value: 'wildlife_mortality', label: 'Wildlife Mortality' },
    { value: 'poaching_incident', label: 'Poaching Incident' },
    { value: 'fire_damage', label: 'Fire/Wildfire Damage' },
    { value: 'human_wildlife_conflict', label: 'Human-Wildlife Conflict' },
    { value: 'infrastructure_damage', label: 'Infrastructure Damage' },
    { value: 'drought_impact', label: 'Drought Impact' }
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto: UploadedPhoto = {
          id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          preview: e.target?.result as string
        };
        setPhotos(prev => [...prev, newPhoto]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(p => p.id !== photoId));
  };

  const analyzePhotos = async () => {
    if (photos.length === 0) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPhotos(prev => prev.map(photo => ({
      ...photo,
      aiAnalysis: {
        verified: Math.random() > 0.2,
        confidence: Math.round(75 + Math.random() * 20),
        findings: [
          'Image timestamp verified',
          'GPS coordinates match claim location',
          Math.random() > 0.5 ? 'Wildlife species identified' : 'Damage assessment consistent',
          'No signs of image manipulation detected'
        ],
        fraudRisk: Math.random() > 0.8 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
      }
    })));
    
    setIsAnalyzing(false);
    toast({
      title: "AI Analysis Complete",
      description: `${photos.length} photo(s) analyzed for fraud detection`
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Claim Submitted Successfully",
      description: `Claim #CLM-${Date.now().toString().slice(-6)} has been registered`
    });
    
    setIsSubmitting(false);
    onClose();
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/50';
      case 'medium': return 'text-amber-400 bg-amber-500/20 border-amber-500/50';
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/50';
      default: return 'text-muted-foreground bg-muted/20';
    }
  };

  const overallFraudRisk = photos.length > 0 && photos.every(p => p.aiAnalysis) 
    ? photos.some(p => p.aiAnalysis?.fraudRisk === 'high') ? 'high' 
      : photos.some(p => p.aiAnalysis?.fraudRisk === 'medium') ? 'medium' : 'low'
    : null;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card border border-border rounded-xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <FileText className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold">Submit Insurance Claim</h3>
                <p className="text-xs text-muted-foreground">
                  Step {step} of 3 - {step === 1 ? 'Incident Details' : step === 2 ? 'Evidence Upload' : 'Review & Submit'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress */}
          <div className="px-4 py-2 bg-muted/20">
            <Progress value={(step / 3) * 100} className="h-2" />
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Claim Type</Label>
                    <Select 
                      value={formData.claimType} 
                      onValueChange={(value) => setFormData({...formData, claimType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select claim type" />
                      </SelectTrigger>
                      <SelectContent>
                        {claimTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Incident Date</Label>
                    <Input 
                      type="date" 
                      value={formData.incidentDate}
                      onChange={(e) => setFormData({...formData, incidentDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description of Incident</Label>
                  <Textarea 
                    placeholder="Provide detailed description of the incident..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Estimated Loss (KES)</Label>
                    <Input 
                      type="number" 
                      placeholder="0"
                      value={formData.estimatedLoss}
                      onChange={(e) => setFormData({...formData, estimatedLoss: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Park/Location</Label>
                    <Select 
                      value={formData.parkId} 
                      onValueChange={(value) => setFormData({...formData, parkId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select park" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masai-mara">Masai Mara</SelectItem>
                        <SelectItem value="tsavo-east">Tsavo East</SelectItem>
                        <SelectItem value="tsavo-west">Tsavo West</SelectItem>
                        <SelectItem value="amboseli">Amboseli</SelectItem>
                        <SelectItem value="mt-kenya">Mt. Kenya</SelectItem>
                        <SelectItem value="samburu">Samburu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>GPS Latitude</Label>
                    <Input 
                      placeholder="-1.4061"
                      value={formData.location.lat}
                      onChange={(e) => setFormData({...formData, location: {...formData.location, lat: e.target.value}})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>GPS Longitude</Label>
                    <Input 
                      placeholder="35.1058"
                      value={formData.location.lng}
                      onChange={(e) => setFormData({...formData, location: {...formData.location, lng: e.target.value}})}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <Card className="border-dashed">
                  <CardContent className="p-6">
                    <div 
                      className="text-center cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h4 className="font-medium mb-1">Upload Evidence Photos</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Drag & drop or click to upload photos of the incident
                      </p>
                      <Button variant="outline">
                        <Camera className="h-4 w-4 mr-2" />
                        Select Photos
                      </Button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </CardContent>
                </Card>

                {photos.length > 0 && (
                  <>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{photos.length} Photo(s) Uploaded</h4>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={analyzePhotos}
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Brain className="h-4 w-4 mr-2" />
                            AI Fraud Analysis
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {photos.map((photo) => (
                        <Card key={photo.id} className="overflow-hidden">
                          <div className="relative aspect-square">
                            <img 
                              src={photo.preview} 
                              alt="Evidence" 
                              className="w-full h-full object-cover"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-6 w-6"
                              onClick={() => removePhoto(photo.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                            {photo.aiAnalysis && (
                              <div className="absolute bottom-0 inset-x-0 p-2 bg-black/70">
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline" className={`text-[9px] ${getRiskColor(photo.aiAnalysis.fraudRisk)}`}>
                                    {photo.aiAnalysis.fraudRisk} risk
                                  </Badge>
                                  <span className="text-[10px] text-white">
                                    {photo.aiAnalysis.confidence}% conf.
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                          {photo.aiAnalysis && (
                            <CardContent className="p-2 text-xs">
                              <div className="space-y-1">
                                {photo.aiAnalysis.findings.slice(0, 2).map((finding, i) => (
                                  <div key={i} className="flex items-center gap-1 text-muted-foreground">
                                    <CheckCircle className="h-3 w-3 text-green-400" />
                                    <span>{finding}</span>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      ))}
                    </div>

                    {overallFraudRisk && (
                      <Card className={`${getRiskColor(overallFraudRisk)} border`}>
                        <CardContent className="p-4 flex items-center gap-3">
                          <Shield className="h-5 w-5" />
                          <div>
                            <div className="font-medium text-sm">AI Fraud Detection Result</div>
                            <div className="text-xs opacity-80">
                              Overall fraud risk: {overallFraudRisk.toUpperCase()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <Card className="bg-muted/20">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">Claim Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <p className="font-medium">{claimTypes.find(t => t.value === formData.claimType)?.label || '-'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Date:</span>
                        <p className="font-medium">{formData.incidentDate || '-'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Estimated Loss:</span>
                        <p className="font-medium">KES {Number(formData.estimatedLoss).toLocaleString() || '-'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Evidence:</span>
                        <p className="font-medium">{photos.length} photo(s)</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Description:</span>
                      <p className="font-medium">{formData.description || '-'}</p>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Contact Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input 
                        placeholder="John Doe"
                        value={formData.contactName}
                        onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input 
                        placeholder="+254..."
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input 
                      type="email"
                      placeholder="email@example.com"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                    />
                  </div>
                </div>

                {overallFraudRisk && (
                  <Card className={`${getRiskColor(overallFraudRisk)} border`}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <Shield className="h-5 w-5" />
                      <div>
                        <div className="font-medium text-sm">AI Verification Status</div>
                        <div className="text-xs opacity-80">
                          Evidence verified with {overallFraudRisk} fraud risk
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-border bg-muted/30">
            <Button 
              variant="outline" 
              onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </Button>
            
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)}>
                Continue
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit Claim
                  </>
                )}
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
