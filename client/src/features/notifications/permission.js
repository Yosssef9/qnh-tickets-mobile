export async function requestNotificationPermission() {
  if (typeof window === "undefined") {
    return "unsupported";
  }

  if (!("Notification" in window)) {
    return "unsupported";
  }

  return await window.Notification.requestPermission();
}
