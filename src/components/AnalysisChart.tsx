import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Language, translations } from "@/lib/translations";

interface AnalysisChartProps {
  factors: { label: string; impact: number }[];
  lang: Language;
}

const AnalysisChart = ({ factors, lang }: AnalysisChartProps) => {
  const t = translations[lang];

  // Map the factors to a format Recharts understands
  const data = factors.map((f) => ({
    name: f.label,
    impact: f.impact,
  }));

  return (
    <div className="w-full h-[180px] sm:h-[200px] mt-2 sm:mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} horizontal={false} />
          <XAxis 
            type="number" 
            hide 
            domain={[-40, 40]}
          />
          <YAxis
            dataKey="name"
            type="category"
            width={100}
            axisLine={false}
            tickLine={false}
            tick={({ x, y, payload }) => (
              <text
                x={x}
                y={y}
                dy={3}
                fill="currentColor"
                opacity={0.6}
                fontSize={9}
                textAnchor="start"
                className="font-medium uppercase tracking-tighter"
              >
                {payload.value}
              </text>
            )}
          />
          <Tooltip
            cursor={{ fill: "transparent" }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const val = payload[0].value as number;
                return (
                  <div className="glass-card p-2 border border-border/50 text-[10px] font-bold">
                    <span className={val >= 0 ? "text-neon-green" : "text-neon-red"}>
                      {val >= 0 ? "+" : ""}{val}% {lang === "en" ? "Impact" : "प्रभाव"}
                    </span>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey="impact" 
            radius={[0, 4, 4, 0]}
            barSize={12}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.impact >= 0 ? "hsl(var(--neon-green))" : "hsl(var(--neon-red))"}
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalysisChart;
