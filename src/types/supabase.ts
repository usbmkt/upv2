export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string | null
        }
        Insert: {
          id?: string
          email: string
          created_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          client: string | null
          description: string | null
          event_date: string
          status: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          client?: string | null
          description?: string | null
          event_date: string
          status?: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          client?: string | null
          description?: string | null
          event_date?: string
          status?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      phases: {
        Row: {
          id: string
          project_id: string
          name: string
          start_date: string
          end_date: string
          duration: number
          created_at: string | null
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          start_date: string
          end_date: string
          duration: number
          created_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          start_date?: string
          end_date?: string
          duration?: number
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "phases_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          theme: string
          language: string
          timezone: string
          notifications_enabled: boolean
          email_notifications: boolean
          default_phase_durations: Json
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          theme?: string
          language?: string
          timezone?: string
          notifications_enabled?: boolean
          email_notifications?: boolean
          default_phase_durations?: Json
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          theme?: string
          language?: string
          timezone?: string
          notifications_enabled?: boolean
          email_notifications?: boolean
          default_phase_durations?: Json
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      project_templates: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          phases: Json
          is_public: boolean
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          phases: Json
          is_public?: boolean
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          phases?: Json
          is_public?: boolean
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_templates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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