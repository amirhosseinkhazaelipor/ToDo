import { cn } from "@/utils/cn";

export interface SelectProps extends React.ComponentPropsWithoutRef<"select"> {
  invalid?: boolean;
}

/**
 * Styled native select: fully accessible, keyboard friendly and RTL-correct
 * out of the box (a custom dropdown would buy nothing here).
 */
function Select({ className, invalid = false, ...props }: SelectProps) {
  return (
    <select
      aria-invalid={invalid || undefined}
      className={cn(
        "h-9 w-full appearance-none rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
        "disabled:cursor-not-allowed disabled:opacity-50",
        invalid && "border-destructive focus-visible:ring-destructive/50",
        className,
      )}
      {...props}
    />
  );
}

export { Select };
