import { useState } from "react";
import {
  CheckCircle2,
  CircleDot,
  ListTodo,
  Plus,
  TriangleAlert,
} from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { PriorityBadge } from "@/components/common/priority-badge";
import { StatCard } from "@/components/common/stat-card";
import { EmptyState, ErrorState } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CompletionBarChart,
  CompletionDonutChart,
} from "@/features/todos/components/charts";
import { TaskFormDialog } from "@/features/todos/components/task-form-dialog";
import { useDashboard } from "@/features/todos/hooks/use-dashboard";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { formatDate } from "@/utils/date";
import { getErrorMessage } from "@/utils/errors";

export default function DashboardPage() {
  useDocumentTitle("داشبورد");
  const {
    data: stats,
    isError,
    error,
    isPending,
    refetch,
  } = useDashboard();
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="داشبورد"
        description="نگاهی کلی به وضعیت کارهای شما"
        action={
          <Button onClick={() => setIsTaskDialogOpen(true)}>
            <Plus aria-hidden="true" />
            کار جدید
          </Button>
        }
      />

      {isError ? (
        <ErrorState
          message={getErrorMessage(error, "دریافت آمار ناموفق بود.")}
          onRetry={() => void refetch()}
        />
      ) : isPending || stats === undefined ? (
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-24" />
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <section aria-label="آمار کلی" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="همه کارها"
              value={stats.totalTasks}
              icon={ListTodo}
            />
            <StatCard
              title="انجام‌شده"
              value={stats.doneTasks}
              icon={CheckCircle2}
              iconClassName="text-success"
            />
            <StatCard
              title="باز"
              value={stats.openTasks}
              icon={CircleDot}
              iconClassName="text-primary"
            />
            <StatCard
              title="عقب‌افتاده"
              value={stats.overdueTasks}
              icon={TriangleAlert}
              iconClassName="text-destructive"
            />
          </section>

          <section aria-label="نمودارها" className="grid gap-4 lg:grid-cols-2">
            <CompletionDonutChart
              done={stats.doneTasks}
              open={stats.openTasks}
              overdue={stats.overdueTasks}
            />
            <CompletionBarChart data={stats.tasksPerList} />
          </section>

          <section aria-label="کارهای پیش‌رو">
            <Card>
              <CardHeader>
                <CardTitle>کارهای پیش‌رو</CardTitle>
              </CardHeader>
              <CardContent>
                {stats.upcomingTasks.length === 0 ? (
                  <EmptyState
                    title="کاری در پیش نیست"
                    description="کارهای باز با مهلت آینده اینجا نمایش داده می‌شوند."
                    action={
                      <Button size="sm" onClick={() => setIsTaskDialogOpen(true)}>
                        <Plus aria-hidden="true" />
                        افزودن کار
                      </Button>
                    }
                  />
                ) : (
                  <ul className="divide-y">
                    {stats.upcomingTasks.map((task) => (
                      <li
                        key={task.id}
                        className="flex flex-wrap items-center justify-between gap-2 py-2.5"
                      >
                        <span className="text-sm font-medium">{task.title}</span>
                        <span className="flex items-center gap-2 text-xs text-muted-foreground">
                          <PriorityBadge priority={task.priority} />
                          {formatDate(task.dueDateUtc)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      )}

      <TaskFormDialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen} />
    </>
  );
}
