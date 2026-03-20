import RiskGauge from "./RiskGauge";
import { TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { Language, translations } from "@/lib/translations";

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

  return (
    <div className="flex flex-col gap-5 h-full animate-slide-up">
      {/* Simulating overlay */}
      {isSimulating && (
        <div className="glass-card p-8 flex flex-col items-center justify-center gap-4 h-full">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-primary/40 animate-pulse" />
            <div className="absolute inset-4 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary animate-pulse-neon" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground font-medium">{t.simulating}</p>
          <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full shimmer" style={{ width: "70%" }} />
          </div>
        </div>
      )}

      {!isSimulating && (
        <>
          {/* Risk Gauge */}
          <div className="glass-card p-6 flex items-center justify-center">
            <RiskGauge value={risk} label={t.overallRisk} />
          </div>

          {/* Profit/Loss */}
          <div className={`glass-card p-5 transition-all duration-500 ${isProfit ? "neon-glow-green" : "neon-glow-red"}`}>
            <div className="flex items-center gap-2 mb-2">
              {isProfit ? (
                <TrendingUp className="w-4 h-4 text-neon-green" />
              ) : (
                <TrendingDown className="w-4 h-4 text-neon-red" />
              )}
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                {isProfit ? t.expectedProfit : t.expectedLoss}
              </span>
            </div>
            <p className={`text-3xl font-bold font-mono ${isProfit ? "neon-text-green" : "text-neon-red"}`}>
              {isProfit ? "+" : ""}₹{Math.abs(profit).toLocaleString("en-IN")}
            </p>
          </div>

          {/* Future Outcome */}
          <div className="glass-card p-5 neon-glow-purple">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-neon-purple" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{t.futureOutcome}</span>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">{outcome}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default CenterPanel;
