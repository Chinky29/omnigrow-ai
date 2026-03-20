import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  Legend
} from "recharts";

interface AnalysisChartProps {
  data: { label: string; impact: number }[];
  profit: number;
}

const AnalysisChart = ({ data, profit }: AnalysisChartProps) => {
  // 1. Bar Chart Data (Factors Impact)
  const barData = data.map(item => ({
    name: item.label,
    impact: item.impact,
  }));

  // 2. Pie Chart Data (Risk Distribution Simulation)
  const riskPieData = [
    { name: 'Low', value: 40, color: '#10b981' },
    { name: 'Medium', value: 35, color: '#facc15' },
    { name: 'High', value: 25, color: '#ef4444' },
  ];

  // 3. Profit Trend Data (Simulated 6-month trend)
  const profitTrendData = [
    { month: 'Jan', profit: profit * 0.8 },
    { month: 'Feb', profit: profit * 0.9 },
    { month: 'Mar', profit: profit * 1.1 },
    { month: 'Apr', profit: profit * 1.0 },
    { month: 'May', profit: profit * 1.2 },
    { month: 'Jun', profit: profit },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border-white/10 shadow-2xl backdrop-blur-3xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
          <p className="text-sm font-black text-primary">
            {payload[0].name}: {payload[0].value > 1000 ? `₹${payload[0].value.toLocaleString()}` : `${payload[0].value}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full h-full">
      {/* Factors Impact Bar Chart */}
      <div className="glass-card p-6 flex flex-col h-[350px]">
        <h3 className="section-title">Factors Impact Analysis</h3>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical" margin={{ left: 20, right: 30 }}>
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.impact >= 0 ? '#10b981' : '#ef4444'} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Distribution Pie Chart */}
      <div className="glass-card p-6 flex flex-col h-[350px]">
        <h3 className="section-title">Risk Distribution</h3>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={riskPieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {riskPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Profit Trend Line Chart */}
      <div className="glass-card p-6 flex flex-col h-[350px] lg:col-span-2">
        <h3 className="section-title">AI Predicted Earnings Trend</h3>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={profitTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                tickFormatter={(v) => `₹${v / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#10b981" 
                strokeWidth="4" 
                dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#020617' }}
                activeDot={{ r: 8, strokeWidth: 0 }}
                animationDuration={2000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalysisChart;
