export type Client = {
  id: string
  name: string
  phone?: string
  address?: string
  status: 'new' | 'contacted' | 'visited' | 'closed'
  score?: number
  lat?: number
  lng?: number
  created_at?: string
  notes?: string
}
