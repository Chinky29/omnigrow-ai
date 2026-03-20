import React from "react";
import { Bell, AlertTriangle, TrendingUp, Calendar, CheckCircle2, X, Trash2, ExternalLink } from "lucide-react";
import { useNotifications, NotificationType } from "@/contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

const NotificationIcon = ({ type }: { type: NotificationType }) => {
  switch (type) {
    case "risk": return <AlertTriangle className="w-4 h-4 text-destructive" />;
    case "opportunity": return <TrendingUp className="w-4 h-4 text-primary" />;
    case "event": return <Calendar className="w-4 h-4 text-secondary" />;
    case "success": return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    default: return <Bell className="w-4 h-4 text-muted-foreground" />;
  }
};

const NotificationCenter = ({ onClose }: { onClose: () => void }) => {
  const { notifications, markAsRead, markAllAsRead, clearAll, unreadCount } = useNotifications();
  const { lang } = useLanguage();

  return (
    <div className="absolute top-full right-0 mt-4 w-[380px] sm:w-[420px] glass-card shadow-2xl z-50 animate-slide-up origin-top-right border-white/10">
      <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-3xl rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground uppercase tracking-widest">
              {lang === "en" ? "Notifications" : "सूचनाएं"}
            </h3>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5 opacity-70">
              {unreadCount} {lang === "en" ? "Unread Alerts" : "अपठित अलर्ट"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button 
              onClick={clearAll}
              className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors"
              title="Clear All"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-[500px] overflow-y-auto custom-scrollbar p-3 space-y-3">
        {notifications.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center mx-auto border border-white/5">
              <Bell className="w-6 h-6 text-muted-foreground opacity-30" />
            </div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-50">
              {lang === "en" ? "No notifications yet" : "अभी कोई सूचना नहीं है"}
            </p>
          </div>
        ) : (
          notifications.map((n) => (
            <div 
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`p-4 rounded-2xl border transition-all duration-300 group relative overflow-hidden cursor-pointer ${
                n.read 
                  ? "bg-white/2 dark:bg-black/10 border-white/5 opacity-70" 
                  : "bg-white/5 dark:bg-white/5 border-primary/20 shadow-lg ring-1 ring-primary/10"
              } hover:translate-y-[-2px] hover:shadow-xl hover:border-primary/40`}
            >
              {!n.read && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors" />
              )}
              
              <div className="flex items-start gap-4 relative z-10">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  n.type === 'risk' ? 'bg-destructive/10 border-destructive/20' : 
                  n.type === 'opportunity' ? 'bg-primary/10 border-primary/20' : 
                  'bg-secondary/10 border-secondary/20'
                }`}>
                  <NotificationIcon type={n.type} />
                </div>
                
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                      n.type === 'risk' ? 'text-destructive border-destructive/20 bg-destructive/5' : 
                      n.type === 'opportunity' ? 'text-primary border-primary/20 bg-primary/5' : 
                      'text-secondary border-secondary/20 bg-secondary/5'
                    }`}>
                      {n.type}
                    </span>
                    <span className="text-[9px] font-bold text-muted-foreground opacity-60">
                      {formatDistanceToNow(n.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  
                  <h4 className={`text-sm font-black tracking-tight leading-snug ${n.read ? 'text-foreground/80' : 'text-foreground'}`}>
                    {n.title}
                  </h4>
                  
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    {n.message}
                  </p>

                  <div className="pt-2">
                    <div className="bg-white/5 dark:bg-black/20 border border-white/10 rounded-xl p-3 space-y-2">
                      <div className="flex items-center gap-2 text-[9px] font-black text-primary uppercase tracking-[0.2em]">
                        <CheckCircle2 className="w-3 h-3" />
                        {lang === "en" ? "Recommendation" : "सिफारिश"}
                      </div>
                      <p className="text-[11px] text-foreground/90 font-medium leading-relaxed italic">
                        "{n.recommendation}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-4 border-t border-white/5 bg-white/2 backdrop-blur-3xl rounded-b-2xl">
          <button 
            onClick={markAllAsRead}
            className="w-full py-2.5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {lang === "en" ? "Mark all as read" : "सभी को पढ़ा हुआ मानें"}
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
