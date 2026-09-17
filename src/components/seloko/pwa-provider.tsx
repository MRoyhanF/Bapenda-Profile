"use client";

import { useEffect, useState } from "react";
import { Download, X, WifiOff } from "lucide-react";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "cms-install-dismissed";

/**
 * Daftarkan service worker + tawarkan install (Android/Chrome) dan
 * tampilkan banner saat offline. Hanya dipasang di area /cms.
 */
export function PwaProvider() {
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // SW opsional: CMS tetap jalan penuh tanpa dukungan offline.
      });
    }

    function onBeforeInstall(e: Event) {
      e.preventDefault();
      if (localStorage.getItem(DISMISS_KEY) === "1") return;
      setInstallEvent(e as InstallPromptEvent);
    }
    function onInstalled() {
      setInstallEvent(null);
    }
    function syncOnline() {
      setOffline(!navigator.onLine);
    }

    syncOnline();
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    window.addEventListener("online", syncOnline);
    window.addEventListener("offline", syncOnline);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
      window.removeEventListener("online", syncOnline);
      window.removeEventListener("offline", syncOnline);
    };
  }, []);

  async function handleInstall() {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  }

  function handleDismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setInstallEvent(null);
  }

  return (
    <>
      {offline && (
        <div className="fixed top-0 inset-x-0 z-[60] bg-amber-500 text-white text-xs font-medium py-1.5 text-center pt-[calc(0.375rem+env(safe-area-inset-top))]">
          <WifiOff className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
          Tidak ada koneksi internet
        </div>
      )}

      {installEvent && (
        <div className="md:hidden fixed inset-x-3 z-50 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] bg-white border border-gray-200 rounded-2xl shadow-lg p-3 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/icon-192.png" alt="" className="h-10 w-10 rounded-xl flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate">Pasang CMS BAPENDA</p>
            <p className="text-xs text-muted-foreground">Akses lebih cepat langsung dari layar utama</p>
          </div>
          <button
            onClick={handleInstall}
            className="flex-shrink-0 bg-primary text-white text-xs font-semibold rounded-lg px-3 py-2 flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            Pasang
          </button>
          <button onClick={handleDismiss} aria-label="Tutup" className="flex-shrink-0 p-1 text-gray-400">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  );
}
