import { AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { Language, translations } from "@/lib/translations";

interface FarmData {
  crop: string;
  rainfall: number;
  temperature: number;
  investment: number;
  soilType: string;
}

interface RiskAnalysisProps {
  risk: number;
  farmData: FarmData;
  lang: Language;
}

const RiskAnalysis = ({ risk, farmData, lang }: RiskAnalysisProps) => {
  const t = translations[lang];

  const getRiskStatus = () => {
    if (risk >= 70) return { label: t.highRisk, color: "text-neon-red", bg: "bg-neon-red/10", border: "border-neon-red/20", icon: <AlertTriangle className="w-5 h-5" /> };
    if (risk >= 40) return { label: t.mediumRisk, color: "text-neon-yellow", bg: "bg-neon-yellow/10", border: "border-neon-yellow/20", icon: <Info className="w-5 h-5" /> };
    return { label: t.lowRisk, color: "text-neon-green", bg: "bg-neon-green/10", border: "border-neon-green/20", icon: <CheckCircle2 className="w-5 h-5" /> };
  };

  const status = getRiskStatus();

  const getAlerts = () => {
    const alerts = [];
    
    if (farmData.rainfall < 30) {
      alerts.push(lang === "en" ? `Critical drought risk for ${farmData.crop}. Irrigation is urgently needed.` : `${farmData.crop} के लिए गंभीर सूखे का जोखिम। सिंचाई की तत्काल आवश्यकता है।`);
    } else if (farmData.rainfall > 80) {
      alerts.push(lang === "en" ? `High flooding risk for ${farmData.crop}. Ensure proper drainage.` : `${farmData.crop} के लिए बाढ़ का जोखिम। जल निकासी सुनिश्चित करें।`);
    }

    if (farmData.temperature > 38) {
      alerts.push(lang === "en" ? `Extreme heat stress detected. Apply mulching to retain soil moisture.` : `अत्यधिक गर्मी का तनाव। मिट्टी की नमी बनाए रखने के लिए मल्चिंग लगाएं।`);
    } else if (farmData.temperature < 15 && farmData.crop !== "Wheat") {
      alerts.push(lang === "en" ? `Low temperature may retard ${farmData.crop} growth.` : `कम तापमान ${farmData.crop} के विकास को धीमा कर सकता है।`);
    }

    if (farmData.investment < 10000 && risk >= 60) {
      alerts.push(lang === "en" ? "Low investment limits recovery options. Consider PM-Kisan subsidy." : "कम निवेश से रिकवरी के विकल्प सीमित हो जाते हैं। पीएम-किसान पर विचार करें।");
    }

    if (risk >= 70 && alerts.length === 0) {
      alerts.push(lang === "en" ? "Immediate crop insurance (PMFBY) is highly recommended." : "तत्काल फसल बीमा (पीएमएफबीवाई) की अत्यधिक सिफारिश की जाती है।");
    }

    if (alerts.length === 0) {
      alerts.push(lang === "en" ? "Ideal conditions. Maintain current strategy." : "आदर्श स्थिति। वर्तमान रणनीति बनाए रखें।");
    }

    return alerts;
  };

  const alerts = getAlerts();

  return (
    <div className={`glass-card p-6 animate-slide-up border shadow-lg ${status.border} ${status.bg}`}>
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
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">{t.alerts}</h4>
          <div className="space-y-3">
            {alerts.length > 0 ? (
              alerts.map((alert, i) => (
                <div key={i} className={`flex items-start gap-3 text-sm font-semibold text-foreground bg-black/60 backdrop-blur-md p-4 rounded-xl border-l-[4px] shadow-md group ${status.border}`}>
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${status.color.replace('text-', 'bg-')}`} />
                  <span className="leading-relaxed text-foreground/90 group-hover:text-white">{alert}</span>
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
