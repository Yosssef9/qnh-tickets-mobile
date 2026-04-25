// src/features/notifications/messaging.js
import { onMessage } from "firebase/messaging";
import { getFirebaseMessagingSafe } from "../../config/firebase";

export async function subscribeToForegroundMessages(callback) {
  const messaging = await getFirebaseMessagingSafe();
  if (!messaging) return () => {};

  return onMessage(messaging, (payload) => {
    callback(payload);
  });
}
