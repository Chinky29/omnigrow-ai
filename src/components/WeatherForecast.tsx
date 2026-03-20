import { Cloud, CloudRain, Sun, Thermometer, Wind, Droplets } from "lucide-react";
import { Language, translations } from "@/lib/translations";

interface WeatherDay {
  day: string;
  temp: number;
  condition: "Sunny" | "Cloudy" | "Rainy";
  humidity: number;
  windSpeed: number;
}

const WeatherIcon = ({ condition }: { condition: string }) => {
  switch (condition) {
    case "Sunny":
      return <Sun className="w-6 h-6 text-yellow-400" />;
    case "Cloudy":
      return <Cloud className="w-6 h-6 text-blue-300" />;
    case "Rainy":
      return <CloudRain className="w-6 h-6 text-blue-500" />;
    default:
      return <Sun className="w-6 h-6 text-yellow-400" />;
  }
};

const WeatherForecast = ({ lang }: { lang: Language }) => {
  const t = translations[lang];

  const forecastData: WeatherDay[] = [
    { day: t.mon, temp: 32, condition: "Sunny", humidity: 45, windSpeed: 12 },
    { day: t.tue, temp: 30, condition: "Cloudy", humidity: 55, windSpeed: 10 },
    { day: t.wed, temp: 28, condition: "Rainy", humidity: 80, windSpeed: 15 },
    { day: t.thu, temp: 29, condition: "Cloudy", humidity: 65, windSpeed: 8 },
    { day: t.fri, temp: 31, condition: "Sunny", humidity: 50, windSpeed: 11 },
  ];

  return (
    <div className="glass-card p-6 animate-slide-up h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold tracking-tight text-foreground uppercase flex items-center gap-2">
          <Cloud className="w-4 h-4 text-primary" />
          {t.weatherForecast}
        </h3>
        <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Thermometer className="w-3 h-3" />
            <span>{t.temp}</span>
          </div>
          <div className="flex items-center gap-1">
            <Droplets className="w-3 h-3" />
            <span>{t.humidity}</span>
          </div>
          <div className="flex items-center gap-1">
            <Wind className="w-3 h-3" />
            <span>{t.wind}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
        {forecastData.map((day, idx) => (
          <div
            key={day.day}
            className={`flex flex-col items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-muted/20 border border-border/50 hover:bg-muted/30 transition-all duration-300 group ${
              idx === 4 ? "col-span-2 sm:col-span-1" : ""
            }`}
          >
            <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase">{day.day}</span>
            <div className="transform group-hover:scale-110 transition-transform duration-300">
              <WeatherIcon condition={day.condition} />
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-base sm:text-lg font-bold font-mono text-foreground leading-none">
                {day.temp}°C
              </span>
              <div className="flex flex-col items-center gap-0.5 text-[9px] sm:text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Droplets className="w-2.5 h-2.5" />
                  {day.humidity}%
                </span>
                <span className="flex items-center gap-1">
                  <Wind className="w-2.5 h-2.5" />
                  {day.windSpeed} km/h
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecast;
