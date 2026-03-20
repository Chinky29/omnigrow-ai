import { useState, useCallback, useEffect } from "react";
import InputPanel from "@/components/InputPanel";
import CenterPanel from "@/components/CenterPanel";
import InsightsPanel from "@/components/InsightsPanel";
import CropComparison from "@/components/CropComparison";
import WeatherBanner from "@/components/WeatherBanner";
import WeatherForecast from "@/components/WeatherForecast";
import RiskAnalysis from "@/components/RiskAnalysis";
import GovernmentSchemes from "@/components/GovernmentSchemes";
import { simulate, simulateWithAI } from "@/lib/simulation";
import { Globe, Cpu } from "lucide-react";
import { Language, translations } from "@/lib/translations";

const Index = () => {
  const [lang, setLang] = useState<Language>("en");
  const t = translations[lang];
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
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center neon-glow-green border border-primary/20 transform hover:rotate-6 transition-transform">
              <Cpu className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tighter text-foreground leading-none bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                {t.appName}
              </h1>
              <p className="text-[10px] text-primary/80 font-medium tracking-[0.2em] uppercase mt-0.5">
                {t.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-4 mr-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <span className="hover:text-primary cursor-pointer transition-colors">{t.dashboard}</span>
              <span className="hover:text-primary cursor-pointer transition-colors">{t.analytics}</span>
              <span className="hover:text-primary cursor-pointer transition-colors">{t.reports}</span>
            </div>
            <button
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-bold text-primary hover:bg-primary/20 transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(var(--neon-green),0.1)]"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === "en" ? "हिंदी" : "English"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-5 space-y-5">
        {/* Welcome Section */}
        {!hasSimulated && (
          <div className="glass-card p-6 md:p-10 text-center space-y-4 animate-slide-up bg-gradient-to-b from-primary/10 to-transparent border-primary/20">
            <h2 className="text-2xl md:text-4xl font-black tracking-tighter text-foreground">
              {t.welcome} <span className="text-primary">{t.appName}</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto text-balance">
              {t.welcomeDesc}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                {t.realTimeData}
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                {t.riskAssessment}
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                {t.marketInsights}
              </div>
            </div>
          </div>
        )}

        {/* Weather Banner */}
        <WeatherBanner rainfall={farmData.rainfall} lang={lang} />

        {/* Weather Forecast & Risk Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-8">
            <WeatherForecast lang={lang} />
          </div>
          <div className="md:col-span-4">
            <RiskAnalysis risk={result.risk} lang={lang} />
          </div>
        </div>

        {/* Main 3-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Panel */}
          <div className="lg:col-span-3">
            <InputPanel
              data={farmData}
              onChange={setFarmData}
              onSimulate={handleSimulate}
              isSimulating={isSimulating}
              lang={lang}
            />
          </div>

          {/* Center Panel */}
          <div className="lg:col-span-5">
            <CenterPanel
              risk={result.risk}
              profit={result.profit}
              outcome={lang === "en" ? result.outcome : getHindiOutcome(result.risk)}
              isSimulating={isSimulating}
              lang={lang}
            />
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-4">
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
          <div className="text-center py-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <p className="text-xs text-muted-foreground">
              💡 {lang === "en"
                ? "Try changing any input — results update instantly (What-If Simulator)"
                : "कोई भी इनपुट बदलें — परिणाम तुरंत अपडेट होंगे"}
            </p>
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
