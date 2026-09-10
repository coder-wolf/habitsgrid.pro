import type { ReactNode } from "react";
import { MobileTabBar } from "@/components/mobile-tab-bar";

export function TabPage({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground max-md:portrait:pb-32">
      <div className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-8">
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-0.5 text-[13px] text-muted-foreground">{subtitle}</p>}
        <div className="mt-4">{children}</div>
      </div>
      <MobileTabBar />
    </div>
  );
}
