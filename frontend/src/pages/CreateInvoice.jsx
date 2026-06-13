import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, Trash2, Save, Send, ArrowLeft, Copy } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function CreateInvoice() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id
  
  const [customers, setCustomers] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEditing)
  
  const [formData, setFormData] = useState({
    customer_id: '',
    invoice_number: `INV-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.random().toString(36).substring(2,6).toUpperCase()}`,
    issue_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
    status: 'draft',
    notes: '',
    terms: '',
    tax_rate: 0,
    discount: 0,
    items: [{ description: '', quantity: 1, unit_price: 0, total: 0 }]
  })

  useEffect(() => {
    fetchCustomers()
    fetchServices()
    if (id) fetchInvoice()
  }, [id])

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers')
      setCustomers(response.data)
    } catch (error) {
      toast.error('Failed to load customers')
    }
  }

  const fetchServices = async () => {
    try {
      const response = await api.get('/services')
      setServices(response.data)
    } catch (error) {
      toast.error('Failed to load services')
    }
  }

  const fetchInvoice = async () => {
    try {
      const response = await api.get(`/invoices/${id}`)
      const invoice = response.data
      setFormData({
        customer_id: invoice.customer_id,
        invoice_number: invoice.invoice_number,
        issue_date: invoice.issue_date?.split('T')[0],
        due_date: invoice.due_date?.split('T')[0],
        status: invoice.status,
        notes: invoice.notes || '',
        terms: invoice.terms || '',
        tax_rate: invoice.tax_rate,
        discount: invoice.discount || 0,
        items: invoice.items?.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total: item.total
        })) || [{ description: '', quantity: 1, unit_price: 0, total: 0 }]
      })
    } catch (error) {
      toast.error('Failed to load invoice')
      navigate('/invoices')
    } finally {
      setFetching(false)
    }
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unit_price: 0, total: 0 }]
    })
  }

  const removeItem = (index) => {
    if (formData.items.length === 1) return
    const items = formData.items.filter((_, i) => i !== index)
    setFormData({ ...formData, items })
  }

  const updateItem = (index, field, value) => {
    const items = [...formData.items]
    items[index][field] = value
    
    if (field === 'quantity' || field === 'unit_price') {
      const qty = parseFloat(items[index].quantity) || 0
      const price = parseFloat(items[index].unit_price) || 0
      items[index].total = qty * price
    }
    
    setFormData({ ...formData, items })
  }

  const selectService = (index, serviceId) => {
    const service = services.find(s => s.id === parseInt(serviceId))
    if (service) {
      const items = [...formData.items]
      items[index] = {
        ...items[index],
        description: service.name,
        unit_price: service.price,
        total: items[index].quantity * service.price
      }
      setFormData({ ...formData, items })
    }
  }

  const subtotal = formData.items.reduce((sum, item) => sum + (item.total || 0), 0)
  const discountAmount = subtotal * ((formData.discount || 0) / 100)
  const taxableAmount = subtotal - discountAmount
  const taxAmount = taxableAmount * ((formData.tax_rate || 0) / 100)
  const total = taxableAmount + taxAmount

  const validateForm = () => {
    if (!formData.customer_id) {
      toast.error('Please select a customer')
      return false
    }
    if (formData.items.some(item => !item.description)) {
      toast.error('Please fill in all item descriptions')
      return false
    }
    return true
  }

  const handleSubmit = async (status = 'draft') => {
    if (!validateForm()) return
    
    setLoading(true)
    try {
      const payload = {
        ...formData,
        status,
        subtotal,
        tax_amount: taxAmount,
        discount: discountAmount,
        total,
        issue_date: new Date(formData.issue_date).toISOString(),
        due_date: new Date(formData.due_date).toISOString(),
      }
      
      if (isEditing) {
        await api.put(`/invoices/${id}`, payload)
        toast.success('Invoice updated successfully')
      } else {
        await api.post('/invoices', payload)
        toast.success('Invoice created successfully')
      }
      navigate('/invoices')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save invoice')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="h-96 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 fade-in">
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
            {isEditing ? 'Edit Invoice' : 'New Invoice'}
          </h1>
          <p className="text-slate-500 mt-1">
            {isEditing ? `Editing ${formData.invoice_number}` : 'Create a new invoice for your customer'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleSubmit('draft')}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
          >
            <Save size={18} />
            Save Draft
          </button>
          <button 
            onClick={() => handleSubmit('pending')}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] text-white rounded-xl text-sm font-medium hover:bg-[#1D4ED8] transition-all shadow-sm disabled:opacity-50"
          >
            <Send size={18} />
            {loading ? 'Saving...' : 'Send Invoice'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 md:p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Customer *
            </label>
            <select 
              value={formData.customer_id}
              onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="">Select customer</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}{c.company_name ? ` - ${c.company_name}` : ''}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Invoice Number</label>
            <input 
              type="text" 
              value={formData.invoice_number}
              readOnly
              className="w-full px-4 py-2.5 bg-slate-100 border border-[#E5E7EB] rounded-xl text-sm text-slate-500 cursor-not-allowed"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Issue Date</label>
            <input 
              type="date" 
              value={formData.issue_date}
              onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Due Date</label>
            <input 
              type="date" 
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[#111827]">Invoice Items</h3>
            <button 
              type="button"
              onClick={addItem}
              className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <Plus size={16} />
              Add Item
            </button>
          </div>
          
          <div className="space-y-3">
            {formData.items.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-3 p-4 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB]">
                <div className="flex-1">
                  <select
                    onChange={(e) => selectService(index, e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 mb-2"
                    value=""
                  >
                    <option value="">Select a service (optional)</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name} (${s.price})</option>
                    ))}
                  </select>
                  <input 
                    type="text" 
                    placeholder="Item description"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="w-20">
                    <label className="text-xs text-slate-500 mb-1 block">Qty</label>
                    <input 
                      type="number" 
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="w-28">
                    <label className="text-xs text-slate-500 mb-1 block">Unit Price</label>
                    <input 
                      type="number" 
                      step="0.01"
                      min="0"
                      value={item.unit_price}
                      onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="w-24">
                    <label className="text-xs text-slate-500 mb-1 block">Total</label>
                    <div className="px-2 py-2 text-sm font-medium text-[#111827]">
                      ${(item.total || 0).toLocaleString()}
                    </div>
                  </div>
                  {formData.items.length > 1 && (
                    <div className="flex items-end pb-0.5">
                      <button 
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#E5E7EB] pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                <textarea 
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Payment terms, additional notes, etc."
                  className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Terms & Conditions</label>
                <textarea 
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                  rows={2}
                  placeholder="Terms and conditions..."
                  className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium">${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <label className="text-sm text-slate-600">Discount (%)</label>
                <input 
                  type="number" 
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                  className="w-20 px-2 py-1.5 bg-white border border-[#E5E7EB] rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {formData.discount > 0 && (
                <div className="flex items-center justify-between text-sm text-red-600">
                  <span>Discount</span>
                  <span>-${discountAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <label className="text-sm text-slate-600">Tax Rate (%)</label>
                <input 
                  type="number" 
                  min="0"
                  max="100"
                  value={formData.tax_rate}
                  onChange={(e) => setFormData({ ...formData, tax_rate: parseFloat(e.target.value) || 0 })}
                  className="w-20 px-2 py-1.5 bg-white border border-[#E5E7EB] rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Tax Amount</span>
                <span className="font-medium">${taxAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
              
              <div className="flex items-center justify-between text-lg font-bold border-t-2 border-[#E5E7EB] pt-4">
                <span>Total</span>
                <span className="text-[#2563EB]">${total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}