import { cn } from "@/utils/cn";

export interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  /** خطای اعتبارسنجی — برای aria-invalid و استایل */
  invalid?: boolean;
}

function Input({ className, type = "text", invalid = false, ...props }: InputProps) {
  return (
    <input
      type={type}
      aria-invalid={invalid || undefined}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors",
        "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
        "disabled:cursor-not-allowed disabled:opacity-50",
        invalid && "border-destructive focus-visible:ring-destructive/50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
