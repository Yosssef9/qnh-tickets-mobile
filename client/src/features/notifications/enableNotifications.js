import { requestNotificationPermission } from "./permission";
import { getFcmToken } from "./token";
import { saveFcmToken } from "./api";

export async function enableNotifications(user) {
  if (!user?.userCode) {
    throw new Error("User is not available");
  }

  const permission = await requestNotificationPermission();

  if (permission !== "granted") {
    return {
      success: false,
      message: "Notification permission was not granted",
    };
  }

  const token = await getFcmToken();
  if (!token) {
    return {
      success: false,
      message: "Failed to get FCM token",
    };
  }

  const storageKey = `fcm_token_user_${user.userCode}`;
  const savedToken = localStorage.getItem(storageKey);

  if (savedToken !== token) {
    await saveFcmToken({ token });
    localStorage.setItem(storageKey, token);
  }

  return {
    success: true,
    message: "Notifications enabled successfully",
  };
}
