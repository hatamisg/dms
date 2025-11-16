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
      document_types: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      document_fields: {
        Row: {
          id: string
          document_type_id: string
          name: string
          label: string
          field_type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'textarea'
          is_required: boolean
          options: Json | null
          order: number
          created_at: string
        }
        Insert: {
          id?: string
          document_type_id: string
          name: string
          label: string
          field_type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'textarea'
          is_required?: boolean
          options?: Json | null
          order?: number
          created_at?: string
        }
        Update: {
          id?: string
          document_type_id?: string
          name?: string
          label?: string
          field_type?: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'textarea'
          is_required?: boolean
          options?: Json | null
          order?: number
          created_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          document_type_id: string
          title: string
          description: string | null
          folder_id: string | null
          tags: string[]
          ocr_text: string | null
          public_link_token: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          document_type_id: string
          title: string
          description?: string | null
          folder_id?: string | null
          tags?: string[]
          ocr_text?: string | null
          public_link_token?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          document_type_id?: string
          title?: string
          description?: string | null
          folder_id?: string | null
          tags?: string[]
          ocr_text?: string | null
          public_link_token?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      document_values: {
        Row: {
          id: string
          document_id: string
          field_id: string
          value: string | null
          created_at: string
        }
        Insert: {
          id?: string
          document_id: string
          field_id: string
          value?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          field_id?: string
          value?: string | null
          created_at?: string
        }
      }
      document_files: {
        Row: {
          id: string
          document_id: string
          file_name: string
          file_path: string
          file_size: number
          mime_type: string
          version: number
          is_current: boolean
          created_at: string
        }
        Insert: {
          id?: string
          document_id: string
          file_name: string
          file_path: string
          file_size: number
          mime_type: string
          version?: number
          is_current?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          file_name?: string
          file_path?: string
          file_size?: number
          mime_type?: string
          version?: number
          is_current?: boolean
          created_at?: string
        }
      }
      folders: {
        Row: {
          id: string
          name: string
          parent_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          parent_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          parent_id?: string | null
          created_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          document_id: string
          action: string
          changes: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          document_id: string
          action: string
          changes?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          action?: string
          changes?: Json | null
          created_at?: string
        }
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
  }
}
