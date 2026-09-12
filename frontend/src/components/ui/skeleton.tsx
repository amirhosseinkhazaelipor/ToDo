import { cn } from "@/utils/cn";

export interface SkeletonProps extends React.ComponentPropsWithoutRef<"div"> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
