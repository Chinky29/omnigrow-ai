import { CloudRain, AlertTriangle, Sun } from "lucide-react";

interface WeatherBannerProps {
  rainfall: number;
}

const WeatherBanner = ({ rainfall }: WeatherBannerProps) => {
  const isLow = rainfall < 30;
  const isHigh = rainfall > 75;

  if (!isLow && !isHigh) return null;

  return (
    <div
      className={`rounded-xl px-4 py-3 flex items-center gap-3 text-sm transition-all duration-500 ${
        isLow
          ? "bg-neon-red/10 border border-neon-red/20 text-neon-red"
          : "bg-neon-blue/10 border border-neon-blue/20 text-neon-blue"
      }`}
    >
      {isLow ? (
        <>
          <AlertTriangle className="w-4 h-4 shrink-0 animate-pulse-neon" />
          <span>⚠️ Low rainfall expected — High risk of crop failure. Consider irrigation.</span>
        </>
      ) : (
        <>
          <CloudRain className="w-4 h-4 shrink-0" />
          <span>🌧 Heavy rainfall expected — Risk of waterlogging. Ensure proper drainage.</span>
        </>
      )}
    </div>
  );
};

export default WeatherBanner;
