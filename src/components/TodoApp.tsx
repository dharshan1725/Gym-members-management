import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AuthForm from '@/components/auth/AuthForm'
import Navbar from '@/components/layout/Navbar'
import Dashboard from '@/components/dashboard/Dashboard'
import MemberManagement from '@/components/members/MemberManagement'
import PaymentManagement from '@/components/payments/PaymentManagement'
import type { User } from '@supabase/supabase-js'

export default function GymManager() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState('dashboard')

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'members':
        return <MemberManagement />
      case 'payments':
        return <PaymentManagement />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar currentView={currentView} onViewChange={setCurrentView} />
      <main className="container mx-auto px-4 py-6">
        {renderCurrentView()}
      </main>
    </div>
  )
}