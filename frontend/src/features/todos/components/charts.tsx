import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TasksPerListStat } from "@/types";
import { formatNumber } from "@/utils/date";

interface CompletionBarChartProps {
  data: TasksPerListStat[];
}

/** نمودار میله‌ای افقی «انجام‌شده در برابر کل» به ازای هر لیست */
export function CompletionBarChart({ data }: CompletionBarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>وضعیت کارها در لیست‌ها</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {data.length === 0 && (
          <p className="text-sm text-muted-foreground">هنوز لیستی ساخته نشده است.</p>
        )}

        {data.map((stat) => {
          const doneRatio = stat.totalCount === 0 ? 0 : stat.doneCount / stat.totalCount;

          return (
            <div key={stat.listId}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium">
                  <span
                    aria-hidden="true"
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: stat.colour }}
                  />
                  {stat.listTitle}
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {formatNumber(stat.doneCount)} از {formatNumber(stat.totalCount)}
                </span>
              </div>
              <div
                role="progressbar"
                aria-label={`پیشرفت لیست ${stat.listTitle}`}
                aria-valuenow={stat.doneCount}
                aria-valuemin={0}
                aria-valuemax={stat.totalCount}
                className="h-2.5 w-full overflow-hidden rounded-full bg-muted"
              >
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{
                    width: `${doneRatio * 100}%`,
                    backgroundColor: stat.colour,
                  }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

interface DonutChartProps {
  done: number;
  open: number;
  overdue: number;
}

/** نمودار دوناتِ نسبت کارهای انجام‌شده */
export function CompletionDonutChart({ done, open, overdue }: DonutChartProps) {
  const total = done + open;
  const doneRatio = total === 0 ? 0 : done / total;

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const doneLength = circumference * doneRatio;

  return (
    <Card>
      <CardHeader>
        <CardTitle>نرخ تکمیل</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center gap-6">
        <svg
          viewBox="0 0 128 128"
          className="size-36 -rotate-90"
          role="img"
          aria-label={`نرخ تکمیل: ${Math.round(doneRatio * 100)} درصد`}
        >
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            strokeWidth="14"
            className="stroke-muted"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${doneLength} ${circumference - doneLength}`}
            className="stroke-primary transition-[stroke-dasharray] duration-700"
          />
        </svg>

        <div className="flex flex-col gap-2 text-sm">
          <div className="text-center">
            <p className="text-3xl font-bold tabular-nums">
              {formatNumber(Math.round(doneRatio * 100))}٪
            </p>
            <p className="text-xs text-muted-foreground">انجام‌شده</p>
          </div>
          <p className="text-xs text-muted-foreground">
            {formatNumber(done)} انجام‌شده · {formatNumber(open)} باز
            {overdue > 0 && ` · ${formatNumber(overdue)} عقب‌افتاده`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
