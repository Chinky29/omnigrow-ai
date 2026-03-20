import { Landmark } from "lucide-react";

interface GovernmentSchemesProps {
  crop: string;
  investment: number;
}

const schemes = [
  { name: "PM-KISAN", desc: "₹6,000/year direct income support for small farmers", minInvestment: 0, crops: ["Wheat", "Rice", "Corn"] },
  { name: "PMFBY", desc: "Crop insurance at low premium for natural calamities", minInvestment: 0, crops: ["Wheat", "Rice", "Corn", "Cotton", "Sugarcane", "Soybean"] },
  { name: "KCC", desc: "Kisan Credit Card — low-interest loans up to ₹3 lakh", minInvestment: 20000, crops: ["Wheat", "Rice", "Corn", "Cotton", "Sugarcane", "Soybean"] },
  { name: "RKVY", desc: "State-level funding for crop diversification", minInvestment: 50000, crops: ["Sugarcane", "Cotton", "Soybean"] },
];

const GovernmentSchemes = ({ crop, investment }: GovernmentSchemesProps) => {
  const applicable = schemes.filter(
    (s) => s.crops.includes(crop) && investment >= s.minInvestment
  );

  if (applicable.length === 0) return null;

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md bg-neon-yellow/10 flex items-center justify-center">
          <Landmark className="w-3.5 h-3.5 text-neon-yellow" />
        </div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Government Schemes
        </h3>
      </div>
      <div className="space-y-2">
        {applicable.slice(0, 3).map((s) => (
          <div key={s.name} className="p-2.5 rounded-lg bg-muted/30 border border-border/30">
            <p className="text-xs font-semibold text-foreground">{s.name}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GovernmentSchemes;
