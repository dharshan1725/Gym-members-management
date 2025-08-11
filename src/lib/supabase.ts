import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'

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