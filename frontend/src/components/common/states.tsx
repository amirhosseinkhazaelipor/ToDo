import { CheckCircle2, Loader2, TriangleAlert, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

/** استایل‌های مشترک حالت‌های داده‌محور (Loading / Error / Empty) */
const stateBoxClass =
  "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-10 text-center";

interface LoadingStateProps {
  label?: string;
  className?: string;
}

export function LoadingState({
  label = "در حال بارگذاری…",
  className,
}: LoadingStateProps) {
  return (
    <div role="status" aria-live="polite" className={cn(stateBoxClass, className)}>
      <Loader2 aria-hidden="true" className="size-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ message, onRetry, className }: ErrorStateProps) {
  return (
    <div role="alert" className={cn(stateBoxClass, className)}>
      <XCircle aria-hidden="true" className="size-8 text-destructive" />
      <p className="text-sm font-medium text-destructive">{message}</p>
      {onRetry !== undefined && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          تلاش مجدد
        </Button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(stateBoxClass, className)}>
      {icon ?? <CheckCircle2 aria-hidden="true" className="size-8 text-muted-foreground" />}
      <div>
        <p className="text-sm font-medium">{title}</p>
        {description !== undefined && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

interface InlineErrorProps {
  message?: string;
}

/** پیام خطای کوچک زیر فیلدهای فرم */
export function InlineError({ message }: InlineErrorProps) {
  if (message === undefined) {
    return null;
  }

  return (
    <p role="alert" className="flex items-center gap-1 text-xs text-destructive">
      <TriangleAlert aria-hidden="true" className="size-3.5" />
      {message}
    </p>
  );
}
