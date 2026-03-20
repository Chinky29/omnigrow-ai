import { Crown } from "lucide-react";

interface CropData {
  name: string;
  profit: number;
  risk: number;
}

interface CropComparisonProps {
  crops: CropData[];
}

const CropComparison = ({ crops }: CropComparisonProps) => {
  const best = crops.reduce((a, b) => (a.profit - a.risk > b.profit - b.risk ? a : b));

  const getRiskColor = (r: number) => {
    if (r < 35) return "text-neon-green";
    if (r < 65) return "text-neon-yellow";
    return "text-neon-red";
  };

  return (
    <div className="glass-card p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Multi-Crop Comparison
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {crops.map((crop) => {
          const isBest = crop.name === best.name;
          return (
            <div
              key={crop.name}
              className={`rounded-xl p-4 border transition-all duration-300 ${
                isBest
                  ? "border-primary/50 bg-primary/5 neon-glow-green"
                  : "border-border/50 bg-muted/20"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-foreground">{crop.name}</span>
                {isBest && <Crown className="w-3.5 h-3.5 text-neon-yellow" />}
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Profit</span>
                  <span className={`font-mono font-medium ${crop.profit >= 0 ? "text-neon-green" : "text-neon-red"}`}>
                    ₹{crop.profit.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Risk</span>
                  <span className={`font-mono font-medium ${getRiskColor(crop.risk)}`}>
                    {crop.risk}%
                  </span>
                </div>
              </div>
              {isBest && (
                <div className="mt-2 text-[10px] uppercase tracking-wider text-primary font-semibold">
                  ★ Best Choice
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CropComparison;
