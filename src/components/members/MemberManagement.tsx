import { useState, useEffect } from 'react'
import { supabase, type Member } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'
import MemberForm from './MemberForm'
import { useToast } from '@/hooks/use-toast'

export default function MemberManagement() {
  const [members, setMembers] = useState<Member[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMembers(data || [])
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch members',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return

    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id)

      if (error) throw error

      setMembers(prev => prev.filter(member => member.id !== id))
      toast({
        title: 'Success',
        description: 'Member deleted successfully',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete member',
      })
    }
  }

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.contact.includes(searchTerm) ||
    member.plan_type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const isExpiringSoon = (endDate: string) => {
    const today = new Date()
    const expiry = new Date(endDate)
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 7 && daysUntilExpiry >= 0
  }

  const isExpired = (endDate: string) => {
    const today = new Date()
    const expiry = new Date(endDate)
    return expiry < today
  }

  if (showForm) {
    return (
      <MemberForm
        member={editingMember}
        onClose={() => {
          setShowForm(false)
          setEditingMember(null)
        }}
        onSuccess={() => {
          fetchMembers()
          setShowForm(false)
          setEditingMember(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Member Management</h2>
          <p className="text-muted-foreground">Manage gym member profiles and memberships</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-32"></div>
                <div className="h-3 bg-muted rounded w-24"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription>Age {member.age} • {member.plan_type}</CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingMember(member)
                        setShowForm(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteMember(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div><strong>Contact:</strong> {member.contact}</div>
                  <div><strong>Address:</strong> {member.address}</div>
                  <div><strong>Emergency:</strong> {member.emergency_contact}</div>
                  <div className="flex justify-between items-center">
                    <span><strong>Expires:</strong> {new Date(member.membership_end_date).toLocaleDateString()}</span>
                    {isExpired(member.membership_end_date) && (
                      <span className="px-2 py-1 bg-destructive text-destructive-foreground text-xs rounded">
                        Expired
                      </span>
                    )}
                    {isExpiringSoon(member.membership_end_date) && !isExpired(member.membership_end_date) && (
                      <span className="px-2 py-1 bg-warning text-warning-foreground text-xs rounded">
                        Expiring Soon
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredMembers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">No members found</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm ? 'Try adjusting your search criteria' : 'Get started by adding your first member'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}