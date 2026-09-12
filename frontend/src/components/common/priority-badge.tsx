import { Badge } from "@/components/ui/badge";
import type { PriorityLevel } from "@/types";
import { getPriorityStyle } from "@/utils/priority";
import { cn } from "@/utils/cn";

interface PriorityBadgeProps {
  priority: PriorityLevel;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const style = getPriorityStyle(priority);

  return (
    <Badge variant="secondary" className={cn(style.className, className)}>
      اهمیت: {style.label}
    </Badge>
  );
}
