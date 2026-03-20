import { Zap, Activity, Info, TrendingUp, CheckCircle2, Lightbulb } from "lucide-react";
import { Language, translations } from "@/lib/translations";
import AnalysisChart from "./AnalysisChart";

interface InsightsPanelProps {
  factors: { label: string; impact: number }[];
  actions: string[];
  breakeven: string;
  lang: Language;
}

const InsightsPanel = ({ factors, actions, breakeven, lang }: InsightsPanelProps) => {
  const t = translations[lang];

  return (
    <div className="flex flex-col gap-5 h-full animate-slide-in-right">
      {/* Analysis Factors & Graph */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t.insightsTitle}</h3>
        </div>
        
        {/* Visual Graph */}
        <AnalysisChart factors={factors} lang={lang} />

        <div className="space-y-3 mt-6 border-t border-border/30 pt-4">
          {factors.map((f, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[10px] uppercase tracking-tighter">
                <span className="text-foreground/60">{f.label}</span>
                <span className={`font-mono font-black ${f.impact >= 0 ? "text-neon-green" : "text-neon-red"}`}>
                  {f.impact >= 0 ? "+" : ""}{f.impact}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
          </div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.actionsTitle}</h3>
        </div>
        <ul className="space-y-2">
          {actions.map((a, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              {a}
            </li>
          ))}
        </ul>
      </div>

      {/* Breakeven */}
      <div className="glass-card p-4 gradient-border">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-md bg-neon-purple/10 flex items-center justify-center">
            <Lightbulb className="w-3.5 h-3.5 text-neon-purple" />
          </div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.breakevenTitle}</h3>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed">{breakeven}</p>
      </div>
    </div>
  );
};

export default InsightsPanel;
