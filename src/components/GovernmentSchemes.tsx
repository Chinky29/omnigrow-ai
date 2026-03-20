import { Landmark } from "lucide-react";
import { Language, translations } from "@/lib/translations";

interface GovernmentSchemesProps {
  crop: string;
  investment: number;
  lang: Language;
}

const getSchemes = (lang: Language) => [
  { 
    name: "PM-KISAN", 
    desc: lang === "en" ? "₹6,000/year direct income support for small farmers" : "छोटे किसानों के लिए ₹6,000/वर्ष प्रत्यक्ष आय सहायता", 
    minInvestment: 0, 
    crops: ["Wheat", "Rice", "Corn"] 
  },
  { 
    name: "PMFBY", 
    desc: lang === "en" ? "Crop insurance at low premium for natural calamities" : "प्राकृतिक आपदाओं के लिए कम प्रीमियम पर फसल बीमा", 
    minInvestment: 0, 
    crops: ["Wheat", "Rice", "Corn", "Cotton", "Sugarcane", "Soybean"] 
  },
  { 
    name: "KCC", 
    desc: lang === "en" ? "Kisan Credit Card — low-interest loans up to ₹3 lakh" : "किसान क्रेडिट कार्ड — ₹3 लाख तक का कम ब्याज वाला ऋण", 
    minInvestment: 20000, 
    crops: ["Wheat", "Rice", "Corn", "Cotton", "Sugarcane", "Soybean"] 
  },
  { 
    name: "RKVY", 
    desc: lang === "en" ? "State-level funding for crop diversification" : "फसल विविधीकरण के लिए राज्य स्तरीय वित्त पोषण", 
    minInvestment: 50000, 
    crops: ["Sugarcane", "Cotton", "Soybean"] 
  },
];

const GovernmentSchemes = ({ crop, investment, lang }: GovernmentSchemesProps) => {
  const t = translations[lang];
  const schemes = getSchemes(lang);
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
          {t.schemesTitle}
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
