import { Wheat, Droplets, Layers, IndianRupee, Thermometer, Zap, Sparkles, AlertCircle } from "lucide-react";
import { Language, translations } from "@/lib/translations";
import { isAIEnabled } from "@/lib/openai";

interface FarmData {
  crop: string;
  rainfall: number;
  soilType: string;
  investment: number;
  temperature: number;
}

interface InputPanelProps {
  data: FarmData;
  onChange: (data: FarmData) => void;
  onSimulate: () => void;
  isSimulating: boolean;
  lang: Language;
}

const InputPanel = ({ data, onChange, onSimulate, isSimulating, lang }: InputPanelProps) => {
  const t = translations[lang];
  
  const crops = [
    { value: "Wheat", label: t.wheat },
    { value: "Rice", label: t.rice },
    { value: "Corn", label: t.corn },
    { value: "Sugarcane", label: t.sugarcane },
    { value: "Cotton", label: t.cotton },
    { value: "Soybean", label: t.soybean },
  ];

  const soilTypes = [
    { value: "Alluvial", label: t.alluvial },
    { value: "Black Cotton", label: t.blackCotton },
    { value: "Red Laterite", label: t.redLaterite },
    { value: "Sandy Loam", label: t.sandyLoam },
    { value: "Clay", label: t.clay },
  ];

  const update = (key: keyof FarmData, value: string | number) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="glass-card p-5 h-full flex flex-col gap-5 animate-slide-in-left relative overflow-hidden">
      {/* Tooltip for first-time users */}
      {!isSimulating && (
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 border border-primary/30 animate-bounce">
          <Zap className="w-2.5 h-2.5 text-primary" />
          <span className="text-[10px] font-bold text-primary uppercase">{t.startHere}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Wheat className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-base font-semibold text-foreground">{t.enterFarmData}</h2>
        </div>
        
        {/* AI Status Indicator */}
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-all duration-500 ${
          isAIEnabled 
            ? "bg-primary/10 border-primary/30 text-primary shadow-[0_0_10px_rgba(var(--neon-green),0.1)]" 
            : "bg-muted/50 border-border text-muted-foreground"
        }`}>
          {isAIEnabled ? (
            <>
              <Sparkles className="w-2.5 h-2.5" />
              AI ON
            </>
          ) : (
            <>
              <AlertCircle className="w-2.5 h-2.5" />
              AI OFF
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        {/* Crop */}
        <div className="space-y-2">
          <label className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Wheat className="w-3 h-3" /> {t.crop}
          </label>
          <select
            value={data.crop}
            onChange={(e) => update("crop", e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 sm:py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
          >
            {crops.map((c) => (
              <option key={c.value} value={c.value} className="bg-card">{c.label}</option>
            ))}
          </select>
        </div>

        {/* Rainfall */}
        <div className="space-y-3">
          <label className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Droplets className="w-3 h-3" /> {t.rainfall}
          </label>
          <div className="pt-2 pb-1">
            <input
              type="range" min={0} max={100} value={data.rainfall}
              onChange={(e) => update("rainfall", +e.target.value)}
              className="w-full accent-primary appearance-none cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{lang === "en" ? "Low" : "कम"}</span>
            <span className="font-mono font-bold text-primary">{data.rainfall}%</span>
            <span>{lang === "en" ? "High" : "अधिक"}</span>
          </div>
        </div>

        {/* Soil Type */}
        <div className="space-y-2">
          <label className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3 h-3" /> {t.soilType}
          </label>
          <select
            value={data.soilType}
            onChange={(e) => update("soilType", e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 sm:py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
          >
            {soilTypes.map((s) => (
              <option key={s.value} value={s.value} className="bg-card">{s.label}</option>
            ))}
          </select>
        </div>

        {/* Investment */}
        <div className="space-y-2">
          <label className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <IndianRupee className="w-3 h-3" /> {t.investment}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
            <input
              type="number" value={data.investment}
              onChange={(e) => update("investment", +e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-lg pl-8 pr-3 py-2.5 sm:py-2 text-sm text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        {/* Temperature */}
        <div className="space-y-3">
          <label className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Thermometer className="w-3 h-3" /> {t.temperature}
          </label>
          <div className="pt-2 pb-1">
            <input
              type="range" min={10} max={50} value={data.temperature}
              onChange={(e) => update("temperature", +e.target.value)}
              className="w-full accent-secondary appearance-none cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>10°C</span>
            <span className="font-mono font-bold text-secondary">{data.temperature}°C</span>
            <span>50°C</span>
          </div>
        </div>
      </div>

      <button
        onClick={onSimulate}
        disabled={isSimulating}
        className="w-full py-3.5 sm:py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--neon-green)/0.3)] active:scale-[0.97] disabled:opacity-60"
      >
        {isSimulating ? (
          <>
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            {t.simulating}
          </>
        ) : (
          <>
            {isAIEnabled ? <Sparkles className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
            {t.simulateButton}
          </>
        )}
      </button>
      
      {!isAIEnabled && (
        <p className="text-[10px] text-muted-foreground text-center mt-2 italic">
          {lang === "en" 
            ? "Note: Using local simulation engine. Add OpenAI API key to enable Advanced AI." 
            : "नोट: स्थानीय सिमुलेशन इंजन का उपयोग कर रहे हैं। उन्नत AI सक्षम करने के लिए OpenAI API कुंजी जोड़ें।"}
        </p>
      )}
    </div>
  );
};

export default InputPanel;
