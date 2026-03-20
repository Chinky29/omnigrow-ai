import { BarChart3, TrendingUp, PieChart, Activity } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Analytics = () => {
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground pt-16 sm:pt-20 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">
            {t.analytics}
          </h1>
          <p className="text-muted-foreground">
            {lang === "en" ? "Deep dive into your farm's performance metrics." : "अपने खेत के प्रदर्शन मेट्रिक्स का गहराई से विश्लेषण करें।"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-card p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold">{lang === "en" ? "Yield Trends" : "उपज का रुझान"}</h3>
            <p className="text-sm text-muted-foreground">{lang === "en" ? "Historical analysis of crop productivity over time." : "समय के साथ फसल उत्पादकता का ऐतिहासिक विश्लेषण।"}</p>
          </div>

          <div className="glass-card p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
              <BarChart3 className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-lg font-bold">{lang === "en" ? "Resource Usage" : "संसाधन उपयोग"}</h3>
            <p className="text-sm text-muted-foreground">{lang === "en" ? "Efficiency metrics for water, fertilizer, and energy." : "पानी, उर्वरक और ऊर्जा के लिए दक्षता मेट्रिक्स।"}</p>
          </div>

          <div className="glass-card p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
              <PieChart className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-bold">{lang === "en" ? "Market Dynamics" : "बाजार की गतिशीलता"}</h3>
            <p className="text-sm text-muted-foreground">{lang === "en" ? "Real-time price trends and demand forecasting." : "वास्तविक समय मूल्य रुझान और मांग पूर्वानुमान।"}</p>
          </div>
        </div>
        
        <div className="glass-card p-8 flex flex-col items-center justify-center text-center space-y-4 border-dashed border-2">
           <Activity className="w-12 h-12 text-muted-foreground/30" />
           <p className="text-muted-foreground italic">
             {lang === "en" ? "Advanced analytics charts will appear here after more data is collected." : "अधिक डेटा एकत्र होने के बाद उन्नत विश्लेषण चार्ट यहां दिखाई देंगे।"}
           </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
