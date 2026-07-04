import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  change,
  trend,
  icon: Icon,
  iconClassName,
}: {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down";
  icon: LucideIcon;
  iconClassName?: string;
}) {
  return (
    <Card className="glass transition-colors duration-200 hover:border-primary/40">
      <CardContent className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {change ? (
            <p
              className={cn(
                "inline-flex items-center gap-1 text-xs",
                trend === "down" ? "text-success" : "text-primary",
              )}
            >
              {trend === "down" ? (
                <TrendingDown className="size-3.5" aria-hidden="true" />
              ) : (
                <TrendingUp className="size-3.5" aria-hidden="true" />
              )}
              {change} vs last week
            </p>
          ) : null}
        </div>
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary",
            iconClassName,
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </div>
      </CardContent>
    </Card>
  );
}
