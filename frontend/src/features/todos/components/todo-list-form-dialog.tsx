import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { z } from "zod";

import { InlineError } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateTodoList,
  useUpdateTodoList,
} from "@/features/todos/hooks/use-todo-lists";
import type { TodoListSummary } from "@/types";
import { getErrorMessage } from "@/utils/errors";
import { LIST_COLOUR_PALETTE } from "@/utils/priority";
import { cn } from "@/utils/cn";

const COLOUR_PATTERN = /^#[0-9a-fA-F]{6}$/;

const listSchema = z.object({
  title: z
    .string()
    .min(1, "عنوان الزامی است.")
    .max(100, "عنوان حداکثر ۱۰۰ کاراکتر است."),
  colour: z
    .string()
    .regex(COLOUR_PATTERN, "رنگ باید با فرمت #RRGGBB باشد."),
});

type ListFormValues = z.infer<typeof listSchema>;

interface TodoListFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** اگر داده شود، دیالوگ در حالت ویرایش کار می‌کند */
  list?: TodoListSummary;
}

export function TodoListFormDialog({
  open,
  onOpenChange,
  list,
}: TodoListFormDialogProps) {
  const createList = useCreateTodoList();
  const updateList = useUpdateTodoList();
  const isEditMode = list !== undefined;
  const isPending = createList.isPending || updateList.isPending;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ListFormValues>({
    resolver: zodResolver(listSchema),
    defaultValues: { title: "", colour: (LIST_COLOUR_PALETTE[0] ?? "#4F46E5") },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: list?.title ?? "",
        colour: list?.colour ?? (LIST_COLOUR_PALETTE[0] ?? "#4F46E5"),
      });
    }
  }, [open, list, reset]);

  const selectedColour = watch("colour");

  const onSubmit = (values: ListFormValues): void => {
    if (isEditMode) {
      updateList.mutate(
        { id: list.id, command: values },
        { onSuccess: () => onOpenChange(false) },
      );
      return;
    }

    createList.mutate(values, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "ویرایش لیست" : "لیست جدید"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "عنوان و رنگ لیست را تغییر دهید."
              : "یک لیست برای دسته‌بندی کارهایتان بسازید."}
          </DialogDescription>
        </DialogHeader>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          aria-busy={isPending}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="list-title" invalid={errors.title !== undefined}>
              عنوان
            </Label>
            <Input
              id="list-title"
              placeholder="مثلاً کارها"
              invalid={errors.title !== undefined}
              {...register("title")}
            />
            <InlineError message={errors.title?.message} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label invalid={errors.colour !== undefined}>رنگ</Label>
            <div className="flex flex-wrap items-center gap-2">
              {LIST_COLOUR_PALETTE.map((colour) => (
                <button
                  key={colour}
                  type="button"
                  aria-label={`انتخاب رنگ ${colour}`}
                  aria-pressed={selectedColour.toUpperCase() === colour}
                  onClick={() => setValue("colour", colour)}
                  style={{ backgroundColor: colour }}
                  className={cn(
                    "size-7 rounded-full border-2 transition-transform hover:scale-110",
                    selectedColour.toUpperCase() === colour
                      ? "border-foreground ring-2 ring-ring/50"
                      : "border-transparent",
                  )}
                />
              ))}
              <input
                type="color"
                aria-label="انتخاب رنگ دلخواه"
                value={selectedColour}
                onChange={(event) => setValue("colour", event.target.value)}
                className="size-7 cursor-pointer rounded-md border border-input bg-transparent p-0.5"
              />
            </div>
            <input type="hidden" {...register("colour")} />
            <InlineError message={errors.colour?.message} />
          </div>

          {createList.isError && (
            <InlineError
              message={getErrorMessage(createList.error, "ایجاد لیست ناموفق بود.")}
            />
          )}
          {updateList.isError && (
            <InlineError
              message={getErrorMessage(updateList.error, "ویرایش لیست ناموفق بود.")}
            />
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              انصراف
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 aria-hidden="true" className="animate-spin" />}
              {isEditMode ? "ذخیره تغییرات" : "افزودن لیست"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
