import { useState, useEffect } from 'react'
import { supabase, type Payment, type Member } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, DollarSign } from 'lucide-react'
import PaymentForm from './PaymentForm'
import { useToast } from '@/hooks/use-toast'

interface PaymentWithMember extends Payment {
  member: Member
}

export default function PaymentManagement() {
  const [payments, setPayments] = useState<PaymentWithMember[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          member:members(*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPayments(data || [])
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch payments',
      })
    } finally {
      setLoading(false)
    }
  }

  const updatePaymentStatus = async (paymentId: string, status: 'paid' | 'pending' | 'overdue') => {
    try {
      const { error } = await supabase
        .from('payments')
        .update({ 
          status,
          payment_date: status === 'paid' ? new Date().toISOString() : null
        })
        .eq('id', paymentId)

      if (error) throw error

      setPayments(prev => prev.map(payment => 
        payment.id === paymentId 
          ? { ...payment, status, payment_date: status === 'paid' ? new Date().toISOString() : payment.payment_date }
          : payment
      ))

      toast({
        title: 'Success',
        description: 'Payment status updated successfully',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update payment status',
      })
    }
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.member.contact.includes(searchTerm)
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-success text-success-foreground'
      case 'pending':
        return 'bg-warning text-warning-foreground'
      case 'overdue':
        return 'bg-destructive text-destructive-foreground'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  if (showForm) {
    return (
      <PaymentForm
        onClose={() => setShowForm(false)}
        onSuccess={() => {
          fetchPayments()
          setShowForm(false)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payment Management</h2>
          <p className="text-muted-foreground">Track and manage membership payments</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Record Payment
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by member name or contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-32"></div>
                    <div className="h-3 bg-muted rounded w-24"></div>
                  </div>
                  <div className="h-6 bg-muted rounded w-16"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPayments.map((payment) => (
            <Card key={payment.id}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{payment.member.name}</h3>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Contact: {payment.member.contact} • Plan: {payment.member.plan_type}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                      <span><strong>Amount:</strong> ${payment.amount}</span>
                      <span><strong>Due Date:</strong> {new Date(payment.due_date).toLocaleDateString()}</span>
                      {payment.payment_date && (
                        <span><strong>Paid On:</strong> {new Date(payment.payment_date).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {payment.status !== 'paid' && (
                      <Button
                        size="sm"
                        onClick={() => updatePaymentStatus(payment.id, 'paid')}
                        className="gap-1"
                      >
                        <DollarSign className="h-3 w-3" />
                        Mark Paid
                      </Button>
                    )}
                    {payment.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updatePaymentStatus(payment.id, 'overdue')}
                      >
                        Mark Overdue
                      </Button>
                    )}
                    {payment.status === 'overdue' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updatePaymentStatus(payment.id, 'pending')}
                      >
                        Mark Pending
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredPayments.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No payments found</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Get started by recording your first payment'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}