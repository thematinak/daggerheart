import React, { useEffect } from "react";
import { AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import styles from "../types/cssColor";
import type { NotificationItem } from "../contexts/CommonDataProvider";

const NOTIFICATION_STYLE_MAP: Record<
  NotificationItem["type"],
  {
    container: string;
    iconBox: string;
    icon: React.ReactNode;
    progress: string;
  }
> = {
  info: {
    container: "border-sky-200/90 bg-[linear-gradient(180deg,_rgba(240,249,255,0.98),_rgba(255,255,255,0.96))]",
    iconBox: `${styles.blue.bg} ${styles.blue.border} ${styles.blue.text}`,
    icon: <Info size={18} />,
    progress: "bg-[linear-gradient(90deg,_#0284c7,_#38bdf8)]",
  },
  warning: {
    container: "border-amber-200/90 bg-[linear-gradient(180deg,_rgba(255,251,235,0.98),_rgba(255,255,255,0.96))]",
    iconBox: `${styles.yellow.bg} ${styles.yellow.border} ${styles.yellow.text}`,
    icon: <AlertTriangle size={18} />,
    progress: "bg-[linear-gradient(90deg,_#b45309,_#f59e0b)]",
  },
  error: {
    container: "border-rose-200/90 bg-[linear-gradient(180deg,_rgba(255,241,242,0.99),_rgba(255,255,255,0.96))]",
    iconBox: `${styles.red.bg} ${styles.red.border} ${styles.red.text}`,
    icon: <AlertCircle size={18} />,
    progress: "bg-[linear-gradient(90deg,_#be123c,_#fb7185)]",
  },
};

const NotificationToast: React.FC<{
  notification: NotificationItem;
  onClose: (id: string) => void;
}> = ({ notification, onClose }) => {
  const tone = NOTIFICATION_STYLE_MAP[notification.type];

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      onClose(notification.id);
    }, notification.durationMs);

    return () => window.clearTimeout(timeout);
  }, [notification.durationMs, notification.id, onClose]);

  return (
    <article className={`${styles.tokens.notification.card} ${tone.container}`}>
      <div className="flex items-start gap-3">
        <div className={`${styles.tokens.notification.iconWrap} ${tone.iconBox}`}>
          {tone.icon}
        </div>

        <div className="min-w-0 flex-1">
          {notification.title ? (
            <div className={styles.tokens.notification.title}>{notification.title}</div>
          ) : null}
          <div className={styles.tokens.notification.message}>{notification.message}</div>
        </div>

        <button
          type="button"
          onClick={() => onClose(notification.id)}
          className={styles.tokens.notification.closeButton}
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>

      <div className={styles.tokens.notification.progressTrack}>
        <div
          className={`h-full origin-left animate-[notification-shrink_linear_forwards] ${tone.progress}`}
          style={{ animationDuration: `${notification.durationMs}ms` }}
        />
      </div>
    </article>
  );
};

const NotificationCenter: React.FC<{
  notifications: NotificationItem[];
  onClose: (id: string) => void;
}> = ({ notifications, onClose }) => {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className={styles.tokens.notification.viewport}>
      {notifications.map((notification) => (
        <NotificationToast key={notification.id} notification={notification} onClose={onClose} />
      ))}
    </div>
  );
};

export default NotificationCenter;
