export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      autonomous_decisions: {
        Row: {
          action_taken: string
          confidence: number
          created_at: string
          decision_type: string
          human_override: boolean | null
          id: string
          outcome: string | null
          parameters: Json | null
          trigger_event: string
        }
        Insert: {
          action_taken: string
          confidence: number
          created_at?: string
          decision_type: string
          human_override?: boolean | null
          id?: string
          outcome?: string | null
          parameters?: Json | null
          trigger_event: string
        }
        Update: {
          action_taken?: string
          confidence?: number
          created_at?: string
          decision_type?: string
          human_override?: boolean | null
          id?: string
          outcome?: string | null
          parameters?: Json | null
          trigger_event?: string
        }
        Relationships: []
      }
      conservation_credits: {
        Row: {
          credit_amount: number
          entity_name: string
          entity_type: string
          id: string
          impact_metrics: Json | null
          issued_at: string
          verification_status: string | null
        }
        Insert: {
          credit_amount?: number
          entity_name: string
          entity_type: string
          id?: string
          impact_metrics?: Json | null
          issued_at?: string
          verification_status?: string | null
        }
        Update: {
          credit_amount?: number
          entity_name?: string
          entity_type?: string
          id?: string
          impact_metrics?: Json | null
          issued_at?: string
          verification_status?: string | null
        }
        Relationships: []
      }
      digital_twin_simulations: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          parameters: Json
          park_id: string
          results: Json | null
          scenario_type: string
          simulation_name: string
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          parameters?: Json
          park_id: string
          results?: Json | null
          scenario_type: string
          simulation_name: string
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          parameters?: Json
          park_id?: string
          results?: Json | null
          scenario_type?: string
          simulation_name?: string
          status?: string | null
        }
        Relationships: []
      }
      evidence_ledger: {
        Row: {
          event_data: Json
          event_type: string
          hash: string
          id: string
          location: Json | null
          media_urls: string[] | null
          park_id: string | null
          previous_hash: string | null
          timestamp: string
          verified: boolean | null
        }
        Insert: {
          event_data: Json
          event_type: string
          hash: string
          id?: string
          location?: Json | null
          media_urls?: string[] | null
          park_id?: string | null
          previous_hash?: string | null
          timestamp?: string
          verified?: boolean | null
        }
        Update: {
          event_data?: Json
          event_type?: string
          hash?: string
          id?: string
          location?: Json | null
          media_urls?: string[] | null
          park_id?: string | null
          previous_hash?: string | null
          timestamp?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      intelligence_edges: {
        Row: {
          created_at: string
          id: string
          properties: Json | null
          relationship_type: string
          source_id: string | null
          target_id: string | null
          weight: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          properties?: Json | null
          relationship_type: string
          source_id?: string | null
          target_id?: string | null
          weight?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          properties?: Json | null
          relationship_type?: string
          source_id?: string | null
          target_id?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "intelligence_edges_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "intelligence_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intelligence_edges_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "intelligence_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      intelligence_nodes: {
        Row: {
          created_at: string
          id: string
          label: string
          last_updated: string
          node_type: string
          properties: Json | null
          risk_score: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          last_updated?: string
          node_type: string
          properties?: Json | null
          risk_score?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          last_updated?: string
          node_type?: string
          properties?: Json | null
          risk_score?: number | null
        }
        Relationships: []
      }
      ranger_wellness: {
        Row: {
          fatigue_score: number | null
          heart_rate: number | null
          hours_on_duty: number | null
          id: string
          ranger_id: string
          recommendation: string | null
          recorded_at: string
          stress_level: number | null
        }
        Insert: {
          fatigue_score?: number | null
          heart_rate?: number | null
          hours_on_duty?: number | null
          id?: string
          ranger_id: string
          recommendation?: string | null
          recorded_at?: string
          stress_level?: number | null
        }
        Update: {
          fatigue_score?: number | null
          heart_rate?: number | null
          hours_on_duty?: number | null
          id?: string
          ranger_id?: string
          recommendation?: string | null
          recorded_at?: string
          stress_level?: number | null
        }
        Relationships: []
      }
      sensor_trust_scores: {
        Row: {
          anomaly_count: number | null
          created_at: string
          id: string
          last_anomaly_at: string | null
          location: Json | null
          park_id: string
          sensor_id: string
          sensor_type: string
          status: string | null
          trust_score: number | null
          updated_at: string
        }
        Insert: {
          anomaly_count?: number | null
          created_at?: string
          id?: string
          last_anomaly_at?: string | null
          location?: Json | null
          park_id: string
          sensor_id: string
          sensor_type: string
          status?: string | null
          trust_score?: number | null
          updated_at?: string
        }
        Update: {
          anomaly_count?: number | null
          created_at?: string
          id?: string
          last_anomaly_at?: string | null
          location?: Json | null
          park_id?: string
          sensor_id?: string
          sensor_type?: string
          status?: string | null
          trust_score?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      threat_predictions: {
        Row: {
          confidence: number
          contributing_factors: Json | null
          created_at: string
          expires_at: string | null
          id: string
          location: Json
          park_id: string
          predicted_timeframe: string | null
          prediction_type: string
          risk_level: number
          status: string | null
        }
        Insert: {
          confidence: number
          contributing_factors?: Json | null
          created_at?: string
          expires_at?: string | null
          id?: string
          location: Json
          park_id: string
          predicted_timeframe?: string | null
          prediction_type: string
          risk_level: number
          status?: string | null
        }
        Update: {
          confidence?: number
          contributing_factors?: Json | null
          created_at?: string
          expires_at?: string | null
          id?: string
          location?: Json
          park_id?: string
          predicted_timeframe?: string | null
          prediction_type?: string
          risk_level?: number
          status?: string | null
        }
        Relationships: []
      }
      wildlife_health_records: {
        Row: {
          description: string | null
          detected_by: string
          health_event: string
          id: string
          recorded_at: string
          severity: string
          treatment_status: string | null
          wildlife_id: string | null
        }
        Insert: {
          description?: string | null
          detected_by?: string
          health_event: string
          id?: string
          recorded_at?: string
          severity?: string
          treatment_status?: string | null
          wildlife_id?: string | null
        }
        Update: {
          description?: string | null
          detected_by?: string
          health_event?: string
          id?: string
          recorded_at?: string
          severity?: string
          treatment_status?: string | null
          wildlife_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wildlife_health_records_wildlife_id_fkey"
            columns: ["wildlife_id"]
            isOneToOne: false
            referencedRelation: "wildlife_identities"
            referencedColumns: ["id"]
          },
        ]
      }
      wildlife_identities: {
        Row: {
          biometric_signature: Json
          created_at: string
          current_location: Json | null
          estimated_age: number | null
          facial_geometry_data: Json | null
          first_detected_at: string
          health_status: string | null
          horn_shape_data: Json | null
          id: string
          individual_name: string | null
          last_seen_at: string
          movement_history: Json | null
          park_id: string
          reproduction_status: string | null
          species: string
          stripe_pattern_hash: string | null
          total_sightings: number | null
          tusk_curvature_data: Json | null
          updated_at: string
        }
        Insert: {
          biometric_signature?: Json
          created_at?: string
          current_location?: Json | null
          estimated_age?: number | null
          facial_geometry_data?: Json | null
          first_detected_at?: string
          health_status?: string | null
          horn_shape_data?: Json | null
          id?: string
          individual_name?: string | null
          last_seen_at?: string
          movement_history?: Json | null
          park_id: string
          reproduction_status?: string | null
          species: string
          stripe_pattern_hash?: string | null
          total_sightings?: number | null
          tusk_curvature_data?: Json | null
          updated_at?: string
        }
        Update: {
          biometric_signature?: Json
          created_at?: string
          current_location?: Json | null
          estimated_age?: number | null
          facial_geometry_data?: Json | null
          first_detected_at?: string
          health_status?: string | null
          horn_shape_data?: Json | null
          id?: string
          individual_name?: string | null
          last_seen_at?: string
          movement_history?: Json | null
          park_id?: string
          reproduction_status?: string | null
          species?: string
          stripe_pattern_hash?: string | null
          total_sightings?: number | null
          tusk_curvature_data?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
