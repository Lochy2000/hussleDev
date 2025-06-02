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
          version: number
          collaborators: string[] | null
          progress: number | null
          revenue_target: number | null
          current_revenue: number | null
          category: string | null
          launch_date: string | null
          last_milestone: string | null
          priority: 'low' | 'medium' | 'high' | null
          due_date: string | null
          milestones: Json | null
          github_url: string | null
          website_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          tags: string[]
          status?: 'saved' | 'in-progress' | 'launched'
          user_id: string
          notes?: string | null
          time_commitment: 'low' | 'medium' | 'high'
          earning_potential: 'low' | 'medium' | 'high'
          image: string
          tools: string[]
          version?: number
          collaborators?: string[] | null
          progress?: number | null
          revenue_target?: number | null
          current_revenue?: number | null
          category?: string | null
          launch_date?: string | null
          last_milestone?: string | null
          priority?: 'low' | 'medium' | 'high' | null
          due_date?: string | null
          milestones?: Json | null
          github_url?: string | null
          website_url?: string | null
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
          version?: number
          collaborators?: string[] | null
          progress?: number | null
          revenue_target?: number | null
          current_revenue?: number | null
          category?: string | null
          launch_date?: string | null
          last_milestone?: string | null
          priority?: 'low' | 'medium' | 'high' | null
          due_date?: string | null
          milestones?: Json | null
          github_url?: string | null
          website_url?: string | null
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