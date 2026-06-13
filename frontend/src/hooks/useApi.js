import { useState, useCallback } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

export function useApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(async (apiCall, options = {}) => {
    const { showToast = true, successMessage, errorMessage } = options
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiCall()
      if (showToast && successMessage) {
        toast.success(successMessage)
      }
      return response.data
    } catch (err) {
      const message = err.response?.data?.detail || errorMessage || 'Something went wrong'
      setError(message)
      if (showToast) {
        toast.error(message)
      }
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, execute }
}