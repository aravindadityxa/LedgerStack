import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function ServiceForm({ service, onSuccess }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      category: '',
    }
  })

  useEffect(() => {
    if (service) {
      reset({
        name: service.name,
        description: service.description || '',
        price: service.price,
        category: service.category || '',
      })
    }
  }, [service, reset])

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        price: parseFloat(data.price) || 0,
      }

      if (service) {
        await api.put(`/services/${service.id}`, payload)
        toast.success('Service updated successfully')
      } else {
        await api.post('/services', payload)
        toast.success('Service created successfully')
      }
      onSuccess?.()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Something went wrong')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Service Name *</label>
        <input
          {...register('name', { required: 'Service name is required' })}
          className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          placeholder="e.g., Web Development"
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
        <select
          {...register('category')}
          className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        >
          <option value="">Select category</option>
          <option value="Development">Development</option>
          <option value="Design">Design</option>
          <option value="Marketing">Marketing</option>
          <option value="Consulting">Consulting</option>
          <option value="Content">Content</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
          placeholder="Brief description of the service..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Price *</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
          <input
            type="number"
            step="0.01"
            min="0"
            {...register('price', { 
              required: 'Price is required',
              min: { value: 0, message: 'Price must be 0 or more' }
            })}
            className="w-full pl-8 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            placeholder="0.00"
          />
        </div>
        {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onSuccess}
          className="px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2.5 bg-[#2563EB] text-white rounded-xl text-sm font-medium hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? 'Saving...' : service ? 'Update Service' : 'Create Service'}
        </button>
      </div>
    </form>
  )
}