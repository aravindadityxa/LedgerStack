import { FileText } from 'lucide-react'

export default function EmptyState({ 
  icon: Icon = FileText,
  title = 'No data found',
  description = 'Get started by creating your first item.',
  action
}) {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
        <Icon size={28} className="text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-[#111827] mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">{description}</p>
      {action}
    </div>
  )
}