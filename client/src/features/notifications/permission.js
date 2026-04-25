export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    return "unsupported";
  }

  return await Notification.requestPermission();
}
