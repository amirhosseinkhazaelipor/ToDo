import { cn } from "@/utils/cn";

export interface LabelProps extends React.ComponentPropsWithoutRef<"label"> {
  /** خطای اعتبارسنجی — رنگ متن را قرمز می‌کند */
  invalid?: boolean;
}

function Label({ className, invalid = false, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "text-sm font-medium leading-none select-none",
        invalid && "text-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
