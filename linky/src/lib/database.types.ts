export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      urls: {
        Row: {
          id: string
          user_id: string
          original_url: string
          short_code: string
          title: string | null
          clicks: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          original_url: string
          short_code: string
          title?: string | null
          clicks?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          original_url?: string
          short_code?: string
          title?: string | null
          clicks?: number
          created_at?: string
          updated_at?: string
        }
      }
      link_trees: {
        Row: {
          id: string
          user_id: string
          username: string
          title: string | null
          bio: string | null
          theme: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          username: string
          title?: string | null
          bio?: string | null
          theme?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          username?: string
          title?: string | null
          bio?: string | null
          theme?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tree_links: {
        Row: {
          id: string
          tree_id: string
          title: string
          url: string
          icon: string | null
          position: number | null
          clicks: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tree_id: string
          title: string
          url: string
          icon?: string | null
          position?: number | null
          clicks?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tree_id?: string
          title?: string
          url?: string
          icon?: string | null
          position?: number | null
          clicks?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
