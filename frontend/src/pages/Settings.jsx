import { useAuth } from '../context/AuthContext'
import { Settings as SettingsIcon, User, Building2, Bell, Shield, LogOut } from 'lucide-react'

export default function Settings() {
  const { user, logout } = useAuth()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account settings</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] divide-y divide-[#E5E7EB]">
        <div className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg font-semibold">
            {user?.full_name?.[0] || 'U'}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#111827]">{user?.full_name}</h3>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>

        <div className="p-4 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
            <User size={18} />
            Profile Information
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
            <Building2 size={18} />
            Company Details
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
            <Bell size={18} />
            Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
            <Shield size={18} />
            Security
          </button>
        </div>

        <div className="p-4">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}