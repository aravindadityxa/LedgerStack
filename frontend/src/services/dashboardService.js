import api from './api'

export const dashboardService = {
  getStats: () => api.get('/dashboard'),
  getRevenueReport: (params) => api.get('/reports/revenue', { params }),
}