import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, Users, Briefcase, FileText, CreditCard, 
  BarChart3, Settings, Menu, X 
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/customers', icon: Users, label: 'Customers' },
  { to: '/services', icon: Briefcase, label: 'Services' },
  { to: '/invoices', icon: FileText, label: 'Invoices' },
  { to: '/payments', icon: CreditCard, label: 'Payments' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-lg border border-[#E5E7EB]"
      >
        <Menu size={20} className="text-slate-700" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[#0F172A] shadow-2xl animate-in">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <img src="/logo.svg" alt="LedgerStack" className="h-8" />
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <nav className="p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to || 
                  (item.to !== '/dashboard' && location.pathname.startsWith(item.to))
                
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-blue-600/10 text-blue-500' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </NavLink>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}