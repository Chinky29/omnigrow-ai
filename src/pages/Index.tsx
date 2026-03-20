import { useState, useCallback, useEffect } from "react";
import InputPanel from "@/components/InputPanel";
import CenterPanel from "@/components/CenterPanel";
import InsightsPanel from "@/components/InsightsPanel";
import CropComparison from "@/components/CropComparison";
import WeatherBanner from "@/components/WeatherBanner";
import GovernmentSchemes from "@/components/GovernmentSchemes";
import { simulate } from "@/lib/simulation";
import { Globe, Cpu } from "lucide-react";

const Index = () => {
  const [lang, setLang] = useState<"en" | "hi">("en");
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
      setResult(simulate(farmData));
    }
  }, [farmData, hasSimulated]);

  const handleSimulate = useCallback(() => {
    setIsSimulating(true);
    setTimeout(() => {
      setResult(simulate(farmData));
      setIsSimulating(false);
      setHasSimulated(true);
    }, 1800);
  }, [farmData]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center neon-glow-green">
              <Cpu className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-foreground leading-none">
                OMNIX AI
              </h1>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
                Agriculture Decision Intelligence
              </p>
            </div>
          </div>

          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            {lang === "en" ? "हिंदी" : "English"}
          </button>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-5 space-y-5">
        {/* Weather Banner */}
        <WeatherBanner rainfall={farmData.rainfall} />

        {/* Main 3-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Panel */}
          <div className="lg:col-span-3">
            <InputPanel
              data={farmData}
              onChange={setFarmData}
              onSimulate={handleSimulate}
              isSimulating={isSimulating}
            />
          </div>

          {/* Center Panel */}
          <div className="lg:col-span-5">
            <CenterPanel
              risk={result.risk}
              profit={result.profit}
              outcome={lang === "en" ? result.outcome : getHindiOutcome(result.risk)}
              isSimulating={isSimulating}
            />
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-4">
            <InsightsPanel
              factors={result.factors}
              actions={result.actions}
              breakeven={result.breakeven}
            />
          </div>
        </div>

        {/* Crop Comparison */}
        {hasSimulated && (
          <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <CropComparison crops={result.cropComparison} />
          </div>
        )}

        {/* Government Schemes */}
        {hasSimulated && (
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <GovernmentSchemes crop={farmData.crop} investment={farmData.investment} />
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
