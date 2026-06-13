import { 
  Search, 
  Bell, 
  Menu,
  PanelLeftClose,
  PanelLeft,
  MessageSquare,
  HelpCircle,
  Moon,
  Sun,
  User,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useDebounce } from '../../hooks/useDebounce'

export default function TopNav({ onMenuToggle, onSidebarToggle, sidebarCollapsed }) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  
  const profileRef = useRef(null)
  const notificationsRef = useRef(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  const debouncedSearch = useDebounce(searchQuery, 300)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowProfileMenu(false)
        setShowNotifications(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const notifications = [
    {
      id: 1,
      title: 'Invoice #INV-20240315-PQ7K paid',
      description: 'Payment of $5,000 received',
      time: '5 min ago',
      read: false,
      type: 'payment'
    },
    {
      id: 2,
      title: 'New customer added',
      description: 'Sarah Johnson from TechStart Inc.',
      time: '1 hour ago',
      read: false,
      type: 'customer'
    },
    {
      id: 3,
      title: 'Invoice overdue',
      description: 'INV-20240201-A3BX is 15 days overdue',
      time: '3 hours ago',
      read: true,
      type: 'warning'
    },
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-40">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuToggle}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* Sidebar Toggle */}
        <button 
          onClick={onSidebarToggle}
          className="hidden lg:flex p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </button>

        {/* Search Bar */}
        <div className="hidden sm:block relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoices, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="w-[280px] lg:w-[360px] pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-400 font-mono">
            <span>⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1.5">
        {/* Help Button */}
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors hidden sm:flex" title="Help">
          <HelpCircle size={18} />
        </button>

        {/* Feedback Button */}
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors hidden sm:flex" title="Feedback">
          <MessageSquare size={18} />
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications)
              setShowProfileMenu(false)
            }}
            className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-[#E5E7EB] py-2 z-50 animate-in">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB]">
                <h3 className="text-sm font-semibold text-[#111827]">Notifications</h3>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                  {unreadCount} new
                </span>
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        notification.type === 'payment' ? 'bg-emerald-400' :
                        notification.type === 'warning' ? 'bg-amber-400' :
                        'bg-blue-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#111827] truncate">
                          {notification.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {notification.description}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 py-3 border-t border-[#E5E7EB]">
                <button className="w-full text-xs text-blue-600 hover:text-blue-700 font-medium">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu)
              setShowNotifications(false)
            }}
            className="flex items-center gap-2 p-1.5 pl-2 hover:bg-slate-100 rounded-xl transition-colors ml-1"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center text-white text-sm font-semibold">
              {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-[#111827] truncate max-w-[120px]">
                {user?.full_name || 'User'}
              </p>
              <p className="text-xs text-slate-500 truncate max-w-[120px]">
                {user?.company_name || user?.email || 'user@company.com'}
              </p>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-xl border border-[#E5E7EB] py-2 z-50 animate-in">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-semibold text-[#111827]">{user?.full_name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
                {user?.company_name && (
                  <p className="text-xs text-slate-500">{user?.company_name}</p>
                )}
              </div>

              <div className="py-1">
                <button 
                  onClick={() => {
                    navigate('/settings')
                    setShowProfileMenu(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <User size={16} />
                  Profile Settings
                </button>
                <button 
                  onClick={() => {
                    navigate('/settings')
                    setShowProfileMenu(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Settings size={16} />
                  Account Settings
                </button>
              </div>

              <div className="border-t border-slate-100 py-1">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>

              <div className="border-t border-slate-100 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Dark Mode</span>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative w-9 h-5 rounded-full transition-colors ${
                      darkMode ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      darkMode ? 'translate-x-4' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}