import { createClient } from '@supabase/supabase-js'
// GymManagementSystem123
const supabaseUrl = 'https://joetmuzyethkpchyqfgq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZXRtdXp5ZXRoa3BjaHlxZmdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NzkwNjcsImV4cCI6MjA3MDU1NTA2N30.xspLW-K6R8bqEhJ0IaUAls6v9cV8Dys8YdxPPVE0J24'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Member = {
  id: string
  name: string
  age: number
  contact: string
  address: string
  membership_start_date: string
  membership_end_date: string
  plan_type: 'Monthly' | 'Quarterly' | 'Yearly'
  emergency_contact: string
  created_at: string
}

export type Payment = {
  id: string
  member_id: string
  amount: number
  payment_date: string
  due_date: string
  status: 'paid' | 'pending' | 'overdue'
  created_at: string
}