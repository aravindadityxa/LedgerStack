import { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, Mail, Phone, MapPin, Building2, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'
import Modal from '../components/ui/Modal'
import CustomerForm from '../components/forms/CustomerForm'
import EmptyState from '../components/ui/EmptyState'
import { useDebounce } from '../hooks/useDebounce'
import { formatPhoneNumber } from '../utils/formatters'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    fetchCustomers()
  }, [debouncedSearch, page])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/customers', {
        params: {
          search: debouncedSearch || undefined,
          page,
          limit: 10,
        }
      })
      setCustomers(response.data)
      setTotalPages(Math.ceil(response.headers['x-total-count'] / 10) || 1)
    } catch (error) {
      toast.error('Failed to load customers')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (customer) => {
    setSelectedCustomer(customer)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/customers/${id}`)
      toast.success('Customer deleted successfully')
      setDeleteConfirm(null)
      fetchCustomers()
    } catch (error) {
      toast.error('Failed to delete customer')
    }
  }

  const handleSuccess = () => {
    setShowModal(false)
    setSelectedCustomer(null)
    fetchCustomers()
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Customers</h1>
          <p className="text-slate-500 mt-1">Manage your customer database</p>
        </div>
        <button 
          onClick={() => {
            setSelectedCustomer(null)
            setShowModal(true)
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] text-white rounded-xl text-sm font-medium hover:bg-[#1D4ED8] transition-all shadow-sm"
        >
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB]">
        <div className="p-4 border-b border-[#E5E7EB]">
          <div className="relative max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search customers by name, email, or company..."
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
          <div className="p-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-4 border-b border-slate-50 last:border-0">
                <div className="h-10 w-10 bg-slate-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-48 animate-pulse" />
                  <div className="h-3 bg-slate-100 rounded w-32 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : customers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No customers found"
            description={search ? "No customers match your search criteria." : "Start by adding your first customer."}
            action={
              !search && (
                <button
                  onClick={() => {
                    setSelectedCustomer(null)
                    setShowModal(true)
                  }}
                  className="px-4 py-2 bg-[#2563EB] text-white rounded-xl text-sm font-medium hover:bg-[#1D4ED8] transition-colors"
                >
                  Add First Customer
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
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium hidden md:table-cell">Company</th>
                    <th className="px-6 py-4 font-medium hidden lg:table-cell">Email</th>
                    <th className="px-6 py-4 font-medium hidden lg:table-cell">Phone</th>
                    <th className="px-6 py-4 font-medium hidden xl:table-cell">Address</th>
                    <th className="px-6 py-4 font-medium w-20">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr 
                      key={customer.id} 
                      className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#111827]">{customer.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-1.5">
                          <Building2 size={14} className="text-slate-400" />
                          <span className="text-sm text-slate-600">{customer.company_name || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        {customer.email ? (
                          <a href={`mailto:${customer.email}`} className="text-sm text-blue-600 hover:text-blue-700">
                            {customer.email}
                          </a>
                        ) : (
                          <span className="text-sm text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell text-sm text-slate-600">
                        {formatPhoneNumber(customer.phone) || '-'}
                      </td>
                      <td className="px-6 py-4 hidden xl:table-cell text-sm text-slate-600 max-w-xs truncate">
                        {customer.address || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEdit(customer)}
                            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                            title="Edit customer"
                          >
                            <Edit2 size={16} className="text-slate-500" />
                          </button>
                          <button 
                            onClick={() => setDeleteConfirm(customer.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete customer"
                          >
                            <Trash2 size={16} className="text-red-400" />
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
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        page === i + 1 
                          ? 'bg-[#2563EB] text-white' 
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => {
          setShowModal(false)
          setSelectedCustomer(null)
        }}
        title={selectedCustomer ? 'Edit Customer' : 'Add New Customer'}
        size="lg"
      >
        <CustomerForm 
          customer={selectedCustomer}
          onSuccess={handleSuccess}
        />
      </Modal>

      {deleteConfirm && (
        <Modal
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          title="Delete Customer"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Are you sure you want to delete this customer? This action cannot be undone and will also delete all associated invoices.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Delete Customer
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}