-- Drop all existing public read policies
DROP POLICY IF EXISTS "Public read autonomous_decisions" ON public.autonomous_decisions;
DROP POLICY IF EXISTS "Public read conservation_credits" ON public.conservation_credits;
DROP POLICY IF EXISTS "Public read digital_twin_simulations" ON public.digital_twin_simulations;
DROP POLICY IF EXISTS "Public read evidence_ledger" ON public.evidence_ledger;
DROP POLICY IF EXISTS "Public read intelligence_edges" ON public.intelligence_edges;
DROP POLICY IF EXISTS "Public read intelligence_nodes" ON public.intelligence_nodes;
DROP POLICY IF EXISTS "Public read ranger_wellness" ON public.ranger_wellness;
DROP POLICY IF EXISTS "Public read sensor_trust_scores" ON public.sensor_trust_scores;
DROP POLICY IF EXISTS "Public read threat_predictions" ON public.threat_predictions;
DROP POLICY IF EXISTS "Public read wildlife_health_records" ON public.wildlife_health_records;
DROP POLICY IF EXISTS "Public read wildlife_identities" ON public.wildlife_identities;

-- Drop existing system insert/update policies to replace with authenticated ones
DROP POLICY IF EXISTS "System insert autonomous_decisions" ON public.autonomous_decisions;
DROP POLICY IF EXISTS "System insert conservation_credits" ON public.conservation_credits;
DROP POLICY IF EXISTS "System insert digital_twin_simulations" ON public.digital_twin_simulations;
DROP POLICY IF EXISTS "System update digital_twin_simulations" ON public.digital_twin_simulations;
DROP POLICY IF EXISTS "System insert evidence_ledger" ON public.evidence_ledger;
DROP POLICY IF EXISTS "System insert intelligence_edges" ON public.intelligence_edges;
DROP POLICY IF EXISTS "System insert intelligence_nodes" ON public.intelligence_nodes;
DROP POLICY IF EXISTS "System insert ranger_wellness" ON public.ranger_wellness;
DROP POLICY IF EXISTS "System insert sensor_trust_scores" ON public.sensor_trust_scores;
DROP POLICY IF EXISTS "System update sensor_trust_scores" ON public.sensor_trust_scores;
DROP POLICY IF EXISTS "System insert threat_predictions" ON public.threat_predictions;
DROP POLICY IF EXISTS "System update threat_predictions" ON public.threat_predictions;
DROP POLICY IF EXISTS "System insert wildlife_health_records" ON public.wildlife_health_records;
DROP POLICY IF EXISTS "System insert wildlife_identities" ON public.wildlife_identities;
DROP POLICY IF EXISTS "System update wildlife_identities" ON public.wildlife_identities;

-- Create authenticated-only read policies for all tables
CREATE POLICY "Authenticated read autonomous_decisions"
ON public.autonomous_decisions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated read conservation_credits"
ON public.conservation_credits FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated read digital_twin_simulations"
ON public.digital_twin_simulations FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated read evidence_ledger"
ON public.evidence_ledger FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated read intelligence_edges"
ON public.intelligence_edges FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated read intelligence_nodes"
ON public.intelligence_nodes FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated read ranger_wellness"
ON public.ranger_wellness FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated read sensor_trust_scores"
ON public.sensor_trust_scores FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated read threat_predictions"
ON public.threat_predictions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated read wildlife_health_records"
ON public.wildlife_health_records FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated read wildlife_identities"
ON public.wildlife_identities FOR SELECT
TO authenticated
USING (true);

-- Create authenticated-only insert policies
CREATE POLICY "Authenticated insert autonomous_decisions"
ON public.autonomous_decisions FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated insert conservation_credits"
ON public.conservation_credits FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated insert digital_twin_simulations"
ON public.digital_twin_simulations FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated insert evidence_ledger"
ON public.evidence_ledger FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated insert intelligence_edges"
ON public.intelligence_edges FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated insert intelligence_nodes"
ON public.intelligence_nodes FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated insert ranger_wellness"
ON public.ranger_wellness FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated insert sensor_trust_scores"
ON public.sensor_trust_scores FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated insert threat_predictions"
ON public.threat_predictions FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated insert wildlife_health_records"
ON public.wildlife_health_records FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated insert wildlife_identities"
ON public.wildlife_identities FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create authenticated-only update policies for tables that had them
CREATE POLICY "Authenticated update digital_twin_simulations"
ON public.digital_twin_simulations FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated update sensor_trust_scores"
ON public.sensor_trust_scores FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated update threat_predictions"
ON public.threat_predictions FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated update wildlife_identities"
ON public.wildlife_identities FOR UPDATE
TO authenticated
USING (true);