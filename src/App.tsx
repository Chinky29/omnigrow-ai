import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Analytics from "./pages/Analytics.tsx";
import Reports from "./pages/Reports.tsx";
import Weather from "./pages/Weather.tsx";
import VoiceAssistantPage from "./pages/VoiceAssistantPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import Layout from "./components/Layout.tsx";
import { LanguageProvider } from "./contexts/LanguageContext.tsx";
import { NotificationProvider } from "./contexts/NotificationContext.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <LanguageProvider>
        <NotificationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/weather" element={<Weather />} />
                  <Route path="/voice" element={<VoiceAssistantPage />} />
                </Route>
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </NotificationProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
