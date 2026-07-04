import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/lib/mock-data";
import { ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";

const config: Record<
  RiskLevel,
  { label: string; className: string; icon: typeof ShieldAlert }
> = {
  critical: {
    label: "Critical",
    className: "bg-destructive/15 text-destructive border-destructive/30",
    icon: ShieldAlert,
  },
  high: {
    label: "High Risk",
    className: "bg-destructive/10 text-destructive border-destructive/25",
    icon: ShieldAlert,
  },
  medium: {
    label: "Medium",
    className: "bg-warning/15 text-warning border-warning/30",
    icon: ShieldQuestion,
  },
  low: {
    label: "Low Risk",
    className: "bg-primary/15 text-primary border-primary/30",
    icon: ShieldCheck,
  },
  safe: {
    label: "Safe",
    className: "bg-success/15 text-success border-success/30",
    icon: ShieldCheck,
  },
};

export function RiskBadge({
  level,
  className,
}: {
  level: RiskLevel;
  className?: string;
}) {
  const { label, className: levelClass, icon: Icon } = config[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        levelClass,
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
