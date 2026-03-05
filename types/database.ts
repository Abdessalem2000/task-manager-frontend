export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          name: string
          phone: string | null
          address: string | null
          lat: number | null
          lng: number | null
          status: 'new' | 'contacted' | 'visited' | 'closed'
          score: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone?: string | null
          address?: string | null
          lat?: number | null
          lng?: number | null
          status?: 'new' | 'contacted' | 'visited' | 'closed'
          score?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
          address?: string | null
          lat?: number | null
          lng?: number | null
          status?: 'new' | 'contacted' | 'visited' | 'closed'
          score?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      visits: {
        Row: {
          id: string
          client_id: string
          user_id: string
          lat: number | null
          lng: number | null
          notes: string | null
          status: 'planned' | 'in_progress' | 'completed' | 'cancelled'
          checkin_time: string | null
          checkout_time: string | null
          duration_minutes: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          user_id: string
          lat?: number | null
          lng?: number | null
          notes?: string | null
          status?: 'planned' | 'in_progress' | 'completed' | 'cancelled'
          checkin_time?: string | null
          checkout_time?: string | null
          duration_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          user_id?: string
          lat?: number | null
          lng?: number | null
          notes?: string | null
          status?: 'planned' | 'in_progress' | 'completed' | 'cancelled'
          checkin_time?: string | null
          checkout_time?: string | null
          duration_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          full_name: string | null
          agency_name: string | null
          phone: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          agency_name?: string | null
          phone?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          agency_name?: string | null
          phone?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
