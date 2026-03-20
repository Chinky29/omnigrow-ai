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
    <div className="glass-card p-6 h-full flex flex-col gap-6 animate-slide-in-left relative overflow-hidden group">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Tooltip for first-time users */}
      {!isSimulating && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 animate-bounce shadow-lg backdrop-blur-md">
          <Zap className="w-3 h-3 text-primary fill-primary" />
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">{t.startHere}</span>
        </div>
      )}

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
            <Wheat className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-black text-foreground uppercase tracking-wider">{t.enterFarmData}</h2>
            <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest mt-0.5 opacity-70">Simulation Parameters</p>
          </div>
        </div>
        
        {/* AI Status Indicator */}
        <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border transition-all duration-500 backdrop-blur-md ${
          isAIEnabled 
            ? "bg-primary/10 border-primary/30 text-primary shadow-[0_0_15px_rgba(var(--neon-green),0.1)]" 
            : "bg-muted/50 border-border text-muted-foreground opacity-60"
        }`}>
          {isAIEnabled ? (
            <>
              <Sparkles className="w-3 h-3 animate-pulse" />
              AI ACTIVE
            </>
          ) : (
            <>
              <AlertCircle className="w-3 h-3" />
              OFFLINE
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-5 flex-1 relative z-10">
        {/* Crop */}
        <div className="space-y-2.5">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2 opacity-80">
            <Wheat className="w-3.5 h-3.5 text-primary" /> {t.crop}
          </label>
          <div className="relative group/select">
            <select
              value={data.crop}
              onChange={(e) => update("crop", e.target.value)}
              className="w-full bg-white/5 dark:bg-black/20 border border-white/10 dark:border-white/5 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all appearance-none cursor-pointer hover:bg-white/10 dark:hover:bg-black/40 font-medium"
            >
              {crops.map((c) => (
                <option key={c.value} value={c.value} className="bg-background text-foreground py-2">{c.label}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-hover/select:text-primary transition-colors">
              <Layers className="w-4 h-4" />
            </div>
          </div>
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
        className="btn-primary w-full py-4 text-sm uppercase tracking-[0.2em] group/btn flex items-center justify-center gap-3"
      >
        {isSimulating ? (
          <>
            <Zap className="w-4 h-4 animate-spin text-white" />
            {t.simulating}
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform text-white fill-white/20" />
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
