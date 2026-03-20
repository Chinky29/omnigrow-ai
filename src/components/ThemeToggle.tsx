import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/50 border border-border/50 text-muted-foreground hover:text-foreground transition-all hover:scale-105 active:scale-95"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="w-4 h-4 transition-all" />
      ) : (
        <Sun className="w-4 h-4 transition-all" />
      )}
    </button>
  )
}
