const statusStyles = {
  draft: 'bg-slate-100 text-slate-700 border-slate-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  overdue: 'bg-red-50 text-red-700 border-red-200',
  cancelled: 'bg-gray-50 text-gray-500 border-gray-200',
}

export default function StatusBadge({ status, className = '' }) {
  const style = statusStyles[status] || statusStyles.draft
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${style} ${className}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}