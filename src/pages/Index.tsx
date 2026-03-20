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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-10 space-y-6">
        {/* Welcome Section */}
        {!hasSimulated && (
          <div className="glass-card p-5 sm:p-10 text-center space-y-4 animate-slide-up bg-gradient-to-b from-primary/10 to-transparent border-primary/20">
            <h2 className="text-xl sm:text-4xl font-black tracking-tighter text-foreground">
              {t.welcome} <span className="text-primary">{t.appName}</span>
            </h2>
            <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto text-balance">
              {t.welcomeDesc}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-muted/50 border border-border text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary animate-pulse" />
                {t.realTimeData}
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-muted/50 border border-border text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-secondary animate-pulse" />
                {t.riskAssessment}
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-muted/50 border border-border text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-accent animate-pulse" />
                {t.marketInsights}
              </div>
            </div>
          </div>
        )}

        {/* Weather Banner */}
        <div className="px-1 sm:px-0">
          <WeatherBanner rainfall={farmData.rainfall} lang={lang} />
        </div>

        {/* Risk Analysis (Previously with Weather Forecast) */}
        <div className="grid grid-cols-1 gap-6">
          <RiskAnalysis risk={result.risk} lang={lang} />
        </div>

        {/* Main 3-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel */}
          <div className="lg:col-span-3 lg:sticky lg:top-24 h-fit">
            <InputPanel
              data={farmData}
              onChange={setFarmData}
              onSimulate={handleSimulate}
              isSimulating={isSimulating}
              lang={lang}
            />
          </div>

          {/* Center Panel */}
          <div className="lg:col-span-5 space-y-6">
            <CenterPanel
              risk={result.risk}
              profit={result.profit}
              outcome={lang === "en" ? result.outcome : getHindiOutcome(result.risk)}
              isSimulating={isSimulating}
              lang={lang}
            />
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-4 space-y-6">
            <InsightsPanel
              factors={result.factors}
              actions={result.actions}
              breakeven={result.breakeven}
              lang={lang}
            />
          </div>
        </div>

        {/* Crop Comparison */}
        {hasSimulated && (
          <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <CropComparison crops={result.cropComparison} lang={lang} />
          </div>
        )}

        {/* Government Schemes */}
        {hasSimulated && (
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <GovernmentSchemes crop={farmData.crop} investment={farmData.investment} lang={lang} />
          </div>
        )}

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
