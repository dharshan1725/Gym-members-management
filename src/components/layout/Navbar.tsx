import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Dumbbell, Menu, Users, CreditCard, BarChart3, LogOut } from 'lucide-react'

interface NavbarProps {
  currentView: string
  onViewChange: (view: string) => void
}

export default function Navbar({ currentView, onViewChange }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'payments', label: 'Payments', icon: CreditCard },
  ]

  const NavContent = () => (
    <div className="flex flex-col gap-4">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <Button
            key={item.id}
            variant={currentView === item.id ? 'default' : 'ghost'}
            className="w-full justify-start gap-2"
            onClick={() => {
              onViewChange(item.id)
              setIsOpen(false)
            }}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Button>
        )
      })}
      <Button
        variant="ghost"
        className="w-full justify-start gap-2 text-destructive hover:text-destructive"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </div>
  )

  return (
    <header className="border-b bg-card">
      <div className="flex h-16 items-center px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Gym Manager</span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex ml-auto gap-2">
          <NavContent />
        </nav>
        
        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden ml-auto">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <div className="flex items-center gap-2 mb-6">
              <Dumbbell className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Gym Manager</span>
            </div>
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}