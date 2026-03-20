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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden pt-20 sm:pt-24 relative">
      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse-slow" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 pb-12 space-y-10 relative z-10">
        <div className="flex flex-col gap-5 text-center sm:text-left animate-slide-up">
          <div className="flex items-center justify-center sm:justify-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 neon-glow-green shadow-lg">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground uppercase bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                {t.voiceAssistant}
              </h1>
              <p className="text-[10px] sm:text-xs text-primary font-bold tracking-[0.4em] uppercase mt-1">AI Voice Intelligence</p>
            </div>
          </div>
          <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl font-medium opacity-80 leading-relaxed">
            {t.voiceWelcome}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Interaction Area */}
          <div className="glass-card p-8 sm:p-12 flex flex-col items-center justify-center gap-10 min-h-[450px] relative overflow-hidden shadow-2xl border-white/10 group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none group-hover:opacity-100 transition-opacity duration-1000" />
            
            {/* Listening/Processing Status */}
            <div className="flex flex-col items-center gap-6 z-10">
              <div className="relative">
                {isListening && (
                  <div className="absolute inset-0 rounded-full bg-neon-red/20 animate-ping" />
                )}
                <button
                  onClick={isListening ? stopAssistant : startListening}
                  disabled={isProcessing}
                  className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full flex items-center justify-center transition-all duration-500 relative z-10 ${
                    isListening 
                      ? "bg-neon-red shadow-[0_0_50px_rgba(255,50,50,0.5)] scale-110" 
                      : "bg-primary/10 border-4 border-primary/20 text-primary hover:bg-primary/20 hover:scale-105 active:scale-95 shadow-xl"
                  }`}
                >
                  {isListening ? (
                    <MicOff className="w-12 h-12 sm:w-16 sm:h-16 text-white animate-pulse" />
                  ) : (
                    <Mic className="w-12 h-12 sm:w-16 sm:h-16 group-hover:scale-110 transition-transform" />
                  )}
                </button>
              </div>
              <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">
                {isListening ? t.listening : (isProcessing ? t.processing : "Tap to Speak")}
              </p>
            </div>

            {/* Conversation Log (Written form) */}
            <div className="w-full max-w-2xl space-y-8 z-10">
              {transcript && (
                <div className="flex items-start gap-4 justify-end animate-slide-in-right">
                  <div className="flex flex-col items-end gap-2 max-w-[85%]">
                    <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-70">
                      {lang === "en" ? "You" : "आप"}
                      <MessageSquare className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-primary/10 backdrop-blur-md border border-primary/20 rounded-2xl rounded-tr-none px-6 py-4 shadow-sm group-hover:shadow-md transition-shadow">
                      <p className="text-sm sm:text-base font-medium italic leading-relaxed text-foreground/90">"{transcript}"</p>
                    </div>
                  </div>
                </div>
              )}

              {(response || isProcessing) && (
                <div className="flex items-start gap-4 justify-start animate-slide-up">
                  <div className="flex flex-col items-start gap-2 max-w-[90%] sm:max-w-[85%]">
                    <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
                      <Bot className="w-3.5 h-3.5" />
                      KRISHIX AI
                    </div>
                    <div className="bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-2xl rounded-tl-none px-6 py-5 shadow-sm group-hover:shadow-lg transition-all relative">
                      {isProcessing ? (
                        <div className="flex items-center gap-3 py-2">
                          <Loader2 className="w-5 h-5 text-primary animate-spin" />
                          <span className="text-sm sm:text-base text-muted-foreground italic font-medium tracking-wide">{t.processing}</span>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm sm:text-lg leading-relaxed text-foreground font-medium">
                            {response}
                          </p>
                          <button 
                            onClick={() => speakText(response)}
                            className="mt-5 flex items-center gap-2 text-[10px] font-black text-primary hover:text-white hover:bg-primary transition-all uppercase tracking-[0.2em] border border-primary/30 rounded-xl px-4 py-2 bg-primary/5 shadow-sm"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-slide-up delay-200">
            <div className="glass-card-hover p-6 text-center space-y-3 bg-white/5 border-white/10">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{lang === "en" ? "Try Asking" : "पूछें"}</p>
              <p className="text-sm text-muted-foreground font-medium italic leading-relaxed opacity-90">"How to improve soil health?"</p>
            </div>
            <div className="glass-card-hover p-6 text-center space-y-3 bg-white/5 border-white/10">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{lang === "en" ? "Try Asking" : "पूछें"}</p>
              <p className="text-sm text-muted-foreground font-medium italic leading-relaxed opacity-90">"Best time to plant wheat?"</p>
            </div>
            <div className="glass-card-hover p-6 text-center space-y-3 bg-white/5 border-white/10">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{lang === "en" ? "Try Asking" : "पूछें"}</p>
              <p className="text-sm text-muted-foreground font-medium italic leading-relaxed opacity-90">"Weather impact on rice crops?"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistantPage;
