"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => registration.unregister());
      });
      if ("caches" in window) {
        caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));
      }
      return;
    }

    let refreshing = false;
    const onControllerChange = () => {
      if (refreshing) {
        return;
      }
      refreshing = true;
      window.location.reload();
    };
    const onLoad = () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          registration.update();
          if (registration.waiting) {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
          }
          registration.addEventListener("updatefound", () => {
            const installingWorker = registration.installing;
            if (!installingWorker) {
              return;
            }
            installingWorker.addEventListener("statechange", () => {
              if (
                installingWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                installingWorker.postMessage({ type: "SKIP_WAITING" });
              }
            });
          });
        })
        .catch(() => {
          // No-op for mock usage.
        });
    };

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    window.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("load", onLoad);
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);

  return null;
}
