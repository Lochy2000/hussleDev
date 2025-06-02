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
      hustles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          tags: string[]
          status: 'saved' | 'in-progress' | 'launched'
          user_id: string
          notes: string | null
          time_commitment: 'low' | 'medium' | 'high'
          earning_potential: 'low' | 'medium' | 'high'
          image: string
          tools: string[]
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          tags: string[]
          status: 'saved' | 'in-progress' | 'launched'
          user_id: string
          notes?: string | null
          time_commitment: 'low' | 'medium' | 'high'
          earning_potential: 'low' | 'medium' | 'high'
          image: string
          tools: string[]
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          tags?: string[]
          status?: 'saved' | 'in-progress' | 'launched'
          user_id?: string
          notes?: string | null
          time_commitment?: 'low' | 'medium' | 'high'
          earning_potential?: 'low' | 'medium' | 'high'
          image?: string
          tools?: string[]
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
          bio: string | null
          twitter_username: string | null
          github_username: string | null
          skills: string[]
          interests: string[]
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          bio?: string | null
          twitter_username?: string | null
          github_username?: string | null
          skills?: string[]
          interests?: string[]
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          bio?: string | null
          twitter_username?: string | null
          github_username?: string | null
          skills?: string[]
          interests?: string[]
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