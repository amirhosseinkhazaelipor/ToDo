import { useState } from "react";
import { useId } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  /** کنترل باز بودن — اگر داده نشود، خود کامپوننت مدیریت می‌کند */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

/** دیالوگ تایید عملیات مخرب (حذف) — قابل استفاده مجدد در همه صفحات */
export function ConfirmDialog({
  title,
  description,
  confirmLabel = "حذف",
  onConfirm,
  open,
  onOpenChange,
  trigger,
}: ConfirmDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const descriptionId = useId();

  const isControlled = onOpenChange !== undefined;
  const isOpen = isControlled ? (open ?? false) : internalOpen;
  const setOpen = (next: boolean): void => {
    if (!isControlled) {
      setInternalOpen(next);
    }

    onOpenChange?.(next);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {trigger !== undefined && (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      )}
      <DialogContent aria-describedby={descriptionId}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription id={descriptionId}>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            انصراف
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            <Trash2 aria-hidden="true" />
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
