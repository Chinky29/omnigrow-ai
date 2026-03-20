import { useState } from "react";
import { FileText, Download, Share2, ClipboardList, Database, Loader2, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { generateReports, ReportData } from "@/lib/reportGenerator";
import { toast } from "sonner";

// Reusable report card
const ReportCard = ({
  icon, title, date, color, sections, isExpanded, onToggle, onDownload,
}: {
  icon: React.ReactNode; title: string; date: string; color: string;
  sections: { label: string; value: string }[];
  isExpanded: boolean; onToggle: () => void; onDownload: () => void;
}) => (
  <div className={`glass-card p-6 space-y-4 group transition-all hover:neon-glow-${color}`}>
    <div className="flex justify-between items-start">
      <div className={`w-10 h-10 rounded-xl bg-${color}/10 flex items-center justify-center border border-${color}/20`}>
        {icon}
      </div>
      <div className="flex gap-2">
        <button onClick={onDownload} className="p-1.5 hover:bg-muted rounded-md transition-colors">
          <Download className="w-4 h-4" />
        </button>
        <button onClick={() => {
          const text = sections.map(s => `${s.label}: ${s.value}`).join("\n");
          navigator.clipboard.writeText(text);
          toast.success("Copied to clipboard!");
        }} className="p-1.5 hover:bg-muted rounded-md transition-colors">
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </div>

    <div>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1">{date}</p>
    </div>

    {/* Preview — first section always visible */}
    <p className="text-sm text-muted-foreground leading-relaxed">{sections[0]?.value}</p>

    {/* Expandable full report */}
    {isExpanded && (
      <div className="space-y-3 pt-2 border-t border-border/40 animate-slide-up">
        {sections.slice(1).map((s, i) => (
          <div key={i} className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{s.label}</p>
            <p className="text-sm text-foreground/90 leading-relaxed">{s.value}</p>
          </div>
        ))}
      </div>
    )}

    <button
      onClick={onToggle}
      className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors pt-1"
    >
      {isExpanded
        ? <><ChevronUp className="w-3 h-3" /> Hide Details</>
        : <><ChevronDown className="w-3 h-3" /> View Full Report</>
      }
    </button>
  </div>
);

const Reports = () => {
  const { lang, t } = useLanguage();
  const [reports, setReports] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Farm data from localStorage or defaults
  const farmData = {
    crop: "Wheat", rainfall: 55, soilType: "Alluvial",
    investment: 15000, temperature: 28,
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await generateReports(farmData, lang);
      setReports(data);
      toast.success(lang === "en" ? "Reports generated!" : "रिपोर्ट तैयार हो गई!");
    } catch {
      toast.error(lang === "en" ? "Failed to generate reports." : "रिपोर्ट बनाने में विफल।");
    } finally {
      setLoading(false);
    }
  };

  const toggle = (key: string) =>
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  const downloadReport = (title: string, sections: { label: string; value: string }[]) => {
    const content = `KRISHIX AI — ${title}\n${"=".repeat(40)}\n\n` +
      sections.map(s => `${s.label}:\n${s.value}\n`).join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${title.replace(/\s+/g, "_")}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  const dailySections = reports ? [
    { label: lang === "en" ? "Weather Impact" : "मौसम का प्रभाव", value: reports.dailySummary.weather },
    { label: lang === "en" ? "Crop Status" : "फसल की स्थिति", value: reports.dailySummary.cropStatus },
    { label: lang === "en" ? "Today's Action" : "आज का काम", value: reports.dailySummary.recommendation },
  ] : [{ label: "", value: lang === "en" ? "Click 'Generate Reports' to get AI insights." : "AI जानकारी पाने के लिए 'रिपोर्ट बनाएं' पर क्लिक करें।" }];

  const yieldSections = reports ? [
    { label: lang === "en" ? "Q1 Outlook" : "पहली तिमाही", value: reports.yieldProjection.q1 },
    { label: lang === "en" ? "Expected Yield" : "अपेक्षित उपज", value: reports.yieldProjection.expectedYield },
    { label: lang === "en" ? "Market Price" : "बाजार भाव", value: reports.yieldProjection.marketPrice },
    { label: lang === "en" ? "Pro Tip" : "सुझाव", value: reports.yieldProjection.advice },
  ] : [{ label: "", value: lang === "en" ? "Click 'Generate Reports' to get AI insights." : "AI जानकारी पाने के लिए 'रिपोर्ट बनाएं' पर क्लिक करें।" }];

  const auditSections = reports ? [
    { label: lang === "en" ? "Investment Breakdown" : "निवेश विवरण", value: reports.fullAudit.investmentBreakdown },
    { label: lang === "en" ? "Profit Forecast" : "लाभ अनुमान", value: reports.fullAudit.profitForecast },
    { label: lang === "en" ? "Risks" : "जोखिम", value: reports.fullAudit.risks },
    { label: lang === "en" ? "Govt. Schemes" : "सरकारी योजनाएं", value: reports.fullAudit.schemes },
  ] : [{ label: "", value: lang === "en" ? "Click 'Generate Reports' to get AI insights." : "AI जानकारी पाने के लिए 'रिपोर्ट बनाएं' पर क्लिक करें।" }];

  return (
    <div className="min-h-screen bg-background text-foreground pt-16 sm:pt-20 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">{t.reports}</h1>
            <p className="text-muted-foreground">
              {lang === "en" ? "AI-generated reports based on your farm data." : "आपके खेत के डेटा के आधार पर AI द्वारा बनाई गई रिपोर्ट।"}
            </p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50 neon-glow-green shadow-lg"
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" />{lang === "en" ? "Generating..." : "बन रही है..."}</>
              : <><RefreshCw className="w-4 h-4" />{lang === "en" ? "Generate Reports" : "रिपोर्ट बनाएं"}</>
            }
          </button>
        </div>

        {/* Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ReportCard
            icon={<FileText className="w-6 h-6 text-primary" />}
            title={lang === "en" ? "Daily Summary" : "दैनिक सारांश"}
            date="MAR 21, 2026" color="green"
            sections={dailySections}
            isExpanded={!!expanded["daily"]}
            onToggle={() => toggle("daily")}
            onDownload={() => downloadReport("Daily Summary", dailySections)}
          />
          <ReportCard
            icon={<ClipboardList className="w-6 h-6 text-secondary" />}
            title={lang === "en" ? "Yield Projection" : "उपज का अनुमान"}
            date="Q1 2026" color="blue"
            sections={yieldSections}
            isExpanded={!!expanded["yield"]}
            onToggle={() => toggle("yield")}
            onDownload={() => downloadReport("Yield Projection", yieldSections)}
          />
          <ReportCard
            icon={<Database className="w-6 h-6 text-accent" />}
            title={lang === "en" ? "Full Farm Audit" : "पूर्ण फार्म ऑडिट"}
            date="MAR 2026" color="purple"
            sections={auditSections}
            isExpanded={!!expanded["audit"]}
            onToggle={() => toggle("audit")}
            onDownload={() => downloadReport("Full Farm Audit", auditSections)}
          />
        </div>

        {/* Language note */}
        <div className="glass-card p-4 border-dashed border-2 bg-muted/5 text-center">
          <p className="text-sm text-muted-foreground italic">
            {lang === "en"
              ? "💡 Switch to Hindi using the language button in the navbar — reports will be generated in simple Hindi for easy understanding."
              : "💡 रिपोर्ट सरल हिंदी में बनाई गई है ताकि हर किसान आसानी से समझ सके।"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reports;