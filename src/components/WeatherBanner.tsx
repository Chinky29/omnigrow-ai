import { CloudRain, AlertTriangle, Sun } from "lucide-react";
import { Language, translations } from "@/lib/translations";

interface WeatherBannerProps {
  rainfall: number;
  lang: Language;
}

const WeatherBanner = ({ rainfall, lang }: WeatherBannerProps) => {
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
          <span>
            {lang === "en" 
              ? "⚠️ Low rainfall expected — High risk of crop failure. Consider irrigation." 
              : "⚠️ कम बारिश की संभावना — फसल खराब होने का उच्च जोखिम। सिंचाई पर विचार करें।"}
          </span>
        </>
      ) : (
        <>
          <CloudRain className="w-4 h-4 shrink-0" />
          <span>
            {lang === "en"
              ? "🌧 Heavy rainfall expected — Risk of waterlogging. Ensure proper drainage."
              : "🌧 भारी बारिश की संभावना — जलभराव का जोखिम। उचित जल निकासी सुनिश्चित करें।"}
          </span>
        </>
      )}
    </div>
  );
};

export default WeatherBanner;
