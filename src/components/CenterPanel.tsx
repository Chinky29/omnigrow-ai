import RiskGauge from "./RiskGauge";
import { TrendingUp, TrendingDown, Sparkles, Bell, Zap } from "lucide-react";
import { Language, translations } from "@/lib/translations";
import { useNotifications } from "@/contexts/NotificationContext";
import { useEffect, useRef } from "react";

interface CenterPanelProps {
  risk: number;
  profit: number;
  outcome: string;
  isSimulating: boolean;
  lang: Language;
}

const CenterPanel = ({ risk, profit, outcome, isSimulating, lang }: CenterPanelProps) => {
  const isProfit = profit >= 0;
  const t = translations[lang];
  // Notification triggering moved directly to explicit simulation handler to prevent slider spam

  return (
    <div className="flex flex-col gap-8 h-full animate-slide-up relative">
      {/* Simulating overlay */}
      {isSimulating && (
        <div className="glass-card p-12 flex flex-col items-center justify-center gap-6 h-full absolute inset-0 z-50 bg-black/40 border-primary/20 backdrop-blur-3xl shadow-2xl">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
            <div className="absolute inset-4 rounded-full border-4 border-primary/40 animate-pulse" />
            <div className="absolute inset-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm font-black text-primary uppercase tracking-[0.4em] animate-pulse">
              AI IS ANALYZING...
            </p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest opacity-60">
              Processing satellite & weather data
            </p>
          </div>
        </div>
      )}

      {/* Decision Intelligence Panel - 4 Block Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Block 1: Risk Analysis */}
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center group hover:bg-white/5 transition-all">
          <div className="w-full flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <Bell className="w-4 h-4 text-red-500" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Risk Status</span>
            </div>
            <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
              risk < 30 ? "bg-primary/10 border-primary/20 text-primary" : 
              risk < 60 ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500" : 
              "bg-red-500/10 border-red-500/20 text-red-500"
            }`}>
              {risk < 30 ? "Stable" : risk < 60 ? "Moderate" : "Critical"}
            </div>
          </div>
          <RiskGauge value={risk} label={t.overallRisk} />
        </div>

        {/* Block 2: Future Outcome */}
        <div className="glass-card p-6 flex flex-col group hover:bg-white/5 transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t.futureOutcome}</span>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-lg sm:text-xl font-black text-foreground leading-tight tracking-tight text-glow">
              {outcome}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1 opacity-60">
                  Predicted Profit
                </p>
                <p className={`text-2xl font-black tracking-tighter ${isProfit ? "text-primary" : "text-destructive"}`}>
                  {isProfit ? "+" : "-"}₹{Math.abs(profit).toLocaleString("en-IN")}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                isProfit ? "bg-primary/10 border-primary/20" : "bg-destructive/10 border-destructive/20"
              }`}>
                {isProfit ? <TrendingUp className="w-6 h-6 text-primary" /> : <TrendingDown className="w-6 h-6 text-destructive" />}
              </div>
            </div>
          </div>
        </div>

        {/* Block 3: Reasoning (WHY Factors) */}
        <div className="glass-card p-6 flex flex-col group hover:bg-white/5 transition-all">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">AI Reasoning</span>
          </div>
          <div className="space-y-4">
            {translations[lang].mon === "सोम" ? (
              // Simple check for Hindi if factors aren't available yet
              <p className="text-sm text-muted-foreground italic opacity-60">विश्लेषण किया जा रहा है...</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-white/2 border border-white/5 space-y-1">
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-50">Dominant Factor</p>
                  <p className="text-xs font-black text-foreground">Weather Stability</p>
                </div>
                <div className="p-3 rounded-xl bg-white/2 border border-white/5 space-y-1">
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-50">Impact Ratio</p>
                  <p className="text-xs font-black text-primary">High Correlation</p>
                </div>
              </div>
            )}
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Our AI models have identified that local environmental stability is the primary driver for this yield prediction.
            </p>
          </div>
        </div>

        {/* Block 4: Recommended Action */}
        <div className="glass-card p-6 flex flex-col group hover:bg-white/5 transition-all bg-primary/5 border-primary/10">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(var(--neon-green),0.2)]">
              <Zap className="w-4 h-4 text-primary fill-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">{lang === "en" ? "Top Recommendation" : "शीर्ष सिफारिश"}</span>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/20 rounded-full blur-2xl -mr-8 -mt-8" />
              <p className="text-sm sm:text-base font-black text-foreground leading-snug relative z-10">
                {risk > 50 
                  ? (lang === "en" ? "Diversify crops and secure PMFBY insurance immediately." : "फसलों में विविधता लाएं और तुरंत PMFBY बीमा सुरक्षित करें।")
                  : (lang === "en" ? "Maintain current soil moisture and consider secondary fertilization." : "वर्तमान मिट्टी की नमी बनाए रखें और माध्यमिक निषेचन पर विचार करें।")}
              </p>
            </div>
            <button className="w-full py-2.5 rounded-xl border border-primary/30 text-[9px] font-black uppercase tracking-[0.3em] text-primary hover:bg-primary/10 transition-all flex items-center justify-center gap-2">
              LEARN MORE <Bell className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenterPanel;
