import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, FileText, Download, Calendar, Filter } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'
import RevenueChart from '../components/charts/RevenueChart'
import MonthlyBarChart from '../components/charts/MonthlyBarChart'
import StatusPieChart from '../components/charts/StatusPieChart'
import { formatCurrency } from '../utils/formatters'
import { exportToCSV, exportToJSON } from '../utils/exportHelpers'

export default function Reports() {
  const [reportType, setReportType] = useState('revenue')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchReportData()
  }, [reportType, startDate, endDate])

  const fetchReportData = async () => {
    setLoading(true)
    try {
      const params = {}
      if (startDate) params.start_date = startDate
      if (endDate) params.end_date = endDate
      
      const response = await api.get(`/reports/${reportType}`, { params })
      setData(response.data)
    } catch (error) {
      toast.error('Failed to load report data')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = (format) => {
    if (!data?.data) return
    
    const filename = `${reportType}_report_${new Date().toISOString().split('T')[0]}`
    
    if (format === 'csv') {
      exportToCSV(data.data, `${filename}.csv`)
    } else if (format === 'json') {
      exportToJSON(data.data, `${filename}.json`)
    }
    
    toast.success(`Report exported as ${format.toUpperCase()}`)
  }

  const reportTypes = [
    { value: 'revenue', label: 'Revenue Report', icon: TrendingUp },
    { value: 'customers', label: 'Customer Report', icon: Users },
    { value: 'invoices', label: 'Invoice Report', icon: FileText },
  ]

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Reports</h1>
          <p className="text-slate-500 mt-1">Generate and export business reports</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleExport('csv')}
            className="flex items-center gap-2 px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
          >
            <Download size={18} />
            Export CSV
          </button>
          <button 
            onClick={() => handleExport('json')}
            className="flex items-center gap-2 px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
          >
            <Download size={18} />
            Export JSON
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            {reportTypes.map(type => (
              <button
                key={type.value}
                onClick={() => setReportType(type.value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  reportType === type.value
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <type.icon size={16} />
                {type.label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-slate-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <span className="text-slate-400">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate('')
                  setEndDate('')
                }}
                className="text-sm text-red-500 hover:text-red-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#F8FAFC] rounded-xl p-5 border border-[#E5E7EB]">
                <p className="text-sm text-slate-500 mb-1">Total Records</p>
                <p className="text-2xl font-bold text-[#111827]">{data?.data?.length || 0}</p>
              </div>
              <div className="bg-[#F8FAFC] rounded-xl p-5 border border-[#E5E7EB]">
                <p className="text-sm text-slate-500 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-[#111827]">
                  {formatCurrency(data?.total || 0)}
                </p>
              </div>
              <div className="bg-[#F8FAFC] rounded-xl p-5 border border-[#E5E7EB]">
                <p className="text-sm text-slate-500 mb-1">Date Range</p>
                <p className="text-sm font-medium text-[#111827]">
                  {startDate || 'All time'} - {endDate || 'Present'}
                </p>
              </div>
            </div>

            {reportType === 'revenue' && data?.monthly_data && (
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
                <h3 className="text-lg font-semibold text-[#111827] mb-6">Revenue Over Time</h3>
                <MonthlyBarChart data={data.monthly_data} height={300} />
              </div>
            )}

            {data?.data && data.data.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-slate-500 border-b border-[#E5E7EB]">
                      {Object.keys(data.data[0]).map((key) => (
                        <th key={key} className="px-6 py-3 font-medium capitalize">{key.replace(/_/g, ' ')}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.data.map((row, index) => (
                      <tr key={index} className="border-b border-slate-50">
                        {Object.values(row).map((value, i) => (
                          <td key={i} className="px-6 py-3 text-sm text-slate-600">
                            {typeof value === 'number' && (typeof value === 'number') 
                              ? formatCurrency(value)
                              : value?.toString() || '-'
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500">
                <BarChart3 size={40} className="mx-auto mb-3 text-slate-300" />
                <p className="text-sm">No data available for the selected filters</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}