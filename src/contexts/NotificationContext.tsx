import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLanguage } from "./LanguageContext";
import { Bell, AlertTriangle, TrendingUp, Calendar, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export type NotificationType = "risk" | "opportunity" | "event" | "success";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  recommendation: string;
  timestamp: number;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { t } = useLanguage();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = (n: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...n,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      read: false,
    };
    
    setNotifications((prev) => [newNotification, ...prev].slice(0, 20)); // Keep last 20
    
    // Show toast for new notification
    toast(newNotification.title, {
      description: newNotification.message,
      action: {
        label: "View",
        onClick: () => console.log("View notification", newNotification.id),
      },
    });
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  useEffect(() => {
    // Add sample notifications on mount for demo
    if (notifications.length === 0) {
      addNotification({
        type: "event",
        title: "Weather Alert",
        message: "Moderate rain expected in your region within 2 hours.",
        recommendation: "Ensure proper drainage channels are clear to prevent waterlogging."
      });
      addNotification({
        type: "opportunity",
        title: "New Subsidy Available",
        message: "PM-Kisan updated subsidy for organic fertilizers is now open.",
        recommendation: "Apply via the official portal before the end of this month."
      });
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
