import api from './api'

export const invoiceService = {
  getAll: (params = {}) => api.get('/invoices', { params }),
  getById: (id) => api.get(`/invoices/${id}`),
  create: (data) => api.post('/invoices', data),
  update: (id, data) => api.put(`/invoices/${id}`, data),
  delete: (id) => api.delete(`/invoices/${id}`),
  duplicate: (id) => api.post(`/invoices/${id}/duplicate`),
  downloadPdf: (id) => api.get(`/invoices/${id}/pdf`, { responseType: 'blob' }),
  getPdfUrl: (id) => `${api.defaults.baseURL}/invoices/${id}/pdf`,
}