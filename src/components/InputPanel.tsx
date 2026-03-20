import { Wheat, Droplets, Layers, IndianRupee, Thermometer, Zap, Sparkles, AlertCircle, CloudRain, Sun, Wallet } from "lucide-react";
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
    <div className="glass-card p-6 h-full flex flex-col gap-8 animate-slide-in-left relative overflow-hidden group border-white/10">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-black text-foreground uppercase tracking-[0.2em]">{t.enterFarmData}</h2>
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5 opacity-60">Simulator v2.0</p>
          </div>
        </div>
        
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border transition-all duration-500 backdrop-blur-md ${
          isAIEnabled ? "bg-primary/10 border-primary/30 text-primary" : "bg-muted/50 border-border text-muted-foreground opacity-60"
        }`}>
          <Sparkles className={`w-3 h-3 ${isAIEnabled ? "animate-pulse" : ""}`} />
          {isAIEnabled ? "AI ACTIVE" : "OFFLINE"}
        </div>
      </div>

      <div className="space-y-8 flex-1 relative z-10 overflow-y-auto custom-scrollbar pr-2">
        {/* Group 1: Crop & Soil */}
        <div className="space-y-5">
          <h3 className="section-title">{lang === "en" ? "Core Selection" : "मुख्य चयन"}</h3>
          
          <div className="space-y-2.5">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2 opacity-80">
              <Wheat className="w-3.5 h-3.5 text-primary" /> {t.crop}
            </label>
            <select
              value={data.crop}
              onChange={(e) => update("crop", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all appearance-none cursor-pointer hover:bg-white/10 font-medium"
            >
              {crops.map((c) => (
                <option key={c.value} value={c.value} className="bg-[#020617] text-slate-200">{c.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2.5">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2 opacity-80">
              <Layers className="w-3.5 h-3.5 text-primary" /> {t.soilType}
            </label>
            <select
              value={data.soilType}
              onChange={(e) => update("soilType", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all appearance-none cursor-pointer hover:bg-white/10 font-medium"
            >
              {soilTypes.map((s) => (
                <option key={s.value} value={s.value} className="bg-[#020617] text-slate-200">{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Group 2: Environment Sliders */}
        <div className="space-y-5">
          <h3 className="section-title">{lang === "en" ? "Environment" : "पर्यावरण"}</h3>
          
          <div className="space-y-4 p-4 rounded-2xl bg-white/2 border border-white/5">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2 opacity-80">
                  <CloudRain className="w-3.5 h-3.5 text-secondary" /> {t.rainfall}
                </label>
                <span className="text-xs font-black text-secondary">{data.rainfall}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={data.rainfall}
                onChange={(e) => update("rainfall", parseInt(e.target.value))}
                className="accent-secondary"
              />
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2 opacity-80">
                  <Sun className="w-3.5 h-3.5 text-yellow-500" /> {t.temperature}
                </label>
                <span className="text-xs font-black text-yellow-500">{data.temperature}°C</span>
              </div>
              <input
                type="range"
                min="10"
                max="45"
                value={data.temperature}
                onChange={(e) => update("temperature", parseInt(e.target.value))}
                className="accent-yellow-500"
              />
            </div>
          </div>
        </div>

        {/* Group 3: Finance */}
        <div className="space-y-5">
          <h3 className="section-title">{lang === "en" ? "Finance" : "वित्त"}</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2 opacity-80">
                <Wallet className="w-3.5 h-3.5 text-emerald-500" /> {t.investment}
              </label>
              <span className="text-xs font-black text-emerald-500">₹{data.investment.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="100000"
              step="1000"
              value={data.investment}
              onChange={(e) => update("investment", parseInt(e.target.value))}
              className="accent-emerald-500"
            />
          </div>
        </div>
      </div>

      <button
        onClick={onSimulate}
        disabled={isSimulating}
        className="btn-primary w-full group/btn relative flex items-center justify-center gap-4 mt-2 shadow-2xl"
      >
        {isSimulating ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>AI IS ANALYZING...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-500 fill-white/20" />
            <span>{t.simulateButton}</span>
          </>
        )}
      </button>
    </div>
  );
};

export default InputPanel;
