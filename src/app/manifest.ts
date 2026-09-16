import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CMS BAPENDA Provinsi Jambi",
    short_name: "CMS BAPENDA",
    description: "Aplikasi pengelolaan konten dan cek pajak kendaraan BAPENDA Provinsi Jambi",
    start_url: "/cms/dashboard",
    scope: "/cms",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#1a3a6e",
    lang: "id",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Cek Pajak Kendaraan", short_name: "Cek Pajak", url: "/cms/pajak-kendaraan" },
      { name: "Dashboard", short_name: "Dashboard", url: "/cms/dashboard" },
    ],
  };
}
