import { useEffect, useState } from "react";
import { BellRing, CheckCircle2, Loader2 } from "lucide-react";
import { getFcmToken } from "../features/notifications/token";
import { saveFcmToken } from "../features/notifications/api";
import { useAuth } from "../context/AuthContext";

export default function EnableNotificationsButton() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!user?.userCode) {
      setEnabled(false);
      return;
    }

    const savedToken = localStorage.getItem(`fcm_token_user_${user.userCode}`);

    setEnabled(Boolean(savedToken));
  }, [user?.userCode]);

  const handleEnable = async () => {
    try {
      if (!user?.userCode) {
        alert("User not loaded yet. Please wait and try again.");
        return;
      }

      setLoading(true);

      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        setEnabled(false);
        alert("Notifications permission was not allowed.");
        return;
      }

      await navigator.serviceWorker.ready;

      const token = await getFcmToken();

      if (!token) {
        setEnabled(false);
        alert("Failed to get notification token.");
        return;
      }

      await saveFcmToken(token);

      localStorage.setItem(`fcm_token_user_${user.userCode}`, token);

      setEnabled(true);
    } catch (err) {
      setEnabled(false);
      alert("Notification error: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const title = enabled
    ? "Notifications are active on this device"
    : "Click to enable notifications on this device";

  return (
    <button
      type="button"
      onClick={handleEnable}
      disabled={loading}
      title={title}
      aria-label={title}
      className={`group relative flex h-10 w-10 items-center justify-center rounded-2xl border backdrop-blur-md transition ${
        enabled
          ? "border-emerald-300/40 bg-emerald-400/20 text-emerald-50"
          : "border-white/20 bg-white/10 text-white hover:bg-white/20 active:scale-[0.96]"
      }`}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : enabled ? (
        <CheckCircle2 size={18} />
      ) : (
        <BellRing size={18} className="animate-bounce" />
      )}

      {!enabled && !loading && (
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-400 ring-2 ring-[rgb(21,98,160)]" />
      )}

      <span className="pointer-events-none absolute -bottom-10 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg bg-black/80 px-2 py-1 text-[10px] font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100">
        {enabled ? "Notifications ON" : "Enable Notifications"}
      </span>
    </button>
  );
}
