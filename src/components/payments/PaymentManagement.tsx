import { useState, useEffect } from 'react'
import { supabase, type Payment, type Member } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, DollarSign } from 'lucide-react'
import PaymentForm from './PaymentForm'
import { useToast } from '@/hooks/use-toast'

interface PaymentWithMember extends Payment {
  member?: Member | null
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
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`*, member:members(*)`)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPayments(data || [])
    } catch {
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

      await fetchPayments() // safer than optimistic update

      toast({
        title: 'Success',
        description: 'Payment status updated successfully',
      })
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update payment status',
      })
    }
  }

  const filteredPayments = payments.filter(payment => {
    const nameMatch = payment.member?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const contactMatch = payment.member?.contact?.includes(searchTerm)
    const statusMatch = statusFilter === 'all' || payment.status === statusFilter
    return (nameMatch || contactMatch) && statusMatch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500 text-white'
      case 'pending':
        return 'bg-yellow-500 text-black'
      case 'overdue':
        return 'bg-red-500 text-white'
      default:
        return 'bg-gray-300 text-black'
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Payment Management</h2>
          <p className="text-gray-500">Track and manage membership payments</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Record Payment
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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

      {/* Payment List */}
      {loading ? (
        <p>Loading payments...</p>
      ) : filteredPayments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No payments found
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPayments.map((payment) => (
            <Card key={payment.id}>
              <CardContent className="p-6 flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{payment.member?.name || 'Unknown Member'}</h3>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    Contact: {payment.member?.contact || 'N/A'} • Plan: {payment.member?.plan_type || 'N/A'}
                  </p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span><strong>Amount:</strong> ${payment.amount}</span>
                    <span><strong>Due:</strong> {payment.due_date ? new Date(payment.due_date).toLocaleDateString() : 'N/A'}</span>
                    {payment.payment_date && (
                      <span><strong>Paid:</strong> {new Date(payment.payment_date).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {payment.status !== 'paid' && (
                    <Button size="sm" onClick={() => updatePaymentStatus(payment.id, 'paid')}>
                      <DollarSign className="h-3 w-3" /> Mark Paid
                    </Button>
                  )}
                  {payment.status === 'pending' && (
                    <Button size="sm" variant="outline" onClick={() => updatePaymentStatus(payment.id, 'overdue')}>
                      Mark Overdue
                    </Button>
                  )}
                  {payment.status === 'overdue' && (
                    <Button size="sm" variant="outline" onClick={() => updatePaymentStatus(payment.id, 'pending')}>
                      Mark Pending
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
