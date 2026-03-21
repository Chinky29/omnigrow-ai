import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Activity, TrendingUp, ShieldAlert, Lightbulb } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSimulation } from "@/contexts/SimulationContext";

const COLORS = ["#22c55e", "#eab308", "#ef4444"];

const Analytics = () => {
  const { lang } = useLanguage();
  const { result, farmData } = useSimulation();

  // Factors bar chart data from simulation result
  const factorsData = result.factors.map(f => ({
    name: f.label,
    impact: f.impact,
    fill: f.impact >= 0 ? "#22c55e" : "#ef4444",
  }));

  // Risk distribution donut
  const risk = result.risk;
  const riskData = [
    { name: "Low", value: Math.max(0, 100 - risk - 20) },
    { name: "Medium", value: Math.min(20, 100 - risk) },
    { name: "High", value: risk },
  ];

  // AI Predicted Earnings Trend — 6 month projection
  const baseProfit = result.profit;
  const earningsData = [
    { month: "Jan", earnings: Math.round(baseProfit * 0.75) },
    { month: "Feb", earnings: Math.round(baseProfit * 0.85) },
    { month: "Mar", earnings: Math.round(baseProfit * 0.95) },
    { month: "Apr", earnings: Math.round(baseProfit * 1.05) },
    { month: "May", earnings: Math.round(baseProfit * 1.10) },
    { month: "Jun", earnings: Math.round(baseProfit * 1.00) },
  ];

  const formatINR = (v: number) =>
    `₹${Math.abs(v / 1000).toFixed(1)}k`;

  return (
    <div className="min-h-screen bg-background text-foreground pt-16 sm:pt-20 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 neon-glow-green">
              <Activity className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase">
                {lang === "en" ? "AI Insights" : "AI विश्लेषण"}
              </h1>
              <p className="text-[10px] text-primary font-bold tracking-widest uppercase">
                {lang === "en" ? "Advanced Predictive Analytics" : "उन्नत भविष्यसूचक विश्लेषण"}
              </p>
            </div>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            {lang === "en"
              ? "Charts update automatically when you simulate on the Dashboard."
              : "डैशबोर्ड पर सिमुलेट करने पर चार्ट स्वचालित रूप से अपडेट होते हैं।"}
          </p>
        </div>

        {/* Top row: Factors + Risk Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Factors Impact Bar Chart */}
          <div className="glass-card p-6 space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              {lang === "en" ? "Factors Impact Analysis" : "कारकों का प्रभाव विश्लेषण"}
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={factorsData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" domain={[-30, 30]} tickFormatter={v => `${v > 0 ? "+" : ""}${v}`}
                  tick={{ fontSize: 10, fill: "#888" }} />
                <YAxis type="category" dataKey="name" width={100}
                  tick={{ fontSize: 10, fill: "#aaa" }} />
                <Tooltip
                  formatter={(v: number) => [`${v > 0 ? "+" : ""}${v}%`, lang === "en" ? "Impact" : "प्रभाव"]}
                  contentStyle={{ background: "#111", border: "1px solid #333", borderRadius: 8 }}
                />
                <Bar dataKey="impact" radius={[0, 6, 6, 0]}>
                  {factorsData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Distribution Donut */}
          <div className="glass-card p-6 space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              {lang === "en" ? "Risk Distribution" : "जोखिम वितरण"}
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={riskData} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                  dataKey="value" paddingAngle={3}>
                  {riskData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Legend
                  formatter={(value) => <span style={{ fontSize: 10, color: "#aaa" }}>{value}</span>}
                />
                <Tooltip
                  contentStyle={{ background: "#111", border: "1px solid #333", borderRadius: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Earnings Trend Line Chart */}
        <div className="glass-card p-6 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            {lang === "en" ? "AI Predicted Earnings Trend" : "AI अनुमानित कमाई का रुझान"}
          </p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={earningsData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#888" }} />
              <YAxis tickFormatter={formatINR} tick={{ fontSize: 11, fill: "#888" }} />
              <Tooltip
                formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, lang === "en" ? "Earnings" : "कमाई"]}
                contentStyle={{ background: "#111", border: "1px solid #333", borderRadius: 8 }}
              />
              <Line type="monotone" dataKey="earnings" stroke="#22c55e"
                strokeWidth={2.5} dot={{ fill: "#22c55e", r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom row: Recommended Actions + Breakeven */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Recommended Actions */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <Lightbulb className="w-4 h-4 text-primary" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                {lang === "en" ? "Recommended Actions" : "अनुशंसित कार्य"}
              </p>
            </div>
            <ul className="space-y-3">
              {result.actions.map((action, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground/90">
                  <span className="text-primary mt-0.5">→</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Breakeven Analysis */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center border border-secondary/20">
                <ShieldAlert className="w-4 h-4 text-secondary" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                {lang === "en" ? "Break-Even Analysis" : "ब्रेक-ईवन विश्लेषण"}
              </p>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed italic font-medium">
              "{result.breakeven}"
            </p>
            <div className="pt-2 border-t border-border/40 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                  {lang === "en" ? "Crop" : "फसल"}
                </p>
                <p className="text-base font-black text-primary mt-1">{farmData.crop}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                  {lang === "en" ? "Overall Risk" : "कुल जोखिम"}
                </p>
                <p className={`text-base font-black mt-1 ${risk < 30 ? "text-green-400" : risk < 60 ? "text-yellow-400" : "text-red-400"}`}>
                  {risk}% {risk < 30 ? (lang === "en" ? "LOW" : "कम") : risk < 60 ? (lang === "en" ? "MEDIUM" : "मध्यम") : (lang === "en" ? "HIGH" : "उच्च")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tip */}
        <div className="glass-card p-4 border-dashed border-2 bg-muted/5 text-center">
          <p className="text-sm text-muted-foreground italic">
            {lang === "en"
              ? "💡 Go to Dashboard → enter your farm data → click Simulate Future to update all charts."
              : "💡 डैशबोर्ड पर जाएं → अपना खेत डेटा डालें → सभी चार्ट अपडेट करने के लिए 'Simulate Future' पर क्लिक करें।"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
