"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  AudioLines,
  BarChart3,
  BookOpen,
  Image as ImageIcon,
  LayoutDashboard,
  Link2,
  MessageSquareText,
  Network,
  Settings,
  ShieldCheck,
} from "lucide-react";

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/screenshot", label: "Analyze Screenshot", icon: ImageIcon },
  { href: "/text", label: "Analyze Text", icon: MessageSquareText },
  { href: "/audio", label: "Analyze Audio", icon: AudioLines },
  { href: "/url", label: "Analyze URL", icon: Link2 },
  { href: "/knowledge", label: "Knowledge Base", icon: BookOpen },
  { href: "/network", label: "Fraud Network", icon: Network },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="flex flex-1 flex-col gap-1 p-3">
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              active &&
                "bg-primary/15 text-primary hover:bg-primary/20 hover:text-primary",
            )}
          >
            <item.icon className="size-4.5 shrink-0" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 px-2">
      <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent glow-primary">
        <ShieldCheck className="size-5 text-primary-foreground" aria-hidden="true" />
      </span>
      {!compact ? (
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-tight">
            FraudShield AI
          </span>
          <span className="text-[11px] text-muted-foreground">
            Digital Public Safety
          </span>
        </span>
      ) : null}
    </Link>
  );
}

export function AppSidebar() {
  return (
    <aside className="glass-strong fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r lg:flex">
      <div className="flex h-16 items-center border-b px-4">
        <BrandMark />
      </div>
      <SidebarNav />
      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground">
          Protecting citizens from digital fraud with AI.
        </p>
      </div>
    </aside>
  );
}
