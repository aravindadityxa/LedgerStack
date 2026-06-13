import { useState, useEffect } from 'react'
import { TrendingUp, Users, FileText, CheckCircle, Clock, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'
import StatsCard from '../components/shared/StatsCard'
import StatusBadge from '../components/shared/StatusBadge'
import RevenueChart from '../components/charts/RevenueChart'
import StatusPieChart from '../components/charts/StatusPieChart'
import { formatCurrency, formatDate } from '../utils/formatters'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/dashboard')
      setData(response.data)
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to load dashboard data'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <TrendingUp size={28} className="text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-[#111827] mb-2">Failed to load dashboard</h3>
          <p className="text-sm text-slate-500 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-[#2563EB] text-white rounded-xl text-sm font-medium hover:bg-[#1D4ED8] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1">Here's what's happening with your business today.</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatsCard
          label="Total Revenue"
          value={formatCurrency(data?.total_revenue || 0)}
          icon={DollarSign}
          change="+12.5%"
          color="blue"
        />
        <StatsCard
          label="Total Customers"
          value={data?.total_customers || 0}
          icon={Users}
          change="+8.2%"
          color="green"
        />
        <StatsCard
          label="Total Invoices"
          value={data?.total_invoices || 0}
          icon={FileText}
          change="+15.3%"
          color="purple"
        />
        <StatsCard
          label="Paid Invoices"
          value={data?.paid_invoices || 0}
          icon={CheckCircle}
          change="+10.1%"
          color="emerald"
        />
        <StatsCard
          label="Pending"
          value={data?.pending_invoices || 0}
          icon={Clock}
          change="-3.4%"
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#111827]">Monthly Revenue</h3>
            <select className="text-xs border border-[#E5E7EB] rounded-lg px-2 py-1.5 bg-[#F8FAFC] text-slate-600">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
              <option>This year</option>
            </select>
          </div>
          <RevenueChart data={data?.monthly_revenue || []} height={300} />
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
          <h3 className="text-lg font-semibold text-[#111827] mb-6">Invoice Status Distribution</h3>
          <StatusPieChart data={data?.invoice_status || []} height={300} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#111827]">Recent Invoices</h3>
            <button 
              onClick={() => navigate('/invoices')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </button>
          </div>
          
          {data?.recent_invoices?.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <FileText size={40} className="mx-auto mb-3 text-slate-300" />
              <p className="text-sm">No invoices yet</p>
              <button 
                onClick={() => navigate('/invoices/new')}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Create your first invoice
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-slate-500 border-b border-[#E5E7EB]">
                    <th className="pb-3 font-medium">Invoice</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.recent_invoices?.map((invoice) => (
                    <tr 
                      key={invoice.id} 
                      className="border-b border-slate-50 hover:bg-slate-50/50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/invoices/${invoice.id}`)}
                    >
                      <td className="py-3 pr-4">
                        <p className="text-sm font-medium text-[#111827]">{invoice.invoice_number}</p>
                      </td>
                      <td className="py-3 pr-4 text-sm text-slate-600">{invoice.customer}</td>
                      <td className="py-3 pr-4 text-sm font-medium text-[#111827]">
                        {formatCurrency(invoice.total)}
                      </td>
                      <td className="py-3 pr-4">
                        <StatusBadge status={invoice.status} />
                      </td>
                      <td className="py-3 text-sm text-slate-500">{formatDate(invoice.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#111827]">Recent Payments</h3>
            <button 
              onClick={() => navigate('/payments')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </button>
          </div>
          
          {data?.recent_payments?.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <CreditCard size={40} className="mx-auto mb-3 text-slate-300" />
              <p className="text-sm">No payments recorded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data?.recent_payments?.map((payment) => (
                <div 
                  key={payment.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <DollarSign size={18} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#111827]">
                        {payment.invoice_number}
                      </p>
                      <p className="text-xs text-slate-500">
                        {payment.customer} • {payment.method}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-emerald-600">
                      +{formatCurrency(payment.amount)}
                    </p>
                    <p className="text-xs text-slate-500">{formatDate(payment.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-8 w-48 bg-slate-200 rounded-lg" />
        <div className="h-4 w-72 bg-slate-100 rounded mt-2" />
      </div>
      
      <div className="grid grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
            <div className="flex justify-between mb-4">
              <div className="h-10 w-10 bg-slate-200 rounded-xl" />
              <div className="h-6 w-16 bg-slate-100 rounded-lg" />
            </div>
            <div className="h-8 w-24 bg-slate-200 rounded mb-2" />
            <div className="h-4 w-20 bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
          <div className="h-6 w-40 bg-slate-200 rounded mb-6" />
          <div className="h-72 bg-slate-100 rounded" />
        </div>
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
          <div className="h-6 w-40 bg-slate-200 rounded mb-6" />
          <div className="h-72 bg-slate-100 rounded" />
        </div>
      </div>
    </div>
  )
}