import axios from "axios";

/** Web push is only available on secure origins with the right APIs. */
export function pushSupported() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export function notificationPermission() {
  return pushSupported() ? Notification.permission : "unsupported";
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}

let registration = null;
async function getRegistration() {
  if (!registration) {
    registration = await navigator.serviceWorker.register("/sw.js");
  }
  await navigator.serviceWorker.ready;
  return registration;
}

/** Existing browser push subscription, if the user already opted in. */
export async function getSubscription() {
  if (!pushSupported()) return null;
  try {
    const reg = await getRegistration();
    return await reg.pushManager.getSubscription();
  } catch {
    return null;
  }
}

/**
 * Ask permission, create (or reuse) a push subscription, and register it with
 * the chosen filters. Throws "denied" if the user blocks notifications.
 */
export async function subscribe(filters, publicKey) {
  const reg = await getRegistration();

  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error("denied");

  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
  }

  const encodings =
    (window.PushManager && PushManager.supportedContentEncodings) || ["aes128gcm"];

  await axios.post("/api/store/alerts/subscribe", {
    endpoint: sub.endpoint,
    keys: sub.toJSON().keys,
    contentEncoding: encodings[0],
    filters,
  });

  return sub;
}

/** Remove the browser subscription and deactivate it server-side. */
export async function unsubscribe() {
  const sub = await getSubscription();
  if (!sub) return;
  try {
    await axios.post("/api/store/alerts/unsubscribe", { endpoint: sub.endpoint });
  } catch {
    /* deactivate is best-effort */
  }
  await sub.unsubscribe();
}
