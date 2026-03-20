import { CloudSun, Wind, Droplets, ThermometerSun } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import WeatherForecast from "@/components/WeatherForecast";

const Weather = () => {
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden pt-16 sm:pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-10 space-y-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 neon-glow-green">
              <CloudSun className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">
              {t.weather}
            </h1>
          </div>
          <p className="text-muted-foreground mt-2">
            {lang === "en" ? "Real-time weather monitoring and 5-day forecasting for your farm." : "आपके खेत के लिए रीयल-टाइम मौसम निगरानी और 5-दिनीय पूर्वानुमान।"}
          </p>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 flex flex-col items-center gap-2">
            <ThermometerSun className="w-5 h-5 text-neon-yellow" />
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{t.temp}</span>
            <span className="text-xl font-black font-mono">32°C</span>
          </div>
          <div className="glass-card p-4 flex flex-col items-center gap-2">
            <Droplets className="w-5 h-5 text-neon-blue" />
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{t.humidity}</span>
            <span className="text-xl font-black font-mono">45%</span>
          </div>
          <div className="glass-card p-4 flex flex-col items-center gap-2">
            <Wind className="w-5 h-5 text-primary" />
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{t.wind}</span>
            <span className="text-xl font-black font-mono">12 km/h</span>
          </div>
          <div className="glass-card p-4 flex flex-col items-center gap-2">
            <CloudSun className="w-5 h-5 text-neon-purple" />
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{lang === "en" ? "Condition" : "स्थिति"}</span>
            <span className="text-lg font-black uppercase tracking-tight">{lang === "en" ? "Clear Sky" : "साफ आसमान"}</span>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div className="space-y-4">
          <h2 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] px-1">
            {t.weatherForecast}
          </h2>
          <WeatherForecast lang={lang} />
        </div>

        <div className="glass-card p-6 border-dashed border-2 bg-muted/5 text-center">
          <p className="text-sm text-muted-foreground italic">
            {lang === "en" 
              ? "Historical weather data and soil moisture trends coming soon." 
              : "ऐतिहासिक मौसम डेटा और मिट्टी की नमी का रुझान जल्द ही आ रहा है।"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Weather;
