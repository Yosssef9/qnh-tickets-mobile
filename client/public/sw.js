// public/sw.js
/* eslint-env serviceworker */
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyBx0pWap5pxSobDhx6wh2bc-H2V1LGJriQ",
  authDomain: "qnh-tickets-mobile.firebaseapp.com",
  projectId: "qnh-tickets-mobile",
  storageBucket: "qnh-tickets-mobile.firebasestorage.app",
  messagingSenderId: "699274278312",
  appId: "1:699274278312:web:b9691673bd7d9e01e1199d",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[sw.js] Background message received:", payload);

  // Do not manually show notification if Firebase already has notification payload
  if (payload.notification) {
    return;
  }

  const title = payload.data?.title || "Notification";

  const options = {
    body: payload.data?.body || "",
    icon: "/icon-192.png",
    badge: "/badge-72.png",
    // badge: "/badge-72.png",
    data: {
      url: payload.data?.url || "/",
    },
  };

  self.registration.showNotification(title, options);
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification?.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            client.navigate?.(targetUrl);
            return client.focus();
          }
        }

        return clients.openWindow(targetUrl);
      }),
  );
});
