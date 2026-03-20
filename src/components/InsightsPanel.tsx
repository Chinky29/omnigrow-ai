import { Brain, CheckCircle2, Lightbulb, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Factor {
  label: string;
  impact: number; // e.g., -20, +15
}

interface InsightsPanelProps {
  factors: Factor[];
  actions: string[];
  breakeven: string;
}

const InsightsPanel = ({ factors, actions, breakeven }: InsightsPanelProps) => {
  const getImpactIcon = (impact: number) => {
    if (impact > 0) return <TrendingUp className="w-3 h-3 text-neon-green" />;
    if (impact < 0) return <TrendingDown className="w-3 h-3 text-neon-red" />;
    return <Minus className="w-3 h-3 text-muted-foreground" />;
  };

  const getImpactColor = (impact: number) => {
    if (impact > 0) return "text-neon-green";
    if (impact < 0) return "text-neon-red";
    return "text-muted-foreground";
  };

  return (
    <div className="flex flex-col gap-4 h-full animate-slide-in-right">
      {/* Reasoning */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-md bg-neon-blue/10 flex items-center justify-center">
            <Brain className="w-3.5 h-3.5 text-neon-blue" />
          </div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">AI Reasoning</h3>
        </div>
        <div className="space-y-2">
          {factors.map((f, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
              <span className="text-sm text-foreground/80">{f.label}</span>
              <div className="flex items-center gap-1.5">
                {getImpactIcon(f.impact)}
                <span className={`text-xs font-mono font-medium ${getImpactColor(f.impact)}`}>
                  {f.impact > 0 ? "+" : ""}{f.impact}%
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
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recommended Actions</h3>
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
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Break-even Insight</h3>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed">{breakeven}</p>
      </div>
    </div>
  );
};

export default InsightsPanel;
