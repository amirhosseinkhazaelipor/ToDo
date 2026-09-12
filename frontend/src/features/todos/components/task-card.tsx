import { CalendarClock, CheckCircle2, Pencil, RotateCcw, Trash2 } from "lucide-react";

import { PriorityBadge } from "@/components/common/priority-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TodoItem, TodoListSummary } from "@/types";
import { formatDate, isOverdue } from "@/utils/date";
import { cn } from "@/utils/cn";

interface TaskCardProps {
  task: TodoItem;
  /** فقط فیلدهای لازم برای نمایش بج لیست */
  list?: Pick<TodoListSummary, "id" | "title" | "colour">;
  onToggle: (task: TodoItem) => void;
  onEdit: (task: TodoItem) => void;
  onDelete: (task: TodoItem) => void;
}

/** نمایش یک کار — در صفحه کارها و داشبورد استفاده می‌شود */
export function TaskCard({ task, list, onToggle, onEdit, onDelete }: TaskCardProps) {
  const overdue = isOverdue(task.dueDateUtc, task.done);

  return (
    <li
      className={cn(
        "flex items-start gap-3 rounded-xl border bg-card p-4 transition-colors",
        task.done && "opacity-60",
      )}
    >
      <button
        type="button"
        aria-label={task.done ? "بازگشایی کار" : "انجام شد"}
        onClick={() => onToggle(task)}
        className={cn(
          "mt-0.5 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
          task.done
            ? "text-success hover:text-success/80"
            : "text-muted-foreground/40 hover:text-success",
        )}
      >
        <CheckCircle2 className="size-6" aria-hidden="true" />
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-medium leading-6",
            task.done && "line-through decoration-muted-foreground",
          )}
        >
          {task.title}
        </p>

        {task.note !== null && task.note !== "" && (
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{task.note}</p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <PriorityBadge priority={task.priority} />

          {list !== undefined && (
            <Badge variant="outline">
              <span
                aria-hidden="true"
                className="size-2 rounded-full"
                style={{ backgroundColor: list.colour }}
              />
              {list.title}
            </Badge>
          )}

          {task.dueDateUtc !== null && (
            <Badge variant={overdue ? "destructive" : "secondary"}>
              <CalendarClock aria-hidden="true" className="size-3" />
              {formatDate(task.dueDateUtc)}
              {overdue && " (عقب‌افتاده)"}
            </Badge>
          )}

          {task.done && task.completedAtUtc !== null && (
            <Badge variant="success">انجام‌شده</Badge>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          aria-label={task.done ? "بازگشایی" : "علامت‌گذاری به‌عنوان انجام‌شده"}
          onClick={() => onToggle(task)}
        >
          {task.done ? (
            <RotateCcw aria-hidden="true" />
          ) : (
            <CheckCircle2 aria-hidden="true" />
          )}
        </Button>
        <Button variant="ghost" size="icon" aria-label="ویرایش کار" onClick={() => onEdit(task)}>
          <Pencil aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="حذف کار"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onDelete(task)}
        >
          <Trash2 aria-hidden="true" />
        </Button>
      </div>
    </li>
  );
}
