import { Zap, Activity, Info, TrendingUp, CheckCircle2, Lightbulb, Target, ShieldCheck, ArrowRight } from "lucide-react";
import { Language, translations } from "@/lib/translations";
import AnalysisChart from "./AnalysisChart";

interface InsightsPanelProps {
  factors: { label: string; impact: number }[];
  actions: string[];
  breakeven: string;
  profit: number;
  lang: Language;
}

const InsightsPanel = ({ factors, actions, breakeven, profit, lang }: InsightsPanelProps) => {
  const t = translations[lang];

  return (
    <div className="flex flex-col gap-8 w-full animate-slide-up">
      {/* AI Insights Section Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg">
          <Activity className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-black uppercase tracking-[0.2em] text-foreground">AI Insights</h2>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5 opacity-60">Advanced Predictive Analytics</p>
        </div>
      </div>

      {/* Charts Grid */}
      <AnalysisChart data={factors} profit={profit} />

      {/* Actionable Recommendations Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recommended Actions */}
        <div className="glass-card p-6 border-primary/10 group hover:bg-white/5 transition-all">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">{t.actionsTitle}</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {actions.map((action, i) => (
              <div 
                key={i} 
                className="group/item flex items-center gap-4 p-4 rounded-xl bg-white/2 border border-white/5 hover:bg-primary/5 hover:border-primary/20 transition-all cursor-default"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10 group-hover/item:bg-primary/20 transition-colors">
                  <ArrowRight className="w-4 h-4 text-primary group-hover/item:translate-x-1 transition-transform" />
                </div>
                <p className="text-[11px] sm:text-xs font-bold text-foreground/80 group-hover/item:text-foreground transition-colors leading-relaxed">
                  {action}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Break-even & Strategy */}
        <div className="glass-card p-6 border-secondary/10 group hover:bg-white/5 transition-all">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5 text-secondary" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">{t.breakevenTitle}</h3>
          </div>
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-secondary/5 border border-secondary/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-secondary/20 transition-colors" />
              <p className="text-sm sm:text-base font-black text-foreground leading-relaxed relative z-10 italic">
                "{breakeven}"
              </p>
            </div>
            
            <div className="space-y-4">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-60">AI Strategy Note</p>
              <div className="p-4 rounded-xl bg-white/2 border border-white/5 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
                  <p className="text-[11px] text-foreground/70 font-bold uppercase tracking-widest">Confidence Score: 94%</p>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                  Our predictive engine suggests maintaining current investment levels while optimizing for water efficiency based on the 30-day regional forecast.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;
