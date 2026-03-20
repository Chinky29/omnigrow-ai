import { useState, useCallback, useEffect } from "react";
import InputPanel from "@/components/InputPanel";
import CenterPanel from "@/components/CenterPanel";
import InsightsPanel from "@/components/InsightsPanel";
import CropComparison from "@/components/CropComparison";
import WeatherBanner from "@/components/WeatherBanner";
import RiskAnalysis from "@/components/RiskAnalysis";
import GovernmentSchemes from "@/components/GovernmentSchemes";
import { simulate, simulateWithAI } from "@/lib/simulation";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { lang, t } = useLanguage();
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasSimulated, setHasSimulated] = useState(false);

  const [farmData, setFarmData] = useState({
    crop: "Wheat",
    rainfall: 55,
    soilType: "Alluvial",
    investment: 15000,
    temperature: 28,
  });

  const [result, setResult] = useState(() => simulate(farmData));

  // Live what-if updates after first simulation
  useEffect(() => {
    if (hasSimulated) {
      // Use local simulation for instant updates
      setResult(simulate(farmData));
    }
  }, [farmData, hasSimulated]);

  const handleSimulate = useCallback(async () => {
    setIsSimulating(true);
    try {
      // Use AI for the main simulation button
      const aiResult = await simulateWithAI(farmData, lang);
      setResult(aiResult);
      setHasSimulated(true);
    } catch (error) {
      console.error("Simulation Error:", error);
    } finally {
      setIsSimulating(false);
    }
  }, [farmData, lang]);


  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse-slow" />
      </div>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-20 sm:pt-24 pb-12 space-y-8 relative z-10">
        {/* Welcome Section */}
        {!hasSimulated && (
          <div className="glass-card p-6 sm:p-12 text-center space-y-6 animate-slide-up bg-gradient-to-br from-primary/10 via-background/50 to-secondary/10 border-white/10 shadow-2xl">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-5xl font-black tracking-tight text-foreground leading-tight">
                {t.welcome} <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">{t.appName}</span>
              </h2>
              <p className="text-sm sm:text-lg text-muted-foreground max-w-3xl mx-auto text-balance font-medium opacity-90">
                {t.welcomeDesc}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-[10px] sm:text-xs font-bold text-foreground/80 uppercase tracking-widest backdrop-blur-md shadow-sm hover:bg-white/10 transition-colors">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_hsl(var(--primary))]" />
                {t.realTimeData}
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-[10px] sm:text-xs font-bold text-foreground/80 uppercase tracking-widest backdrop-blur-md shadow-sm hover:bg-white/10 transition-colors">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_hsl(var(--secondary))]" />
                {t.riskAssessment}
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-[10px] sm:text-xs font-bold text-foreground/80 uppercase tracking-widest backdrop-blur-md shadow-sm hover:bg-white/10 transition-colors">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_hsl(var(--accent))]" />
                {t.marketInsights}
              </div>
            </div>
          </div>
        )}

        {/* Main Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Panel: Input & Simulation */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <InputPanel
              data={farmData}
              onChange={setFarmData}
              onSimulate={handleSimulate}
              isSimulating={isSimulating}
              lang={lang}
            />
            
            <div className="px-1">
              <WeatherBanner rainfall={farmData.rainfall} lang={lang} />
            </div>
          </div>

          {/* Center Panel: Decision Intelligence */}
          <div className="lg:col-span-8 space-y-8">
            <CenterPanel
              risk={result.risk}
              profit={result.profit}
              outcome={lang === "en" ? result.outcome : getHindiOutcome(result.risk)}
              isSimulating={isSimulating}
              lang={lang}
            />

            {/* AI Insights & Analytics (Full Width within this column or below) */}
            <div className="pt-4">
              <InsightsPanel
                factors={result.factors}
                actions={result.actions}
                breakeven={result.breakeven}
                profit={result.profit}
                lang={lang}
              />
            </div>
          </div>
        </div>

        {/* Comparison & Schemes Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pt-8 border-t border-white/5">
          {hasSimulated && (
            <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <CropComparison crops={result.cropComparison} lang={lang} />
            </div>
          )}

          {hasSimulated && (
            <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <GovernmentSchemes crop={farmData.crop} investment={farmData.investment} lang={lang} />
            </div>
          )}
        </div>

        {/* What-if hint */}
        {hasSimulated && (
          <div className="text-center py-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 border border-border/50">
              <span className="text-[10px] sm:text-xs text-muted-foreground">
                💡 {lang === "en"
                  ? "Try changing any input — results update instantly (What-If Simulator)"
                  : "कोई भी इनपुट बदलें — परिणाम तुरंत अपडेट होंगे"}
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

function getHindiOutcome(risk: number): string {
  if (risk < 30) return "उत्कृष्ट स्थिति — कम जोखिम के साथ अच्छी उपज की उम्मीद।";
  if (risk < 50) return "अच्छी संभावना — मौसम पर नज़र रखें और वर्तमान रणनीति बनाए रखें।";
  if (risk < 70) return "मध्यम जोखिम — विविधीकरण और बीमा पर विचार करें।";
  return "उच्च जोखिम — फसल बीमा और वैकल्पिक योजनाओं पर विचार करें।";
}

export default Index;
