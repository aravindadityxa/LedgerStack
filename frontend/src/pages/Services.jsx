import { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, Briefcase, DollarSign, Tag } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'
import Modal from '../components/ui/Modal'
import ServiceForm from '../components/forms/ServiceForm'
import EmptyState from '../components/ui/EmptyState'
import { useDebounce } from '../hooks/useDebounce'
import { formatCurrency } from '../utils/formatters'

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    fetchServices()
  }, [debouncedSearch])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await api.get('/services', {
        params: { search: debouncedSearch || undefined }
      })
      setServices(response.data)
    } catch (error) {
      toast.error('Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (service) => {
    setSelectedService(service)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/services/${id}`)
      toast.success('Service deleted successfully')
      setDeleteConfirm(null)
      fetchServices()
    } catch (error) {
      toast.error('Failed to delete service')
    }
  }

  const handleSuccess = () => {
    setShowModal(false)
    setSelectedService(null)
    fetchServices()
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Services</h1>
          <p className="text-slate-500 mt-1">Manage your product and service catalog</p>
        </div>
        <button 
          onClick={() => {
            setSelectedService(null)
            setShowModal(true)
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] text-white rounded-xl text-sm font-medium hover:bg-[#1D4ED8] transition-all shadow-sm"
        >
          <Plus size={18} />
          Add Service
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB]">
        <div className="p-4 border-b border-[#E5E7EB]">
          <div className="relative max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4 rounded-xl border border-[#E5E7EB] animate-pulse">
                <div className="h-5 bg-slate-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-slate-100 rounded w-full mb-2" />
                <div className="h-6 bg-slate-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No services found"
            description={search ? "No services match your search." : "Start by adding your first service."}
            action={
              !search && (
                <button
                  onClick={() => {
                    setSelectedService(null)
                    setShowModal(true)
                  }}
                  className="px-4 py-2 bg-[#2563EB] text-white rounded-xl text-sm font-medium hover:bg-[#1D4ED8] transition-colors"
                >
                  Add First Service
                </button>
              )
            }
          />
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div 
                key={service.id}
                className="group relative bg-[#F8FAFC] rounded-2xl p-5 border border-[#E5E7EB] hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300"
              >
                <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEdit(service)}
                    className="p-1.5 hover:bg-white rounded-lg transition-colors"
                  >
                    <Edit2 size={14} className="text-slate-400" />
                  </button>
                  <button 
                    onClick={() => setDeleteConfirm(service.id)}
                    className="p-1.5 hover:bg-white rounded-lg transition-colors"
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Briefcase size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#111827] truncate">{service.name}</h3>
                    {service.category && (
                      <div className="flex items-center gap-1 mt-1">
                        <Tag size={12} className="text-slate-400" />
                        <span className="text-xs text-slate-500">{service.category}</span>
                      </div>
                    )}
                  </div>
                </div>

                {service.description && (
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{service.description}</p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
                  <span className="text-xs text-slate-500">Price</span>
                  <span className="text-lg font-bold text-[#2563EB]">
                    {formatCurrency(service.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => {
          setShowModal(false)
          setSelectedService(null)
        }}
        title={selectedService ? 'Edit Service' : 'Add New Service'}
        size="md"
      >
        <ServiceForm 
          service={selectedService}
          onSuccess={handleSuccess}
        />
      </Modal>

      {deleteConfirm && (
        <Modal
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          title="Delete Service"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Are you sure you want to delete this service? This action cannot be undone.
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
                Delete Service
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}