import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function StatsCard({ label, value, icon: Icon, change, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
  }

  const isPositive = change?.startsWith('+')

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center`}>
          <Icon size={20} />
        </div>
        {change && (
          <span className={`flex items-center gap-0.5 text-xs font-medium px-2 py-1 rounded-lg ${
            isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
          }`}>
            {change}
            {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-[#111827] tracking-tight">{value}</p>
      <p className="text-sm text-slate-500 mt-1 font-medium">{label}</p>
    </div>
  )
}