import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { DollarSign, CreditCard, Building2, Wallet, Banknote, Calendar, FileText } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const paymentMethods = [
  { 
    value: 'credit_card', 
    label: 'Credit Card', 
    icon: CreditCard,
    color: 'text-blue-600 bg-blue-50'
  },
  { 
    value: 'bank_transfer', 
    label: 'Bank Transfer', 
    icon: Building2,
    color: 'text-purple-600 bg-purple-50'
  },
  { 
    value: 'paypal', 
    label: 'PayPal', 
    icon: Wallet,
    color: 'text-indigo-600 bg-indigo-50'
  },
  { 
    value: 'cash', 
    label: 'Cash', 
    icon: Banknote,
    color: 'text-emerald-600 bg-emerald-50'
  },
  { 
    value: 'other', 
    label: 'Other', 
    icon: CreditCard,
    color: 'text-slate-600 bg-slate-50'
  },
]

export default function PaymentForm({ invoiceId, totalDue, onSuccess, onCancel }) {
  const [selectedMethod, setSelectedMethod] = useState('credit_card')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      invoice_id: invoiceId,
      amount: totalDue || 0,
      payment_method: 'credit_card',
      payment_date: new Date().toISOString().split('T')[0],
      transaction_id: '',
      notes: '',
    }
  })

  const watchAmount = watch('amount')

  const onSubmit = async (data) => {
    if (!data.amount || data.amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    if (data.amount > totalDue) {
      toast.error(`Amount cannot exceed the balance due of $${totalDue.toLocaleString()}`)
      return
    }

    setIsSubmitting(true)
    try {
      await api.post('/payments', {
        ...data,
        amount: parseFloat(data.amount),
      })
      toast.success('Payment recorded successfully')
      onSuccess?.()
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to record payment'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleQuickAmount = (percentage) => {
    const amount = (totalDue * percentage).toFixed(2)
    setValue('amount', parseFloat(amount))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Amount Section */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Payment Amount *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <DollarSign size={18} className="text-slate-400" />
          </div>
          <input
            type="number"
            step="0.01"
            min="0.01"
            max={totalDue}
            {...register('amount', { 
              required: 'Amount is required',
              min: { value: 0.01, message: 'Amount must be greater than 0' },
              max: { value: totalDue, message: `Amount cannot exceed $${totalDue.toLocaleString()}` },
              valueAsNumber: true,
            })}
            className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            placeholder="0.00"
            autoFocus
          />
        </div>
        
        {/* Quick Amount Buttons */}
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => handleQuickAmount(0.25)}
            className="flex-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            25%
          </button>
          <button
            type="button"
            onClick={() => handleQuickAmount(0.5)}
            className="flex-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            50%
          </button>
          <button
            type="button"
            onClick={() => handleQuickAmount(0.75)}
            className="flex-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            75%
          </button>
          <button
            type="button"
            onClick={() => handleQuickAmount(1)}
            className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors"
          >
            Full Amount
          </button>
        </div>
        
        {errors.amount && (
          <p className="text-xs text-red-500 mt-1.5">{errors.amount.message}</p>
        )}
        
        {watchAmount && totalDue && (
          <div className="flex items-center justify-between mt-2 px-1">
            <span className="text-xs text-slate-500">
              {watchAmount >= totalDue ? 'Full payment' : 'Partial payment'}
            </span>
            <span className="text-xs font-medium text-slate-600">
              Balance after payment: ${Math.max(0, totalDue - watchAmount).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Payment Method Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Payment Method
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {paymentMethods.map((method) => {
            const Icon = method.icon
            return (
              <button
                key={method.value}
                type="button"
                onClick={() => {
                  setSelectedMethod(method.value)
                  setValue('payment_method', method.value)
                }}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  selectedMethod === method.value
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-[#E5E7EB] hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${method.color}`}>
                  <Icon size={20} />
                </div>
                <span className="text-xs font-medium text-slate-700">{method.label}</span>
              </button>
            )
          })}
        </div>
        <input type="hidden" {...register('payment_method')} />
      </div>

      {/* Date & Transaction ID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-slate-400" />
              Payment Date *
            </div>
          </label>
          <input
            type="date"
            {...register('payment_date', { required: 'Payment date is required' })}
            className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {errors.payment_date && (
            <p className="text-xs text-red-500 mt-1">{errors.payment_date.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-slate-400" />
              Transaction ID
            </div>
          </label>
          <input
            type="text"
            {...register('transaction_id')}
            className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
            placeholder="e.g., TXN-123456"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Notes (Optional)
        </label>
        <textarea
          {...register('notes')}
          rows={2}
          className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
          placeholder="Add any additional notes about this payment..."
        />
      </div>

      {/* Summary */}
      <div className="bg-slate-50 rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Total Due</span>
          <span className="font-semibold text-[#111827]">
            ${totalDue?.toLocaleString() || '0.00'}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Payment Amount</span>
          <span className="font-semibold text-emerald-600">
            ${watchAmount ? parseFloat(watchAmount).toLocaleString() : '0.00'}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm font-semibold border-t border-[#E5E7EB] pt-2">
          <span>Remaining Balance</span>
          <span className={watchAmount >= totalDue ? 'text-emerald-600' : 'text-amber-600'}>
            ${watchAmount ? Math.max(0, totalDue - watchAmount).toLocaleString() : totalDue?.toLocaleString() || '0.00'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel || onSuccess}
          className="px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-[#2563EB] text-white rounded-xl text-sm font-medium hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <DollarSign size={16} />
              Record Payment
            </>
          )}
        </button>
      </div>
    </form>
  )
}