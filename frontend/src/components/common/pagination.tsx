import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatNumber } from "@/utils/date";
import { cn } from "@/utils/cn";

interface PaginationProps {
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (pageNumber: number) => void;
  className?: string;
}

export function Pagination({
  pageNumber,
  totalPages,
  totalCount,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) {
    return (
      <p className={cn("text-xs text-muted-foreground", className)}>
        مجموع {formatNumber(totalCount)} مورد
      </p>
    );
  }

  return (
    <nav
      aria-label="صفحه‌بندی"
      className={cn("flex flex-wrap items-center justify-between gap-3", className)}
    >
      <p className="text-xs text-muted-foreground">
        صفحه {formatNumber(pageNumber)} از {formatNumber(totalPages)} — مجموع{" "}
        {formatNumber(totalCount)} مورد
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={pageNumber <= 1}
          onClick={() => onPageChange(pageNumber - 1)}
        >
          <ChevronRight aria-hidden="true" />
          قبلی
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={pageNumber >= totalPages}
          onClick={() => onPageChange(pageNumber + 1)}
        >
          بعدی
          <ChevronLeft aria-hidden="true" />
        </Button>
      </div>
    </nav>
  );
}
