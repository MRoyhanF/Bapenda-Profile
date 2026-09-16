"use client";

import { useSidebarStore } from "@/store";
import { CmsSidebar } from "@/components/cms/sidebar";
import { CmsHeader } from "@/components/cms/header";
import { MobileTopBar, MobileTabBar } from "@/components/cms/mobile-nav";
import { PwaProvider } from "@/components/cms/pwa-provider";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebarStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const pathname = usePathname();

  const isAuthPage = pathname === "/cms/login";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PwaProvider />
      <CmsSidebar />
      <MobileTopBar />
      <div
        className={cn(
          "transition-all duration-300",
          // Margin sidebar hanya berlaku dari breakpoint md ke atas.
          mounted ? (isOpen ? "md:ml-64" : "md:ml-16") : "md:ml-64"
        )}
      >
        <CmsHeader />
        {/* pb menyisakan ruang untuk bottom tab bar di mobile. */}
        <main className="cms-main p-4 pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:p-6 md:pb-6">
          {children}
        </main>
      </div>
      <MobileTabBar />
    </div>
  );
}
