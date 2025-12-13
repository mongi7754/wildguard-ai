-- Wildlife Biometric Identity System
CREATE TABLE public.wildlife_identities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  species TEXT NOT NULL,
  individual_name TEXT,
  biometric_signature JSONB NOT NULL DEFAULT '{}',
  stripe_pattern_hash TEXT,
  facial_geometry_data JSONB,
  tusk_curvature_data JSONB,
  horn_shape_data JSONB,
  first_detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  total_sightings INTEGER DEFAULT 1,
  health_status TEXT DEFAULT 'healthy',
  reproduction_status TEXT,
  estimated_age INTEGER,
  park_id TEXT NOT NULL,
  current_location JSONB,
  movement_history JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Wildlife Health Records
CREATE TABLE public.wildlife_health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wildlife_id UUID REFERENCES public.wildlife_identities(id) ON DELETE CASCADE,
  health_event TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'low',
  detected_by TEXT NOT NULL DEFAULT 'ai',
  description TEXT,
  treatment_status TEXT DEFAULT 'pending',
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Intelligence Graph Nodes
CREATE TABLE public.intelligence_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_type TEXT NOT NULL,
  label TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  risk_score NUMERIC DEFAULT 0,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Intelligence Graph Edges (Relationships)
CREATE TABLE public.intelligence_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES public.intelligence_nodes(id) ON DELETE CASCADE,
  target_id UUID REFERENCES public.intelligence_nodes(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL,
  weight NUMERIC DEFAULT 1,
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Threat Predictions
CREATE TABLE public.threat_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_type TEXT NOT NULL,
  location JSONB NOT NULL,
  park_id TEXT NOT NULL,
  risk_level NUMERIC NOT NULL,
  confidence NUMERIC NOT NULL,
  predicted_timeframe TEXT,
  contributing_factors JSONB DEFAULT '[]',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ
);

-- Evidence Ledger (Immutable Logs)
CREATE TABLE public.evidence_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL,
  location JSONB,
  park_id TEXT,
  hash TEXT NOT NULL,
  previous_hash TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  verified BOOLEAN DEFAULT false,
  media_urls TEXT[]
);

-- Sensor Trust Scores
CREATE TABLE public.sensor_trust_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sensor_id TEXT NOT NULL UNIQUE,
  sensor_type TEXT NOT NULL,
  trust_score NUMERIC DEFAULT 100,
  anomaly_count INTEGER DEFAULT 0,
  last_anomaly_at TIMESTAMPTZ,
  status TEXT DEFAULT 'trusted',
  location JSONB,
  park_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Autonomous Decisions Log
CREATE TABLE public.autonomous_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_type TEXT NOT NULL,
  trigger_event TEXT NOT NULL,
  action_taken TEXT NOT NULL,
  parameters JSONB DEFAULT '{}',
  outcome TEXT,
  confidence NUMERIC NOT NULL,
  human_override BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Conservation Credits
CREATE TABLE public.conservation_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_name TEXT NOT NULL,
  credit_amount NUMERIC NOT NULL DEFAULT 0,
  verification_status TEXT DEFAULT 'pending',
  impact_metrics JSONB DEFAULT '{}',
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Digital Twin Simulations
CREATE TABLE public.digital_twin_simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  simulation_name TEXT NOT NULL,
  scenario_type TEXT NOT NULL,
  parameters JSONB NOT NULL DEFAULT '{}',
  results JSONB,
  status TEXT DEFAULT 'pending',
  park_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Ranger Stress Monitoring
CREATE TABLE public.ranger_wellness (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ranger_id TEXT NOT NULL,
  stress_level NUMERIC,
  fatigue_score NUMERIC,
  heart_rate INTEGER,
  hours_on_duty NUMERIC,
  recommendation TEXT,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wildlife_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wildlife_health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intelligence_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intelligence_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensor_trust_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.autonomous_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conservation_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_twin_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ranger_wellness ENABLE ROW LEVEL SECURITY;

-- Public read policies (for demo purposes - in production would be role-based)
CREATE POLICY "Public read wildlife_identities" ON public.wildlife_identities FOR SELECT USING (true);
CREATE POLICY "Public read wildlife_health_records" ON public.wildlife_health_records FOR SELECT USING (true);
CREATE POLICY "Public read intelligence_nodes" ON public.intelligence_nodes FOR SELECT USING (true);
CREATE POLICY "Public read intelligence_edges" ON public.intelligence_edges FOR SELECT USING (true);
CREATE POLICY "Public read threat_predictions" ON public.threat_predictions FOR SELECT USING (true);
CREATE POLICY "Public read evidence_ledger" ON public.evidence_ledger FOR SELECT USING (true);
CREATE POLICY "Public read sensor_trust_scores" ON public.sensor_trust_scores FOR SELECT USING (true);
CREATE POLICY "Public read autonomous_decisions" ON public.autonomous_decisions FOR SELECT USING (true);
CREATE POLICY "Public read conservation_credits" ON public.conservation_credits FOR SELECT USING (true);
CREATE POLICY "Public read digital_twin_simulations" ON public.digital_twin_simulations FOR SELECT USING (true);
CREATE POLICY "Public read ranger_wellness" ON public.ranger_wellness FOR SELECT USING (true);

-- Insert policies for system operations
CREATE POLICY "System insert wildlife_identities" ON public.wildlife_identities FOR INSERT WITH CHECK (true);
CREATE POLICY "System insert wildlife_health_records" ON public.wildlife_health_records FOR INSERT WITH CHECK (true);
CREATE POLICY "System insert intelligence_nodes" ON public.intelligence_nodes FOR INSERT WITH CHECK (true);
CREATE POLICY "System insert intelligence_edges" ON public.intelligence_edges FOR INSERT WITH CHECK (true);
CREATE POLICY "System insert threat_predictions" ON public.threat_predictions FOR INSERT WITH CHECK (true);
CREATE POLICY "System insert evidence_ledger" ON public.evidence_ledger FOR INSERT WITH CHECK (true);
CREATE POLICY "System insert sensor_trust_scores" ON public.sensor_trust_scores FOR INSERT WITH CHECK (true);
CREATE POLICY "System insert autonomous_decisions" ON public.autonomous_decisions FOR INSERT WITH CHECK (true);
CREATE POLICY "System insert conservation_credits" ON public.conservation_credits FOR INSERT WITH CHECK (true);
CREATE POLICY "System insert digital_twin_simulations" ON public.digital_twin_simulations FOR INSERT WITH CHECK (true);
CREATE POLICY "System insert ranger_wellness" ON public.ranger_wellness FOR INSERT WITH CHECK (true);

-- Update policies
CREATE POLICY "System update wildlife_identities" ON public.wildlife_identities FOR UPDATE USING (true);
CREATE POLICY "System update threat_predictions" ON public.threat_predictions FOR UPDATE USING (true);
CREATE POLICY "System update sensor_trust_scores" ON public.sensor_trust_scores FOR UPDATE USING (true);
CREATE POLICY "System update digital_twin_simulations" ON public.digital_twin_simulations FOR UPDATE USING (true);

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.wildlife_identities;
ALTER PUBLICATION supabase_realtime ADD TABLE public.threat_predictions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.evidence_ledger;
ALTER PUBLICATION supabase_realtime ADD TABLE public.autonomous_decisions;