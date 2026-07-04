import React from 'react';
import { Badge } from "@/components/ui/badge";

interface RiskBadgeProps {
  score: number;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ score }) => {
  let variant: "default" | "secondary" | "destructive" | "outline" = "default";
  let label = "Low";
  let colorClass = "bg-green-500/10 text-green-500 border-green-500/20";

  if (score >= 90) {
    variant = "destructive";
    label = "Critical";
    colorClass = "bg-red-500/10 text-red-500 border-red-500/20";
  } else if (score >= 70) {
    variant = "outline";
    label = "High";
    colorClass = "bg-orange-500/10 text-orange-500 border-orange-500/20";
  } else if (score >= 40) {
    variant = "secondary";
    label = "Medium";
    colorClass = "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
  }

  return (
    <Badge variant={variant} className={`${colorClass} border px-2 py-1 text-xs font-semibold`}>
      {label} Risk ({score}%)
    </Badge>
  );
};
