import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/utils/date";
import { cn } from "@/utils/cn";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  /** کلاس رنگ آیکون، مثلاً text-primary */
  iconClassName?: string;
}

export function StatCard({ title, value, icon: Icon, iconClassName }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-3 p-5">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">
            {formatNumber(value)}
          </p>
        </div>
        <span
          aria-hidden="true"
          className={cn(
            "flex size-11 items-center justify-center rounded-lg bg-muted",
            iconClassName,
          )}
        >
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  );
}
