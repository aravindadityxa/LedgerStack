import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  FileText, 
  CreditCard, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  HelpCircle,
  ExternalLink
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { 
    to: '/dashboard', 
    icon: LayoutDashboard, 
    label: 'Dashboard',
    description: 'Overview & analytics'
  },
  { 
    to: '/customers', 
    icon: Users, 
    label: 'Customers',
    description: 'Manage contacts'
  },
  { 
    to: '/services', 
    icon: Briefcase, 
    label: 'Services',
    description: 'Products & pricing'
  },
  { 
    to: '/invoices', 
    icon: FileText, 
    label: 'Invoices',
    description: 'Billing & invoices'
  },
  { 
    to: '/payments', 
    icon: CreditCard, 
    label: 'Payments',
    description: 'Track payments'
  },
  { 
    to: '/reports', 
    icon: BarChart3, 
    label: 'Reports',
    description: 'Business insights'
  },
  { 
    to: '/settings', 
    icon: Settings, 
    label: 'Settings',
    description: 'Preferences'
  },
]

export default function Sidebar({ collapsed = false }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <aside className={`
      h-screen bg-[#0F172A] flex flex-col transition-all duration-300 ease-in-out
      ${collapsed ? 'w-20' : 'w-64'}
    `}>
      {/* Logo Section */}
      <div className={`
        flex items-center border-b border-slate-800/50
        ${collapsed ? 'justify-center p-4' : 'justify-between p-5'}
      `}>
        {!collapsed && (
          <div className="flex items-center gap-3">
            <img 
              src="/logo.svg" 
              alt="LedgerStack" 
              className="h-8 w-8"
            />
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">LedgerStack</h1>
              <p className="text-xs text-slate-500">v1.0.0</p>
            </div>
          </div>
        )}
        {collapsed && (
          <img 
            src="/logo.svg" 
            alt="LedgerStack" 
            className="h-8 w-8"
          />
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.to)
          const Icon = item.icon
          
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 group relative
                ${active 
                  ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
              title={collapsed ? item.label : ''}
            >
              <Icon size={18} className="flex-shrink-0" />
              
              {!collapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <span className="block truncate">{item.label}</span>
                    <span className="block text-xs text-slate-500 truncate">{item.description}</span>
                  </div>
                  
                  {active && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  )}
                </>
              )}

              {/* Active Indicator for collapsed mode */}
              {active && collapsed && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-l-full"></div>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-slate-800/50">
        {!collapsed && (
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">
                  {user?.full_name || 'User'}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user?.company_name || user?.email || 'user@company.com'}
                </p>
              </div>
            </div>
            
            <div className="space-y-1">
              <a 
                href="#" 
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-colors"
              >
                <HelpCircle size={14} />
                Help & Support
                <ExternalLink size={10} className="ml-auto" />
              </a>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          </div>
        )}
        
        {collapsed && (
          <div className="p-3 space-y-2">
            <button className="w-full p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center">
              <LogOut size={16} onClick={handleLogout} />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}