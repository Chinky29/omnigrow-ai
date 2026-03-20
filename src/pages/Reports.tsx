import { FileText, Download, Share2, ClipboardList, Database } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Reports = () => {
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground pt-16 sm:pt-20 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">
            {t.reports}
          </h1>
          <p className="text-muted-foreground">
            {lang === "en" ? "Export and share your detailed agricultural reports." : "अपनी विस्तृत कृषि रिपोर्ट निर्यात करें और साझा करें।"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-card p-6 space-y-4 group hover:neon-glow-green transition-all">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="flex gap-2">
                <button className="p-1.5 hover:bg-muted rounded-md transition-colors"><Download className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-muted rounded-md transition-colors"><Share2 className="w-4 h-4" /></button>
              </div>
            </div>
            <h3 className="text-lg font-bold">{lang === "en" ? "Daily Summary" : "दैनिक सारांश"}</h3>
            <p className="text-xs text-muted-foreground">MAR 20, 2026</p>
            <p className="text-sm text-muted-foreground">{lang === "en" ? "Detailed log of weather conditions and crop status." : "मौसम की स्थिति और फसल की स्थिति का विस्तृत लॉग।"}</p>
          </div>

          <div className="glass-card p-6 space-y-4 group hover:neon-glow-blue transition-all">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
                <ClipboardList className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex gap-2">
                <button className="p-1.5 hover:bg-muted rounded-md transition-colors"><Download className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-muted rounded-md transition-colors"><Share2 className="w-4 h-4" /></button>
              </div>
            </div>
            <h3 className="text-lg font-bold">{lang === "en" ? "Yield Projection" : "उपज का अनुमान"}</h3>
            <p className="text-xs text-muted-foreground">Q1 2026</p>
            <p className="text-sm text-muted-foreground">{lang === "en" ? "Quarterly forecast based on AI simulations." : "एआई सिमुलेशन पर आधारित तिमाही पूर्वानुमान।"}</p>
          </div>

          <div className="glass-card p-6 space-y-4 group hover:neon-glow-purple transition-all">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
                <Database className="w-6 h-6 text-accent" />
              </div>
              <div className="flex gap-2">
                <button className="p-1.5 hover:bg-muted rounded-md transition-colors"><Download className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-muted rounded-md transition-colors"><Share2 className="w-4 h-4" /></button>
              </div>
            </div>
            <h3 className="text-lg font-bold">{lang === "en" ? "Full Farm Audit" : "पूर्ण फार्म ऑडिट"}</h3>
            <p className="text-xs text-muted-foreground">MAR 2026</p>
            <p className="text-sm text-muted-foreground">{lang === "en" ? "Complete breakdown of investment and expected profit." : "निवेश और अपेक्षित लाभ का पूर्ण विवरण।"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
