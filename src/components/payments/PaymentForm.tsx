import { useState, useEffect } from 'react'
import { supabase, type Member } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface PaymentFormProps {
  onClose: () => void
  onSuccess: () => void
}

export default function PaymentForm({ onClose, onSuccess }: PaymentFormProps) {
  const [members, setMembers] = useState<Member[]>([])
  const [formData, setFormData] = useState({
    member_id: '',
    amount: '',
    due_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    status: 'pending' as 'paid' | 'pending' | 'overdue',
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('name')

      if (error) throw error
      setMembers(data || [])
    } catch (error) {
      console.error('Error fetching members:', error)
    }
  }

  const calculateNextDueDate = (member: Member) => {
    const nextDate = new Date()
    switch (member.plan_type) {
      case 'Monthly':
        nextDate.setMonth(nextDate.getMonth() + 1)
        break
      case 'Quarterly':
        nextDate.setMonth(nextDate.getMonth() + 3)
        break
      case 'Yearly':
        nextDate.setFullYear(nextDate.getFullYear() + 1)
        break
    }
    return nextDate.toISOString().split('T')[0]
  }

  const handleMemberSelect = (memberId: string) => {
    const selectedMember = members.find(m => m.id === memberId)
    if (selectedMember) {
      setFormData(prev => ({
        ...prev,
        member_id: memberId,
        due_date: calculateNextDueDate(selectedMember),
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Clean & prepare data for Supabase
      const paymentData = {
        member_id: formData.member_id,
        amount: parseFloat(formData.amount),
        due_date: formData.due_date, // YYYY-MM-DD
        status: formData.status,
        payment_date: formData.status === 'paid' ? new Date().toISOString() : null,
      }

      const { error } = await supabase
        .from('payments')
        .insert([paymentData])

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Payment recorded successfully',
      })

      onSuccess()
    } catch (error: any) {
      console.error('Payment insert error:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to record payment',
      })
    } finally {
      setLoading(false)
    }
  }

  const selectedMember = members.find(m => m.id === formData.member_id)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Record Payment</h2>
          <p className="text-muted-foreground">Add a new payment record for a member</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
          <CardDescription>
            Select a member and enter payment details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Select Member *</Label>
              <Select
                value={formData.member_id}
                onValueChange={handleMemberSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} - {member.plan_type} ({member.contact})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedMember && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <h4 className="font-semibold">Member Details</h4>
                <p className="text-sm"><strong>Name:</strong> {selectedMember.name}</p>
                <p className="text-sm"><strong>Plan:</strong> {selectedMember.plan_type}</p>
                <p className="text-sm"><strong>Contact:</strong> {selectedMember.contact}</p>
                <p className="text-sm">
                  <strong>Membership Expires:</strong> {new Date(selectedMember.membership_end_date).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Amount ($) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="Enter payment amount"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Due Date *</Label>
                <Input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Payment Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'paid' | 'pending' | 'overdue' }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading || !formData.member_id}>
                {loading ? 'Recording...' : 'Record Payment'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
