import { useState, useRef } from "react";
import { Mic, MicOff, Volume2, X, Sparkles, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { gemini, isAIEnabled } from "@/lib/gemini";
import { toast } from "sonner";

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

  const speakText = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "hi" ? "hi-IN" : "en-US";
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const toggleAssistant = () => {
    if (!isOpen) {
      setIsOpen(true);
      setResponse(t.voiceWelcome);
    } else {
      setIsOpen(false);
      stopAssistant();
    }
  };

  const stopAssistant = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    window.speechSynthesis.cancel();
  };

  const processVoiceQuery = async (query: string) => {
    if (!query.trim()) return;

    // Check if Gemini is enabled
    if (!isAIEnabled || !gemini) {
      const msg = lang === "en"
        ? "AI is offline. Please add your Gemini API key in the .env file."
        : "AI ऑफ़लाइन है। कृपया .env फ़ाइल में Gemini API key डालें।";
      setResponse(msg);
      speakText(msg);
      toast.error("VITE_GEMINI_API_KEY not set in .env");
      return;
    }

    setIsProcessing(true);
    try {
      const prompt = `You are KRISHIX Voice Assistant, an expert agricultural advisor for Indian farmers.
The user asked: "${query}"
Answer in ${lang === "hi" ? "simple Hindi" : "simple English"}.
Keep it to 2-3 sentences max. Be practical and farmer-friendly.`;

      const aiResponse = await gemini.generateContent(prompt);
      const text = aiResponse.response.text();
      setResponse(text);
      speakText(text);
    } catch (error: any) {
      console.error("Gemini error:", error);
      const msg = lang === "en"
        ? "Something went wrong. Please try again."
        : "कुछ गलत हुआ। कृपया दोबारा कोशिश करें।";
      setResponse(msg);
      toast.error("Gemini API error: " + error?.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Speech recognition not supported. Try Chrome.");
      return;
    }

    try {
      recognitionRef.current?.stop();

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      // Edge works better with explicit lang
      recognition.lang = lang === "hi" ? "hi-IN" : "en-US";
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript("");
        setResponse("");
      };

      recognition.onresult = (event: any) => {
        const text = event.results?.[0]?.[0]?.transcript;
        if (text) {
          setTranscript(text);
          processVoiceQuery(text);
        } else {
          toast.error("Could not understand. Please try again.");
        }
      };

      recognition.onnomatch = () => {
        toast.error("No speech detected. Please speak clearly.");
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech error:", event.error);
        setIsListening(false);
        if (event.error === "not-allowed") {
          toast.error("Microphone access denied. Allow mic in browser settings.");
        } else if (event.error === "network") {
          toast.error("Network error. Check your internet connection.");
        } else if (event.error !== "no-speech") {
          toast.error("Speech error: " + event.error);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();

    } catch (error: any) {
      console.error("Start error:", error);
      setIsListening(false);
      toast.error("Could not start mic: " + error?.message);
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

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[320px] sm:w-[380px] glass-card p-6 animate-slide-up z-[100] border-primary/20 bg-background/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              </div>
              <h3 className="font-bold text-sm tracking-tight">{t.voiceAssistant}</h3>
            </div>
            <div className="flex items-center gap-2">
              {isProcessing && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
              <div className={`w-2 h-2 rounded-full ${isListening ? "bg-red-500 animate-pulse" : "bg-muted"}`} />
              {/* AI status indicator */}
              <div className={`w-2 h-2 rounded-full ${isAIEnabled ? "bg-primary" : "bg-yellow-500"}`}
                title={isAIEnabled ? "Gemini connected" : "Gemini offline"} />
            </div>
          </div>

          {/* Offline warning */}
          {!isAIEnabled && (
            <div className="mb-4 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <p className="text-[10px] text-yellow-400 font-bold">
                ⚠️ {lang === "en" ? "Add VITE_GEMINI_API_KEY to .env to enable AI" : "AI चालू करने के लिए .env में API key डालें"}
              </p>
            </div>
          )}

          {/* Conversation */}
          <div className="space-y-4 min-h-[80px]">
            {transcript && (
              <div className="flex justify-end">
                <div className="bg-primary/10 border border-primary/20 rounded-2xl rounded-tr-none px-4 py-2 max-w-[85%]">
                  <p className="text-xs font-medium italic">"{transcript}"</p>
                </div>
              </div>
            )}
            <div className="flex justify-start">
              <div className="bg-muted/50 border border-border/50 rounded-2xl rounded-tl-none px-4 py-3 max-w-[90%] relative group">
                <p className="text-sm leading-relaxed">
                  {isProcessing
                    ? <span className="flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" />{t.processing}</span>
                    : response || t.howCanIHelp
                  }
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

          {/* Mic Button */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              onClick={isListening ? stopAssistant : startListening}
              disabled={isProcessing}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 ${
                isListening
                  ? "bg-red-500 shadow-[0_0_20px_rgba(255,50,50,0.5)] scale-110"
                  : "bg-primary/10 border-2 border-primary/30 text-primary hover:bg-primary/20 hover:scale-105"
              }`}
            >
              {isListening
                ? <MicOff className="w-7 h-7 text-white" />
                : <Mic className="w-7 h-7" />
              }
            </button>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {isListening ? "🔴 Listening..." : isProcessing ? "⏳ Processing..." : "Tap to Speak"}
            </p>
          </div>

          {/* Also allow typing for Edge fallback */}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder={lang === "en" ? "Or type your question..." : "या यहाँ टाइप करें..."}
              className="flex-1 text-xs bg-muted/30 border border-border/50 rounded-lg px-3 py-2 outline-none focus:border-primary/50"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  const val = e.currentTarget.value.trim();
                  setTranscript(val);
                  e.currentTarget.value = "";
                  processVoiceQuery(val);
                }
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceAssistant;