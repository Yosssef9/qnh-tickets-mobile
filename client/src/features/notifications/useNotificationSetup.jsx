import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getFcmToken } from "./token";
import { saveFcmToken } from "./api";
import { subscribeToForegroundMessages } from "./messaging";

const notificationSound = new Audio("/sounds/notification.mp3");

export function useNotificationSetup(user) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.userCode) return;
    if (Notification.permission !== "granted") return;

    let unsubscribe = () => {};

    async function init() {
      const token = await getFcmToken();
      if (!token) return;

      const storageKey = `fcm_token_user_${user.userCode}`;
      const savedToken = localStorage.getItem(storageKey);

      if (savedToken !== token) {
        await saveFcmToken(token);
        localStorage.setItem(storageKey, token);
      }

      unsubscribe = await subscribeToForegroundMessages((payload) => {
        console.log("Foreground FCM payload:", payload);

        notificationSound.currentTime = 0;
        notificationSound.play().catch(() => {});

        const type = payload.data?.type || "notification";

        const title =
          payload.data?.title || payload.notification?.title || "Notification";

        const body =
          payload.data?.body ||
          payload.notification?.body ||
          "You have a new update";

        const ticketId = payload.data?.ticketId;
        const url =
          payload.data?.url || (ticketId ? `/tickets/${ticketId}` : null);

        toast.custom(
          (t) => (
            <div
              onClick={() => {
                toast.dismiss(t.id);
                if (url) navigate(url);
              }}
              className={`w-[330px] cursor-pointer rounded-2xl border bg-white p-4 shadow-xl transition ${
                t.visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-2 opacity-0"
              }`}
            >
              <div className="flex gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                    type === "ticket_assigned"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-[rgb(21,98,160)]/10 text-[rgb(21,98,160)]"
                  }`}
                >
                  🔔
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-800">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {body}
                  </p>

                  {url && (
                    <p className="mt-2 text-xs font-semibold text-[rgb(21,98,160)]">
                      Tap to open ticket
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.dismiss(t.id);
                  }}
                  className="text-sm font-bold text-slate-400 hover:text-slate-700"
                >
                  ×
                </button>
              </div>
            </div>
          ),
          {
            duration: 7000,
            position: "top-center",
          },
        );
      });
    }

    init().catch(console.error);

    return () => unsubscribe();
  }, [user?.userCode, navigate]);
}