import React from "react";

interface RiskGaugeProps {
  value: number;
  label: string;
}

const RiskGauge = ({ value, label }: RiskGaugeProps) => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const getColor = (v: number) => {
    if (v < 30) return "text-primary";
    if (v < 60) return "text-yellow-400";
    return "text-destructive";
  };

  const getGlowColor = (v: number) => {
    if (v < 30) return "rgba(16, 185, 129, 0.4)";
    if (v < 60) return "rgba(250, 204, 21, 0.4)";
    return "rgba(239, 68, 68, 0.4)";
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 relative group">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl">
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-white/5"
          />
          {/* Progress Circle */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            strokeDasharray={circumference}
            style={{ 
              strokeDashoffset: offset,
              filter: `drop-shadow(0 0 12px ${getGlowColor(value)})`
            }}
            strokeLinecap="round"
            fill="transparent"
            className={`${getColor(value)} transition-all duration-1000 ease-out`}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-5xl font-black tracking-tighter ${getColor(value)} transition-colors duration-500`}>
            {value}%
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mt-1 opacity-60">
            AI Risk Score
          </span>
        </div>
      </div>
      
      {/* Label under the gauge */}
      <h3 className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-foreground/80">
        {label}
      </h3>
    </div>
  );
};

export default RiskGauge;
