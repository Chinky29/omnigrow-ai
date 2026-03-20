import { AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { Language, translations } from "@/lib/translations";

interface RiskAnalysisProps {
  risk: number;
  lang: Language;
}

const RiskAnalysis = ({ risk, lang }: RiskAnalysisProps) => {
  const t = translations[lang];

  const getRiskStatus = () => {
    if (risk >= 70) return { label: t.highRisk, color: "text-neon-red", bg: "bg-neon-red/10", border: "border-neon-red/20", icon: <AlertTriangle className="w-5 h-5" /> };
    if (risk >= 40) return { label: t.mediumRisk, color: "text-neon-yellow", bg: "bg-neon-yellow/10", border: "border-neon-yellow/20", icon: <Info className="w-5 h-5" /> };
    return { label: t.lowRisk, color: "text-neon-green", bg: "bg-neon-green/10", border: "border-neon-green/20", icon: <CheckCircle2 className="w-5 h-5" /> };
  };

  const status = getRiskStatus();

  const getAlerts = () => {
    const alerts = [];
    if (risk >= 70) {
      alerts.push(lang === "en" ? "Immediate crop insurance (PMFBY) is highly recommended." : "तत्काल फसल बीमा (पीएमएफबीवाई) की अत्यधिक सिफारिश की जाती है।");
      alerts.push(lang === "en" ? "Extreme weather conditions detected. Monitor water levels daily." : "चरम मौसम की स्थिति का पता चला। प्रतिदिन जल स्तर की निगरानी करें।");
    } else if (risk >= 40) {
      alerts.push(lang === "en" ? "Moderate pests risk. Consider preventive organic pesticides." : "मध्यम कीट जोखिम। निवारक जैविक कीटनाशकों पर विचार करें।");
      alerts.push(lang === "en" ? "Fluctuating temperature may impact grain filling." : "तापमान में उतार-चढ़ाव अनाज भरने को प्रभावित कर सकता है।");
    } else {
      alerts.push(lang === "en" ? "Ideal conditions for current growth stage." : "वर्तमान विकास चरण के लिए आदर्श स्थिति।");
    }
    return alerts;
  };

  const alerts = getAlerts();

  return (
    <div className={`glass-card p-6 animate-slide-up border ${status.border} ${status.bg}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold tracking-tight text-foreground uppercase flex items-center gap-2">
          {status.icon}
          {t.riskAnalysis}
        </h3>
        <span className={`text-xs font-black uppercase px-2 py-1 rounded-md border ${status.border} ${status.color}`}>
          {status.label}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{t.overallRisk}</span>
          <span className={`text-lg font-black font-mono ${status.color}`}>{risk}%</span>
        </div>
        
        <div className="w-full bg-muted/30 h-2 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${status.color.replace('text-', 'bg-')}`} 
            style={{ width: `${risk}%` }} 
          />
        </div>

        <div className="pt-4 border-t border-border/50">
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3">{t.alerts}</h4>
          <div className="space-y-2">
            {alerts.length > 0 ? (
              alerts.map((alert, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-foreground/80 bg-background/40 p-2 rounded-lg border border-border/30">
                  <div className={`w-1 h-1 rounded-full mt-1.5 shrink-0 ${status.color.replace('text-', 'bg-')}`} />
                  {alert}
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground italic">{t.noAlerts}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAnalysis;
