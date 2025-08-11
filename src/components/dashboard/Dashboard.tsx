import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, DollarSign, Clock, TrendingUp } from 'lucide-react'

interface DashboardStats {
  totalMembers: number
  feesThisMonth: number
  pendingPayments: number
  newMembersThisMonth: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    feesThisMonth: 0,
    pendingPayments: 0,
    newMembersThisMonth: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      // Get total members
      const { count: totalMembers } = await supabase
        .from('members')
        .select('*', { count: 'exact' })

      // Get fees collected this month
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      const { data: paymentsThisMonth } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'paid')
        .gte('payment_date', startOfMonth.toISOString())

      const feesThisMonth = paymentsThisMonth?.reduce((sum, payment) => sum + payment.amount, 0) || 0

      // Get pending payments count
      const { count: pendingPayments } = await supabase
        .from('payments')
        .select('*', { count: 'exact' })
        .eq('status', 'pending')

      // Get new members this month
      const { count: newMembersThisMonth } = await supabase
        .from('members')
        .select('*', { count: 'exact' })
        .gte('created_at', startOfMonth.toISOString())

      setStats({
        totalMembers: totalMembers || 0,
        feesThisMonth,
        pendingPayments: pendingPayments || 0,
        newMembersThisMonth: newMembersThisMonth || 0,
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 mb-1"></div>
              <div className="h-3 bg-muted rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const dashboardCards = [
    {
      title: 'Total Members',
      value: stats.totalMembers,
      description: 'Active gym members',
      icon: Users,
      color: 'text-primary',
    },
    {
      title: 'Fees This Month',
      value: `$${stats.feesThisMonth.toLocaleString()}`,
      description: 'Revenue collected',
      icon: DollarSign,
      color: 'text-success',
    },
    {
      title: 'Pending Payments',
      value: stats.pendingPayments,
      description: 'Require attention',
      icon: Clock,
      color: 'text-warning',
    },
    {
      title: 'New Members',
      value: stats.newMembersThisMonth,
      description: 'Joined this month',
      icon: TrendingUp,
      color: 'text-gym-secondary',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Welcome to your gym management dashboard. Use the navigation above to manage members and track payments.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}