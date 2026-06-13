import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, Copy, Edit3, CreditCard, Trash2 } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'
import StatusBadge from '../components/shared/StatusBadge'
import Modal from '../components/ui/Modal'
import PaymentForm from '../components/forms/PaymentForm'

export default function InvoiceDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  useEffect(() => {
    fetchInvoice()
  }, [id])

  const fetchInvoice = async () => {
    try {
      const response = await api.get(`/invoices/${id}`)
      setInvoice(response.data)
    } catch (error) {
      toast.error('Failed to load invoice')
      navigate('/invoices')
    } finally {
      setLoading(false)
    }
  }

  const handleDuplicate = async () => {
    try {
      const response = await api.post(`/invoices/${id}/duplicate`)
      toast.success('Invoice duplicated')
      navigate(`/invoices/${response.data.id}`)
    } catch (error) {
      toast.error('Failed to duplicate invoice')
    }
  }

  const handleDownloadPdf = async () => {
    try {
      const response = await api.get(`/invoices/${id}/pdf`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `invoice-${invoice.invoice_number}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('PDF downloaded')
    } catch (error) {
      toast.error('Failed to download PDF')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this invoice?')) return
    try {
      await api.delete(`/invoices/${id}`)
      toast.success('Invoice deleted')
      navigate('/invoices')
    } catch (error) {
      toast.error('Failed to delete invoice')
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="h-64 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!invoice) return null

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/invoices')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to invoices
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">
            Invoice #{invoice.invoice_number}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <StatusBadge status={invoice.status} />
            <span className="text-sm text-slate-500">
              Created {new Date(invoice.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/invoices/${id}/edit`)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Edit3 size={16} />
            Edit
          </button>
          <button
            onClick={handleDuplicate}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Copy size={16} />
            Duplicate
          </button>
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
          >
            <Download size={16} />
            PDF
          </button>
          {(invoice.status === 'draft' || invoice.status === 'pending') && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-xl text-sm font-medium hover:bg-[#1D4ED8] transition-colors"
            >
              <CreditCard size={16} />
              Record Payment
            </button>
          )}
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 space-y-6">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-2">Bill From</h3>
            <p className="text-sm font-semibold text-[#111827]">
              {invoice.user?.company_name || invoice.user?.full_name}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-2">Bill To</h3>
            <p className="text-sm font-semibold text-[#111827]">{invoice.customer?.name}</p>
            {invoice.customer?.company_name && (
              <p className="text-sm text-slate-600">{invoice.customer.company_name}</p>
            )}
            {invoice.customer?.email && (
              <p className="text-sm text-slate-600">{invoice.customer.email}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Issue Date</h3>
            <p className="text-sm text-[#111827]">{new Date(invoice.issue_date).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Due Date</h3>
            <p className="text-sm text-[#111827]">{new Date(invoice.due_date).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Status</h3>
            <StatusBadge status={invoice.status} />
          </div>
        </div>

        <div className="border-t border-[#E5E7EB] pt-6">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-slate-500 border-b border-[#E5E7EB]">
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium text-right">Qty</th>
                <th className="pb-3 font-medium text-right">Unit Price</th>
                <th className="pb-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items?.map((item, index) => (
                <tr key={index} className="border-b border-slate-50">
                  <td className="py-4 text-sm text-[#111827]">{item.description}</td>
                  <td className="py-4 text-sm text-slate-600 text-right">{item.quantity}</td>
                  <td className="py-4 text-sm text-slate-600 text-right">${item.unit_price.toLocaleString()}</td>
                  <td className="py-4 text-sm text-[#111827] font-medium text-right">${item.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="text-[#111827]">${invoice.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Tax ({invoice.tax_rate}%)</span>
              <span className="text-[#111827]">${invoice.tax_amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base font-bold border-t border-[#E5E7EB] pt-3">
              <span>Total</span>
              <span className="text-[#2563EB]">${invoice.total.toLocaleString()}</span>
            </div>
            {invoice.amount_paid > 0 && (
              <>
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Amount Paid</span>
                  <span>${invoice.amount_paid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-500">Balance Due</span>
                  <span className="text-red-600">${invoice.balance_due.toLocaleString()}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {invoice.notes && (
          <div className="border-t border-[#E5E7EB] pt-6">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Notes</h3>
            <p className="text-sm text-slate-600">{invoice.notes}</p>
          </div>
        )}
      </div>

      {invoice.payments?.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
          <h3 className="text-lg font-semibold text-[#111827] mb-4">Payment History</h3>
          <div className="space-y-3">
            {invoice.payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-[#111827]">
                    ${payment.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500">
                    {payment.payment_method} • {new Date(payment.payment_date).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                  {payment.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Record Payment"
      >
        <PaymentForm
          invoiceId={parseInt(id)}
          totalDue={invoice.balance_due}
          onSuccess={() => {
            setShowPaymentModal(false)
            fetchInvoice()
          }}
        />
      </Modal>
    </div>
  )
}