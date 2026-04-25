import api from "../../services/api"; // change path if needed

export async function saveFcmToken(fcmToken) {
  const response = await api.post("/api/notifications/token", {
    token: fcmToken,
    deviceType: "web",
    userAgent: navigator.userAgent,
  });

  return response.data;
}
