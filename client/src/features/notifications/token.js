// src/features/notifications/token.js
import { getToken } from "firebase/messaging";
import { getFirebaseMessagingSafe } from "../../config/firebase";

export async function registerAppServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service workers are not supported in this browser.");
  }

  const registration = await navigator.serviceWorker.register("/sw.js");

  // wait until service worker is active and ready
  await navigator.serviceWorker.ready;

  return registration;
}

export async function getFcmToken() {
  const messaging = await getFirebaseMessagingSafe();
  if (!messaging) return null;

  const registration = await registerAppServiceWorker();

  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration,
  });

  return token;
}
