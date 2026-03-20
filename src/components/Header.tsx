import { Link, useLocation } from "react-router-dom";
import { Globe, Cpu } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Header = () => {
  const { lang, setLang, t } = useLanguage();
  const location = useLocation();

  const navLinks = [
    { to: "/", label: t.dashboard },
    { to: "/weather", label: t.weather },
    { to: "/analytics", label: t.analytics },
    { to: "/reports", label: t.reports },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 border-b border-border/50 backdrop-blur-xl bg-background/80 z-50">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between relative">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center neon-glow-green border border-primary/20 group-hover:rotate-6 transition-transform duration-300">
            <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black tracking-tighter text-foreground leading-none bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              {t.appName}
            </h1>
            <p className="text-[8px] sm:text-[10px] text-primary/80 font-medium tracking-[0.2em] uppercase mt-0.5">
              {t.tagline}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-4 mr-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`transition-colors duration-300 ${
                  location.pathname === link.to
                    ? "text-primary"
                    : "hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-[10px] sm:text-xs font-bold text-primary hover:bg-primary/20 transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(var(--neon-green),0.1)]"
          >
            <Globe className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
            {lang === "en" ? "हिंदी" : "English"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
