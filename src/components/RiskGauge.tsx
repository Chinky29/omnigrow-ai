import { useEffect, useState } from "react";

interface RiskGaugeProps {
  value: number; // 0-100
  label?: string;
}

const RiskGauge = ({ value, label = "Risk Level" }: RiskGaugeProps) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedValue(value), 100);
    return () => clearTimeout(timeout);
  }, [value]);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

  const getColor = (v: number) => {
    if (v < 35) return { stroke: "hsl(var(--neon-green))", glow: "hsl(var(--neon-green) / 0.4)", label: "Low" };
    if (v < 65) return { stroke: "hsl(var(--neon-yellow))", glow: "hsl(var(--neon-yellow) / 0.4)", label: "Medium" };
    return { stroke: "hsl(var(--neon-red))", glow: "hsl(var(--neon-red) / 0.4)", label: "High" };
  };

  const colorInfo = getColor(animatedValue);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke={colorInfo.stroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: "stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.4s ease",
              filter: `drop-shadow(0 0 8px ${colorInfo.glow})`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl font-bold font-mono transition-colors duration-400"
            style={{ color: colorInfo.stroke }}
          >
            {Math.round(animatedValue)}%
          </span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">
            {colorInfo.label}
          </span>
        </div>
      </div>
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
    </div>
  );
};

export default RiskGauge;
