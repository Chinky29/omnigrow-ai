import { Wheat, Droplets, Layers, IndianRupee, Thermometer, Zap } from "lucide-react";

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
}

const crops = ["Wheat", "Rice", "Corn", "Sugarcane", "Cotton", "Soybean"];
const soilTypes = ["Alluvial", "Black Cotton", "Red Laterite", "Sandy Loam", "Clay"];

const InputPanel = ({ data, onChange, onSimulate, isSimulating }: InputPanelProps) => {
  const update = (key: keyof FarmData, value: string | number) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="glass-card p-5 h-full flex flex-col gap-5 animate-slide-in-left">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Wheat className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-base font-semibold text-foreground">Enter Farm Data</h2>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        {/* Crop */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Wheat className="w-3 h-3" /> Crop
          </label>
          <select
            value={data.crop}
            onChange={(e) => update("crop", e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          >
            {crops.map((c) => (
              <option key={c} value={c} className="bg-card">{c}</option>
            ))}
          </select>
        </div>

        {/* Rainfall */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Droplets className="w-3 h-3" /> Rainfall
          </label>
          <input
            type="range" min={0} max={100} value={data.rainfall}
            onChange={(e) => update("rainfall", +e.target.value)}
            className="w-full accent-primary h-1.5 rounded-full appearance-none bg-muted cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Low</span>
            <span className="font-mono text-primary">{data.rainfall}%</span>
            <span>High</span>
          </div>
        </div>

        {/* Soil Type */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3 h-3" /> Soil Type
          </label>
          <select
            value={data.soilType}
            onChange={(e) => update("soilType", e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          >
            {soilTypes.map((s) => (
              <option key={s} value={s} className="bg-card">{s}</option>
            ))}
          </select>
        </div>

        {/* Investment */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <IndianRupee className="w-3 h-3" /> Investment
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
            <input
              type="number" value={data.investment}
              onChange={(e) => update("investment", +e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-lg pl-7 pr-3 py-2 text-sm text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        {/* Temperature */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Thermometer className="w-3 h-3" /> Temperature
          </label>
          <input
            type="range" min={10} max={50} value={data.temperature}
            onChange={(e) => update("temperature", +e.target.value)}
            className="w-full accent-secondary h-1.5 rounded-full appearance-none bg-muted cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>10°C</span>
            <span className="font-mono text-secondary">{data.temperature}°C</span>
            <span>50°C</span>
          </div>
        </div>
      </div>

      <button
        onClick={onSimulate}
        disabled={isSimulating}
        className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--neon-green)/0.3)] active:scale-[0.97] disabled:opacity-60"
      >
        {isSimulating ? (
          <>
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            AI Simulating…
          </>
        ) : (
          <>
            <Zap className="w-4 h-4" />
            Simulate Future
          </>
        )}
      </button>
    </div>
  );
};

export default InputPanel;
