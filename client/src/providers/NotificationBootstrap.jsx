import { useAuth } from "../context/AuthContext";
import { useNotificationSetup } from "../features/notifications/useNotificationSetup";

export default function NotificationBootstrap() {
  const { user } = useAuth();
  console.log("NotificationBootstrap rendered, user =", user);
  useNotificationSetup(user);
  return null;
}
