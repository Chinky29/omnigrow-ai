import { useState, useEffect, useCallback, useRef } from "react";
import { Mic, MicOff, Volume2, X, Sparkles, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { openai, isAIEnabled } from "@/lib/openai";
import { toast } from "sonner";

// Extend window for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const VoiceAssistant = () => {
  const { lang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = lang === "hi" ? "hi-IN" : "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const currentTranscript = event.results[0][0].transcript;
        setTranscript(currentTranscript);
        processVoiceQuery(currentTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        setIsListening(false);
        if (event.error !== "no-speech") {
          toast.error(t.voiceError);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [lang, t.voiceError]);

  // Update recognition language when site language changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = lang === "hi" ? "hi-IN" : "en-US";
    }
  }, [lang]);

  const toggleAssistant = () => {
    if (!isOpen) {
      setIsOpen(true);
      setResponse(t.voiceWelcome);
      speakText(t.voiceWelcome);
    } else {
      setIsOpen(false);
      stopAssistant();
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition not supported in this browser.");
      return;
    }
    setTranscript("");
    setResponse("");
    setIsListening(true);
    recognitionRef.current.start();
  };

  const stopAssistant = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    window.speechSynthesis.cancel();
  };

  const speakText = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "hi" ? "hi-IN" : "en-US";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const processVoiceQuery = async (query: string) => {
    if (!isAIEnabled || !openai) {
      const fallback = lang === "en" 
        ? "AI is currently offline. Please check your API key." 
        : "AI वर्तमान में ऑफ़लाइन है। कृपया अपनी API कुंजी जांचें।";
      setResponse(fallback);
      speakText(fallback);
      return;
    }

    setIsProcessing(true);
    try {
      const prompt = `
        You are KRISHIX Voice Assistant, an expert agricultural advisor.
        The user said: "${query}"
        Provide a concise, helpful answer in ${lang === "hi" ? "Hindi" : "English"}.
        If they ask about farming, crops, soil, or weather, give expert advice.
        Keep the response brief (max 2-3 sentences) so it sounds natural when spoken.
      `;

      const aiResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
      });

      const text = aiResponse.choices[0].message.content || "";
      setResponse(text);
      speakText(text);
    } catch (error) {
      console.error("AI processing error:", error);
      setResponse(t.voiceError);
      speakText(t.voiceError);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleAssistant}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 z-[100] shadow-2xl ${
          isOpen 
            ? "bg-destructive text-destructive-foreground rotate-90" 
            : "bg-primary text-primary-foreground hover:scale-110 neon-glow-green"
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </button>

      {/* Assistant Modal/Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[320px] sm:w-[380px] glass-card p-6 animate-slide-up z-[100] border-primary/20 bg-background/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary animate-pulse-neon" />
              </div>
              <h3 className="font-bold text-sm tracking-tight">{t.voiceAssistant}</h3>
            </div>
            <div className="flex items-center gap-2">
              {isProcessing && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
              <div className={`w-2 h-2 rounded-full ${isListening ? "bg-neon-red animate-pulse" : "bg-muted"}`} />
            </div>
          </div>

          <div className="space-y-4">
            {/* User Transcript */}
            {transcript && (
              <div className="flex justify-end">
                <div className="bg-primary/10 border border-primary/20 rounded-2xl rounded-tr-none px-4 py-2 max-w-[85%]">
                  <p className="text-xs font-medium text-foreground/80 italic">"{transcript}"</p>
                </div>
              </div>
            )}

            {/* AI Response */}
            <div className="flex justify-start">
              <div className="bg-muted/50 border border-border/50 rounded-2xl rounded-tl-none px-4 py-3 max-w-[90%] group relative">
                <p className="text-sm leading-relaxed">
                  {isProcessing ? t.processing : response || t.howCanIHelp}
                </p>
                {response && !isProcessing && (
                  <button 
                    onClick={() => speakText(response)}
                    className="absolute -right-8 top-1/2 -translate-y-1/2 p-1.5 hover:text-primary transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4">
            <button
              onClick={isListening ? stopAssistant : startListening}
              disabled={isProcessing}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                isListening 
                  ? "bg-neon-red shadow-[0_0_20px_rgba(255,50,50,0.4)] scale-110" 
                  : "bg-primary/10 border-2 border-primary/30 text-primary hover:bg-primary/20"
              }`}
            >
              {isListening ? (
                <MicOff className="w-7 h-7 text-white" />
              ) : (
                <Mic className="w-7 h-7" />
              )}
            </button>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
              {isListening ? t.listening : (isProcessing ? t.processing : "Tap to Speak")}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceAssistant;
