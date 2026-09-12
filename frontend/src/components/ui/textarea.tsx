import { cn } from "@/utils/cn";

export interface TextareaProps
  extends React.ComponentPropsWithoutRef<"textarea"> {
  invalid?: boolean;
}

function Textarea({ className, invalid = false, ...props }: TextareaProps) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={cn(
        "flex min-h-20 w-full rounded-md border border-input bg-card px-3 py-2 text-sm shadow-sm transition-colors",
        "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
        "disabled:cursor-not-allowed disabled:opacity-50",
        invalid && "border-destructive focus-visible:ring-destructive/50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
