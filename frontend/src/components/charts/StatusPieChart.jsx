import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

export default function StatusPieChart({ data, height = 300 }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        No data available
      </div>
    )
  }

  const renderLegend = (props) => {
    const { payload } = props
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-slate-600 capitalize">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={4}
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, index) => (
            <Cell 
              key={index} 
              fill={entry.color || ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#6B7280'][index]} 
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
            padding: '8px 12px',
          }}
        />
        <Legend content={renderLegend} />
      </PieChart>
    </ResponsiveContainer>
  )
}