import { useState, useEffect } from 'react'
import { Search, CreditCard, DollarSign, Calendar, Filter, Download } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'
import EmptyState from '../components/ui/EmptyState'
import { useDebounce } from '../hooks/useDebounce'
import { formatCurrency, formatDate } from '../utils/formatters'
import { exportToCSV } from '../utils/exportHelpers'

export default function Payments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    fetchPayments()
  }, [debouncedSearch, page])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await api.get('/payments', {
        params: {
          search: debouncedSearch || undefined,
          page,
          limit: 20,
        }
      })
      setPayments(response.data)
    } catch (error) {
      toast.error('Failed to load payments')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    const data = payments.map(p => ({
      id: p.id,
      invoice_number: p.invoice?.invoice_number,
      customer: p.invoice?.customer?.name,
      amount: p.amount,
      method: p.payment_method,
      date: formatDate(p.payment_date),
      status: p.status,
    }))
    exportToCSV(data, `payments-${new Date().toISOString().split('T')[0]}.csv`)
    toast.success('Report exported')
  }

  const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Payments</h1>
          <p className="text-slate-500 mt-1">Track all incoming payments</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <DollarSign size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Received</p>
              <p className="text-xl font-bold text-[#111827]">{formatCurrency(totalPayments)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <CreditCard size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Transactions</p>
              <p className="text-xl font-bold text-[#111827]">{payments.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <DollarSign size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Average Payment</p>
              <p className="text-xl font-bold text-[#111827]">
                {payments.length > 0 
                  ? formatCurrency(totalPayments / payments.length)
                  : formatCurrency(0)
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB]">
        <div className="p-4 border-b border-[#E5E7EB]">
          <div className="relative max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by invoice number or customer..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : payments.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No payments recorded"
            description="Payments will appear here when you record them against invoices."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-500 border-b border-[#E5E7EB] bg-slate-50/50">
                  <th className="px-6 py-4 font-medium">Invoice</th>
                  <th className="px-6 py-4 font-medium hidden sm:table-cell">Customer</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium hidden md:table-cell">Method</th>
                  <th className="px-6 py-4 font-medium hidden lg:table-cell">Transaction ID</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-[#111827]">
                        {payment.invoice?.invoice_number || 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell text-sm text-slate-600">
                      {payment.invoice?.customer?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-emerald-600">
                        +{formatCurrency(payment.amount)}
                      </p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">
                        {payment.payment_method || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-sm text-slate-500 font-mono">
                      {payment.transaction_id || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDate(payment.payment_date)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                        payment.status === 'completed' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}