import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, Sparkles, Loader2, MessageSquare, Bot } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { openai, isAIEnabled } from "@/lib/openai";
import { toast } from "sonner";

const VoiceAssistantPage = () => {
  const { lang, t } = useLanguage();
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

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = lang === "hi" ? "hi-IN" : "en-US";
    }
  }, [lang]);

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
        Keep the response brief (max 3-4 sentences) so it sounds natural when spoken.
      `;

      const aiResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 250,
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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden pt-16 sm:pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 pb-10 space-y-8">
        <div className="flex flex-col gap-4 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 neon-glow-green">
              <Sparkles className="w-7 h-7 text-primary animate-pulse-neon" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">
              {t.voiceAssistant}
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            {t.voiceWelcome}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Interaction Area */}
          <div className="glass-card p-6 sm:p-10 flex flex-col items-center justify-center gap-8 min-h-[400px] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            
            {/* Listening/Processing Status */}
            <div className="flex flex-col items-center gap-4 z-10">
              <button
                onClick={isListening ? stopAssistant : startListening}
                disabled={isProcessing}
                className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isListening 
                    ? "bg-neon-red shadow-[0_0_40px_rgba(255,50,50,0.4)] scale-110" 
                    : "bg-primary/10 border-4 border-primary/20 text-primary hover:bg-primary/20 hover:scale-105"
                }`}
              >
                {isListening ? (
                  <MicOff className="w-10 h-10 sm:w-14 sm:h-14 text-white animate-pulse" />
                ) : (
                  <Mic className="w-10 h-10 sm:w-14 sm:h-14" />
                )}
              </button>
              <p className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] text-muted-foreground">
                {isListening ? t.listening : (isProcessing ? t.processing : "Tap to Speak")}
              </p>
            </div>

            {/* Conversation Log (Written form) */}
            <div className="w-full max-w-2xl space-y-6 z-10">
              {transcript && (
                <div className="flex items-start gap-3 justify-end animate-slide-in-right">
                  <div className="flex flex-col items-end gap-1.5 max-w-[85%]">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      {lang === "en" ? "You" : "आप"}
                      <MessageSquare className="w-3 h-3" />
                    </div>
                    <div className="bg-primary/10 border border-primary/20 rounded-2xl rounded-tr-none px-5 py-3 shadow-sm">
                      <p className="text-sm font-medium italic leading-relaxed text-foreground/90">"{transcript}"</p>
                    </div>
                  </div>
                </div>
              )}

              {(response || isProcessing) && (
                <div className="flex items-start gap-3 justify-start animate-slide-up">
                  <div className="flex flex-col items-start gap-1.5 max-w-[90%] sm:max-w-[85%]">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest">
                      <Bot className="w-3 h-3" />
                      KRISHIX AI
                    </div>
                    <div className="bg-muted/50 border border-border/50 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm group relative">
                      {isProcessing ? (
                        <div className="flex items-center gap-2 py-1">
                          <Loader2 className="w-4 h-4 text-primary animate-spin" />
                          <span className="text-sm text-muted-foreground italic">{t.processing}</span>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm sm:text-base leading-relaxed text-foreground">
                            {response}
                          </p>
                          <button 
                            onClick={() => speakText(response)}
                            className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest border border-primary/20 rounded-full px-3 py-1 bg-primary/5"
                          >
                            <Volume2 className="w-3 h-3" />
                            {lang === "en" ? "Listen Again" : "फिर से सुनें"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Help/Tips */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-4 text-center space-y-2">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest">{lang === "en" ? "Try Asking" : "पूछें"}</p>
              <p className="text-xs text-muted-foreground italic">"How to improve soil health?"</p>
            </div>
            <div className="glass-card p-4 text-center space-y-2">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest">{lang === "en" ? "Try Asking" : "पूछें"}</p>
              <p className="text-xs text-muted-foreground italic">"Best time to plant wheat?"</p>
            </div>
            <div className="glass-card p-4 text-center space-y-2">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest">{lang === "en" ? "Try Asking" : "पूछें"}</p>
              <p className="text-xs text-muted-foreground italic">"Weather impact on rice crops?"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistantPage;
