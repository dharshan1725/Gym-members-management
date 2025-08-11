import { useState } from 'react'
import { supabase, type Member } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface MemberFormProps {
  member?: Member | null
  onClose: () => void
  onSuccess: () => void
}

export default function MemberForm({ member, onClose, onSuccess }: MemberFormProps) {
  const [formData, setFormData] = useState({
    name: member?.name || '',
    age: member?.age || '',
    contact: member?.contact || '',
    address: member?.address || '',
    membership_start_date: member?.membership_start_date || new Date().toISOString().split('T')[0],
    plan_type: member?.plan_type || 'Monthly',
    emergency_contact: member?.emergency_contact || '',
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const calculateEndDate = (startDate: string, planType: string) => {
    const start = new Date(startDate)
    switch (planType) {
      case 'Monthly':
        start.setMonth(start.getMonth() + 1)
        break
      case 'Quarterly':
        start.setMonth(start.getMonth() + 3)
        break
      case 'Yearly':
        start.setFullYear(start.getFullYear() + 1)
        break
    }
    return start.toISOString().split('T')[0]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const memberData = {
        ...formData,
        age: parseInt(formData.age.toString()),
        membership_end_date: calculateEndDate(formData.membership_start_date, formData.plan_type),
      }

      if (member) {
        // Update existing member
        const { error } = await supabase
          .from('members')
          .update(memberData)
          .eq('id', member.id)

        if (error) throw error

        toast({
          title: 'Success',
          description: 'Member updated successfully',
        })
      } else {
        // Create new member
        const { error } = await supabase
          .from('members')
          .insert([memberData])

        if (error) throw error

        toast({
          title: 'Success',
          description: 'Member added successfully',
        })
      }

      onSuccess()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to ${member ? 'update' : 'add'} member`,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">
            {member ? 'Edit Member' : 'Add New Member'}
          </h2>
          <p className="text-muted-foreground">
            {member ? 'Update member information' : 'Enter member details below'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Member Information</CardTitle>
          <CardDescription>
            Fill in all required fields to {member ? 'update' : 'create'} the member profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  placeholder="Enter age"
                  min="1"
                  max="120"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number *</Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency_contact">Emergency Contact *</Label>
                <Input
                  id="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact: e.target.value }))}
                  placeholder="Emergency contact number"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter full address"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="membership_start_date">Membership Start Date *</Label>
                <Input
                  id="membership_start_date"
                  type="date"
                  value={formData.membership_start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, membership_start_date: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan_type">Plan Type *</Label>
                <Select
                  value={formData.plan_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, plan_type: value as 'Monthly' | 'Quarterly' | 'Yearly' }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly (3 months)</SelectItem>
                    <SelectItem value="Yearly">Yearly (12 months)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.membership_start_date && formData.plan_type && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Membership End Date:</strong> {calculateEndDate(formData.membership_start_date, formData.plan_type)}
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (member ? 'Update Member' : 'Add Member')}
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