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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      category_customization_groups: {
        Row: {
          category_id: string
          group_id: string
          id: string
        }
        Insert: {
          category_id?: string
          group_id?: string
          id?: string
        }
        Update: {
          category_id?: string
          group_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_customization_groups_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_customization_groups_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "customization_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_info: {
        Row: {
          id: number
          info: string
          name: string
        }
        Insert: {
          id?: number
          info: string
          name: string
        }
        Update: {
          id?: number
          info?: string
          name?: string
        }
        Relationships: []
      }
      customization_defaults: {
        Row: {
          id: string
          is_removable: boolean
          item_id: string
          option_id: string
          price_override: number | null
        }
        Insert: {
          id?: string
          is_removable: boolean
          item_id?: string
          option_id?: string
          price_override?: number | null
        }
        Update: {
          id?: string
          is_removable?: boolean
          item_id?: string
          option_id?: string
          price_override?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "customization_defaults_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "menu"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customization_defaults_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "customization_options"
            referencedColumns: ["id"]
          },
        ]
      }
      customization_groups: {
        Row: {
          id: string
          is_required: boolean
          max_select: number
          min_select: number
          name: string
        }
        Insert: {
          id?: string
          is_required: boolean
          max_select: number
          min_select: number
          name: string
        }
        Update: {
          id?: string
          is_required?: boolean
          max_select?: number
          min_select?: number
          name?: string
        }
        Relationships: []
      }
      customization_options: {
        Row: {
          display_order: number | null
          group_id: string
          id: string
          name: string
          price: number
        }
        Insert: {
          display_order?: number | null
          group_id?: string
          id?: string
          name: string
          price: number
        }
        Update: {
          display_order?: number | null
          group_id?: string
          id?: string
          name?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "customization_options_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "customization_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      hero_images: {
        Row: {
          alt: string | null
          id: number
          image: string | null
          page: string
        }
        Insert: {
          alt?: string | null
          id?: number
          image?: string | null
          page: string
        }
        Update: {
          alt?: string | null
          id?: number
          image?: string | null
          page?: string
        }
        Relationships: []
      }
      hours: {
        Row: {
          day: string
          end_time: string
          id: number
          isClosed: boolean
          start_time: string
        }
        Insert: {
          day: string
          end_time: string
          id?: number
          isClosed: boolean
          start_time: string
        }
        Update: {
          day?: string
          end_time?: string
          id?: number
          isClosed?: boolean
          start_time?: string
        }
        Relationships: []
      }
      info: {
        Row: {
          description: string
          id: number
          image: string | null
          onHome: boolean
          title: string
        }
        Insert: {
          description: string
          id?: number
          image?: string | null
          onHome: boolean
          title: string
        }
        Update: {
          description?: string
          id?: number
          image?: string | null
          onHome?: boolean
          title?: string
        }
        Relationships: []
      }
      menu: {
        Row: {
          category_id: string
          descriptionL: string
          descriptionS: string
          id: string
          image: string | null
          name: string
          price: number
        }
        Insert: {
          category_id: string
          descriptionL: string
          descriptionS: string
          id?: string
          image?: string | null
          name: string
          price?: number
        }
        Update: {
          category_id?: string
          descriptionL?: string
          descriptionS?: string
          id?: string
          image?: string | null
          name?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "menu_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_categories: {
        Row: {
          display_order: number | null
          id: string
          name: string
        }
        Insert: {
          display_order?: number | null
          id?: string
          name: string
        }
        Update: {
          display_order?: number | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      notification_jobs: {
        Row: {
          attempts: number | null
          created_at: string | null
          id: number
          last_error: string | null
          locked_at: string | null
          locked_by: string | null
          order_id: string
          processed_at: string | null
          status: string | null
          type: string
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          id?: never
          last_error?: string | null
          locked_at?: string | null
          locked_by?: string | null
          order_id: string
          processed_at?: string | null
          status?: string | null
          type: string
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          id?: never
          last_error?: string | null
          locked_at?: string | null
          locked_by?: string | null
          order_id?: string
          processed_at?: string | null
          status?: string | null
          type?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          clover_checkout_session_id: string | null
          clover_payment_id: string | null
          created_at: string | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          id: string
          order_items: Json | null
          status: string | null
          subtotal: number
          tax: number
          total: number
          updated_at: string | null
        }
        Insert: {
          clover_checkout_session_id?: string | null
          clover_payment_id?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          order_items?: Json | null
          status?: string | null
          subtotal: number
          tax: number
          total: number
          updated_at?: string | null
        }
        Update: {
          clover_checkout_session_id?: string | null
          clover_payment_id?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          order_items?: Json | null
          status?: string | null
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string | null
          id: string
          last_error: string | null
          processed_at: string | null
          raw: Json | null
          received_at: string
          status: string
          type: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          last_error?: string | null
          processed_at?: string | null
          raw?: Json | null
          received_at?: string
          status: string
          type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_error?: string | null
          processed_at?: string | null
          raw?: Json | null
          received_at?: string
          status?: string
          type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      abandon_expired_orders: { Args: never; Returns: number }
      claim_notification_job: {
        Args: { worker_id: string }
        Returns: {
          attempts: number | null
          created_at: string | null
          id: number
          last_error: string | null
          locked_at: string | null
          locked_by: string | null
          order_id: string
          processed_at: string | null
          status: string | null
          type: string
        }
        SetofOptions: {
          from: "*"
          to: "notification_jobs"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      complete_notification_job: {
        Args: { job_id: number; worker_id: string }
        Returns: boolean
      }
      fail_notification_job: {
        Args: { error_message: string; job_id: number; worker_id: string }
        Returns: boolean
      }
      recover_missing_notification_jobs: { Args: never; Returns: number }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
