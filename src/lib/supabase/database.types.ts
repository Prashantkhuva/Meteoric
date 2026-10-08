export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      bank_accounts: {
        Row: {
          account_holder: string;
          account_number: string | null;
          bank_name: string | null;
          country: string | null;
          created_at: string;
          currency: string;
          iban: string | null;
          id: number;
          ifsc: string | null;
          is_default: boolean;
          label: string;
          routing_number: string | null;
          swift_bic: string | null;
          upi_id: string | null;
        };
        Insert: {
          account_holder: string;
          account_number?: string | null;
          bank_name?: string | null;
          country?: string | null;
          created_at?: string;
          currency?: string;
          iban?: string | null;
          id?: never;
          ifsc?: string | null;
          is_default?: boolean;
          label: string;
          routing_number?: string | null;
          swift_bic?: string | null;
          upi_id?: string | null;
        };
        Update: {
          account_holder?: string;
          account_number?: string | null;
          bank_name?: string | null;
          country?: string | null;
          created_at?: string;
          currency?: string;
          iban?: string | null;
          id?: never;
          ifsc?: string | null;
          is_default?: boolean;
          label?: string;
          routing_number?: string | null;
          swift_bic?: string | null;
          upi_id?: string | null;
        };
        Relationships: [];
      };
      clients: {
        Row: {
          company: string | null;
          created_at: string;
          email: string | null;
          id: number;
          name: string | null;
          phone: string | null;
          status: string;
        };
        Insert: {
          company?: string | null;
          created_at?: string;
          email?: string | null;
          id?: never;
          name?: string | null;
          phone?: string | null;
          status?: string;
        };
        Update: {
          company?: string | null;
          created_at?: string;
          email?: string | null;
          id?: never;
          name?: string | null;
          phone?: string | null;
          status?: string;
        };
        Relationships: [];
      };
      decisions: {
        Row: {
          confidence: number;
          created_at: string;
          decision_type: string;
          entity_id: number;
          entity_type: string;
          id: number;
          input_hash: string;
          model: string;
          model_version: string | null;
          result: Json;
          reviewed_at: string | null;
          reviewed_by: string | null;
          status: string;
          verdict: string | null;
        };
        Insert: {
          confidence: number;
          created_at?: string;
          decision_type: string;
          entity_id: number;
          entity_type: string;
          id?: never;
          input_hash: string;
          model: string;
          model_version?: string | null;
          result: Json;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          status?: string;
          verdict?: string | null;
        };
        Update: {
          confidence?: number;
          created_at?: string;
          decision_type?: string;
          entity_id?: number;
          entity_type?: string;
          id?: never;
          input_hash?: string;
          model?: string;
          model_version?: string | null;
          result?: Json;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          status?: string;
          verdict?: string | null;
        };
        Relationships: [];
      };
      fcm_tokens: {
        Row: {
          created_at: string;
          id: number;
          platform: string;
          token: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: never;
          platform?: string;
          token: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: never;
          platform?: string;
          token?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      invoices: {
        Row: {
          bank_account_id: number | null;
          client_id: number | null;
          created_at: string;
          currency: string;
          due_date: string | null;
          exchange_rate_to_usd: number;
          id: number;
          invoice_number: string;
          items: Json | null;
          last_reminder_sent_at: string | null;
          notes: string | null;
          paid_at: string | null;
          proposal_id: number | null;
          reminder_count: number | null;
          sent_at: string | null;
          share_token: string | null;
          status: string;
          subtotal: number;
          tax: number;
          terms: string | null;
          total: number;
          updated_at: string;
          viewed_at: string | null;
        };
        Insert: {
          bank_account_id?: number | null;
          client_id?: number | null;
          created_at?: string;
          currency?: string;
          due_date?: string | null;
          exchange_rate_to_usd?: number;
          id?: never;
          invoice_number: string;
          items?: Json | null;
          last_reminder_sent_at?: string | null;
          notes?: string | null;
          paid_at?: string | null;
          proposal_id?: number | null;
          reminder_count?: number | null;
          sent_at?: string | null;
          share_token?: string | null;
          status?: string;
          subtotal?: number;
          tax?: number;
          terms?: string | null;
          total?: number;
          updated_at?: string;
          viewed_at?: string | null;
        };
        Update: {
          bank_account_id?: number | null;
          client_id?: number | null;
          created_at?: string;
          currency?: string;
          due_date?: string | null;
          exchange_rate_to_usd?: number;
          id?: never;
          invoice_number?: string;
          items?: Json | null;
          last_reminder_sent_at?: string | null;
          notes?: string | null;
          paid_at?: string | null;
          proposal_id?: number | null;
          reminder_count?: number | null;
          sent_at?: string | null;
          share_token?: string | null;
          status?: string;
          subtotal?: number;
          tax?: number;
          terms?: string | null;
          total?: number;
          updated_at?: string;
          viewed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "invoices_bank_account_id_fkey";
            columns: ["bank_account_id"];
            isOneToOne: false;
            referencedRelation: "bank_accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoices_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoices_proposal_id_fkey";
            columns: ["proposal_id"];
            isOneToOne: false;
            referencedRelation: "proposals";
            referencedColumns: ["id"];
          },
        ];
      };
      leads: {
        Row: {
          ai_category: string | null;
          ai_insights: Json | null;
          ai_score: number | null;
          ai_summary: string | null;
          budget: string | null;
          company: string | null;
          created_at: string;
          currency: string;
          details: string | null;
          email: string | null;
          follow_up_at: string | null;
          id: number;
          name: string | null;
          notes: string | null;
          phone: string | null;
          services: string | null;
          source: string | null;
          status: string;
        };
        Insert: {
          ai_category?: string | null;
          ai_insights?: Json | null;
          ai_score?: number | null;
          ai_summary?: string | null;
          budget?: string | null;
          company?: string | null;
          created_at?: string;
          currency?: string;
          details?: string | null;
          email?: string | null;
          follow_up_at?: string | null;
          id?: never;
          name?: string | null;
          notes?: string | null;
          phone?: string | null;
          services?: string | null;
          source?: string | null;
          status?: string;
        };
        Update: {
          ai_category?: string | null;
          ai_insights?: Json | null;
          ai_score?: number | null;
          ai_summary?: string | null;
          budget?: string | null;
          company?: string | null;
          created_at?: string;
          currency?: string;
          details?: string | null;
          email?: string | null;
          follow_up_at?: string | null;
          id?: never;
          name?: string | null;
          notes?: string | null;
          phone?: string | null;
          services?: string | null;
          source?: string | null;
          status?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          body: string | null;
          created_at: string;
          dedupe_key: string | null;
          entity_id: number | null;
          entity_type: string | null;
          id: number;
          is_read: boolean;
          title: string;
          type: string;
        };
        Insert: {
          body?: string | null;
          created_at?: string;
          dedupe_key?: string | null;
          entity_id?: number | null;
          entity_type?: string | null;
          id?: never;
          is_read?: boolean;
          title: string;
          type: string;
        };
        Update: {
          body?: string | null;
          created_at?: string;
          dedupe_key?: string | null;
          entity_id?: number | null;
          entity_type?: string | null;
          id?: never;
          is_read?: boolean;
          title?: string;
          type?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          budget: number | null;
          client_id: number | null;
          created_at: string;
          currency: string;
          deadline: string | null;
          description: string | null;
          id: number;
          name: string;
          notes: string | null;
          services: string | null;
          start_date: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          budget?: number | null;
          client_id?: number | null;
          created_at?: string;
          currency?: string;
          deadline?: string | null;
          description?: string | null;
          id?: never;
          name: string;
          notes?: string | null;
          services?: string | null;
          start_date?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          budget?: number | null;
          client_id?: number | null;
          created_at?: string;
          currency?: string;
          deadline?: string | null;
          description?: string | null;
          id?: never;
          name?: string;
          notes?: string | null;
          services?: string | null;
          start_date?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      proposals: {
        Row: {
          content: Json | null;
          created_at: string;
          currency: string;
          id: number;
          lead_id: number | null;
          pricing: Json | null;
          sent_at: string | null;
          share_token: string | null;
          status: string;
          terms: string | null;
          timeline: string | null;
          title: string;
          updated_at: string;
          viewed_at: string | null;
        };
        Insert: {
          content?: Json | null;
          created_at?: string;
          currency?: string;
          id?: never;
          lead_id?: number | null;
          pricing?: Json | null;
          sent_at?: string | null;
          share_token?: string | null;
          status?: string;
          terms?: string | null;
          timeline?: string | null;
          title: string;
          updated_at?: string;
          viewed_at?: string | null;
        };
        Update: {
          content?: Json | null;
          created_at?: string;
          currency?: string;
          id?: never;
          lead_id?: number | null;
          pricing?: Json | null;
          sent_at?: string | null;
          share_token?: string | null;
          status?: string;
          terms?: string | null;
          timeline?: string | null;
          title?: string;
          updated_at?: string;
          viewed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "proposals_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
      reviews: {
        Row: {
          company: string | null;
          content: string;
          created_at: string;
          email: string;
          id: number;
          is_verified: boolean;
          name: string;
          project: string | null;
          rating: number;
          role: string | null;
          status: string;
        };
        Insert: {
          company?: string | null;
          content: string;
          created_at?: string;
          email: string;
          id?: never;
          is_verified?: boolean;
          name: string;
          project?: string | null;
          rating?: number;
          role?: string | null;
          status?: string;
        };
        Update: {
          company?: string | null;
          content?: string;
          created_at?: string;
          email?: string;
          id?: never;
          is_verified?: boolean;
          name?: string;
          project?: string | null;
          rating?: number;
          role?: string | null;
          status?: string;
        };
        Relationships: [];
      };
      sent_emails: {
        Row: {
          attachments: Json | null;
          body: string | null;
          client_id: number | null;
          created_at: string;
          from_address: string;
          id: number;
          lead_id: number | null;
          resend_id: string | null;
          status: string;
          subject: string;
          to_addresses: string[];
        };
        Insert: {
          attachments?: Json | null;
          body?: string | null;
          client_id?: number | null;
          created_at?: string;
          from_address: string;
          id?: never;
          lead_id?: number | null;
          resend_id?: string | null;
          status?: string;
          subject: string;
          to_addresses: string[];
        };
        Update: {
          attachments?: Json | null;
          body?: string | null;
          client_id?: number | null;
          created_at?: string;
          from_address?: string;
          id?: never;
          lead_id?: number | null;
          resend_id?: string | null;
          status?: string;
          subject?: string;
          to_addresses?: string[];
        };
        Relationships: [
          {
            foreignKeyName: "sent_emails_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sent_emails_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
      user_roles: {
        Row: {
          can_manage_users: boolean;
          can_send_emails: boolean;
          can_view_all_data: boolean;
          created_at: string;
          id: number;
          onboarding_completed: boolean;
          role: string;
          user_id: string;
        };
        Insert: {
          can_manage_users?: boolean;
          can_send_emails?: boolean;
          can_view_all_data?: boolean;
          created_at?: string;
          id?: never;
          onboarding_completed?: boolean;
          role: string;
          user_id: string;
        };
        Update: {
          can_manage_users?: boolean;
          can_send_emails?: boolean;
          can_view_all_data?: boolean;
          created_at?: string;
          id?: never;
          onboarding_completed?: boolean;
          role?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      decision_accuracy: {
        Args: never;
        Returns: {
          agree: number;
          avg_confidence: number;
          disagree: number;
          reviewed: number;
          total: number;
        }[];
      };
      get_invoice_with_client: {
        Args: { invoice_id: number; token: string };
        Returns: Json;
      };
      get_proposal_with_lead: {
        Args: { proposal_id: number; token: string };
        Returns: Json;
      };
      list_users_with_roles: {
        Args: never;
        Returns: {
          can_manage_users: boolean;
          can_send_emails: boolean;
          created_at: string;
          email: string;
          full_name: string;
          onboarding_completed: boolean;
          role: string;
          user_id: string;
        }[];
      };
      set_user_role: {
        Args: { new_role: string; target_user_id: string };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
