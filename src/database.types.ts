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
    PostgrestVersion: "14.4"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      cestpour_items: {
        Row: {
          id: string
          object_name: string
          image_url: string
          correct_answer: string
          wrong_answer: string
          order_index: number
          created_at: string | null
        }
        Insert: {
          id?: string
          object_name: string
          image_url?: string
          correct_answer: string
          wrong_answer: string
          order_index?: number
          created_at?: string | null
        }
        Update: {
          id?: string
          object_name?: string
          image_url?: string
          correct_answer?: string
          wrong_answer?: string
          order_index?: number
          created_at?: string | null
        }
        Relationships: []
      }
      ceb_texts: {
        Row: {
          id: string
          title: string
          level: string
          content: string
          created_at: string | null
        }
        Insert: {
          id?: string
          title: string
          level: string
          content: string
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          level?: string
          content?: string
          created_at?: string | null
        }
        Relationships: []
      }
      ceb_questions: {
        Row: {
          id: string
          text_id: string | null
          order_index: number
          type: string
          question_text: string
          draft_answer: string
        }
        Insert: {
          id?: string
          text_id?: string | null
          order_index: number
          type: string
          question_text: string
          draft_answer?: string
        }
        Update: {
          id?: string
          text_id?: string | null
          order_index?: number
          type?: string
          question_text?: string
          draft_answer?: string
        }
        Relationships: [
          {
            foreignKeyName: "ceb_questions_text_id_fkey"
            columns: ["text_id"]
            isOneToOne: false
            referencedRelation: "ceb_texts"
            referencedColumns: ["id"]
          },
        ]
      }
      ceb_options: {
        Row: {
          id: string
          question_id: string | null
          option_text: string
          is_correct: boolean
          order_index: number
        }
        Insert: {
          id?: string
          question_id?: string | null
          option_text: string
          is_correct?: boolean
          order_index: number
        }
        Update: {
          id?: string
          question_id?: string | null
          option_text?: string
          is_correct?: boolean
          order_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "ceb_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "ceb_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      prosody_themes: {
        Row: {
          id: string
          short_id: string
          title: string
          description: string
        }
        Insert: {
          id?: string
          short_id: string
          title: string
          description?: string
        }
        Update: {
          id?: string
          short_id?: string
          title?: string
          description?: string
        }
        Relationships: []
      }
      prosody_phrases: {
        Row: {
          id: string
          theme_id: string | null
          phrase: string
        }
        Insert: {
          id?: string
          theme_id?: string | null
          phrase: string
        }
        Update: {
          id?: string
          theme_id?: string | null
          phrase?: string
        }
        Relationships: [
          {
            foreignKeyName: "prosody_phrases_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "prosody_themes"
            referencedColumns: ["id"]
          },
        ]
      }
      clues: {
        Row: {
          clue_text: string
          id: string
          order_index: number
          word_id: string | null
        }
        Insert: {
          clue_text: string
          id?: string
          order_index: number
          word_id?: string | null
        }
        Update: {
          clue_text?: string
          id?: string
          order_index?: number
          word_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clues_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "words"
            referencedColumns: ["id"]
          },
        ]
      }
      themes: {
        Row: {
          id: string
          short_id: string
          title: string
        }
        Insert: {
          id?: string
          short_id: string
          title: string
        }
        Update: {
          id?: string
          short_id?: string
          title?: string
        }
        Relationships: []
      }
      words: {
        Row: {
          id: string
          theme_id: string | null
          word: string
        }
        Insert: {
          id?: string
          theme_id?: string | null
          word: string
        }
        Update: {
          id?: string
          theme_id?: string | null
          word?: string
        }
        Relationships: [
          {
            foreignKeyName: "words_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
