import { Link, useLocation } from "react-router-dom";
import { Globe, Cpu } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "./ThemeToggle";

const Header = () => {
  const { lang, setLang, t } = useLanguage();
  const location = useLocation();

  const navLinks = [
    { to: "/", label: t.dashboard },
    { to: "/weather", label: t.weather },
    { to: "/analytics", label: t.analytics },
    { to: "/reports", label: t.reports },
    { to: "/voice", label: t.voiceAssistant },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 border-b border-white/5 backdrop-blur-2xl bg-background/60 z-50 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between relative">
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-primary/10 flex items-center justify-center neon-glow-green border border-primary/20 group-hover:rotate-6 transition-all duration-500 group-hover:scale-110">
            <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base sm:text-lg font-black tracking-tight text-foreground leading-none bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70">
              {t.appName}
            </h1>
            <p className="text-[8px] sm:text-[9px] text-primary font-bold tracking-[0.3em] uppercase mt-1 opacity-80">
              {t.tagline}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="hidden lg:flex items-center gap-8 mr-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative py-1 transition-all duration-300 hover:text-primary group ${
                  location.pathname === link.to
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full transition-transform duration-300 origin-left ${
                  location.pathname === link.to ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`} />
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-[11px] font-bold text-primary hover:bg-primary/20 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(var(--neon-green),0.1)] group"
            >
              <Globe className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
              {lang === "en" ? "हिंदी" : "English"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
