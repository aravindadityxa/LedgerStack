import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Filter, Download, Copy, Eye, MoreVertical, FileText, Calendar, DollarSign } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'
import StatusBadge from '../components/shared/StatusBadge'
import EmptyState from '../components/ui/EmptyState'
import { useDebounce } from '../hooks/useDebounce'
import { formatCurrency, formatDate } from '../utils/formatters'
import { downloadInvoicePdf } from '../utils/pdfHelper'

export default function Invoices() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const navigate = useNavigate()
  
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    fetchInvoices()
  }, [debouncedSearch, statusFilter, page])

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const response = await api.get('/invoices', {
        params: {
          search: debouncedSearch || undefined,
          status: statusFilter || undefined,
          page,
          limit: 20,
        }
      })
      setInvoices(response.data)
      setTotalPages(Math.ceil(response.headers['x-total-count'] / 20) || 1)
    } catch (error) {
      toast.error('Failed to load invoices')
    } finally {
      setLoading(false)
    }
  }

  const handleDuplicate = async (id) => {
    try {
      const response = await api.post(`/invoices/${id}/duplicate`)
      toast.success('Invoice duplicated')
      navigate(`/invoices/${response.data.id}`)
    } catch (error) {
      toast.error('Failed to duplicate invoice')
    }
  }

  const handleDownloadPdf = async (invoice) => {
    try {
      await downloadInvoicePdf(invoice.id, invoice.invoice_number)
      toast.success('PDF downloaded')
    } catch (error) {
      toast.error('Failed to download PDF')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return
    try {
      await api.delete(`/invoices/${id}`)
      toast.success('Invoice deleted')
      fetchInvoices()
    } catch (error) {
      toast.error('Failed to delete invoice')
    }
  }

  const statuses = [
    { value: '', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
  ]

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Invoices</h1>
          <p className="text-slate-500 mt-1">Manage and track your invoices</p>
        </div>
        <button 
          onClick={() => navigate('/invoices/new')}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] text-white rounded-xl text-sm font-medium hover:bg-[#1D4ED8] transition-all shadow-sm"
        >
          <Plus size={18} />
          Create Invoice
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB]">
        <div className="p-4 border-b border-[#E5E7EB] flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by invoice number..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              className="px-4 py-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {statuses.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : invoices.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No invoices found"
            description={search || statusFilter ? "No invoices match your filters." : "Create your first invoice to get started."}
            action={
              !search && !statusFilter && (
                <button
                  onClick={() => navigate('/invoices/new')}
                  className="px-4 py-2 bg-[#2563EB] text-white rounded-xl text-sm font-medium hover:bg-[#1D4ED8] transition-colors"
                >
                  Create First Invoice
                </button>
              )
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-slate-500 border-b border-[#E5E7EB] bg-slate-50/50">
                    <th className="px-6 py-4 font-medium">Invoice</th>
                    <th className="px-6 py-4 font-medium hidden sm:table-cell">Customer</th>
                    <th className="px-6 py-4 font-medium hidden md:table-cell">Issue Date</th>
                    <th className="px-6 py-4 font-medium hidden md:table-cell">Due Date</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium w-20">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr 
                      key={invoice.id}
                      className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/invoices/${invoice.id}`)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                            <FileText size={16} className="text-blue-600" />
                          </div>
                          <p className="text-sm font-semibold text-[#111827]">
                            {invoice.invoice_number}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell text-sm text-slate-600">
                        {invoice.customer?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell text-sm text-slate-600">
                        {formatDate(invoice.issue_date)}
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell text-sm text-slate-600">
                        {formatDate(invoice.due_date)}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#111827]">
                        {formatCurrency(invoice.total)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={invoice.status} />
                      </td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => navigate(`/invoices/${invoice.id}`)}
                            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                            title="View invoice"
                          >
                            <Eye size={16} className="text-slate-500" />
                          </button>
                          <button 
                            onClick={() => handleDownloadPdf(invoice)}
                            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                            title="Download PDF"
                          >
                            <Download size={16} className="text-slate-500" />
                          </button>
                          <button 
                            onClick={() => handleDuplicate(invoice.id)}
                            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                            title="Duplicate"
                          >
                            <Copy size={16} className="text-slate-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB]">
                <p className="text-sm text-slate-500">
                  Page {page} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}