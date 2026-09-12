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
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateTodoItem,
  useUpdateTodoItem,
} from "@/features/todos/hooks/use-todo-items";
import { useTodoLists } from "@/features/todos/hooks/use-todo-lists";
import type { TodoItem } from "@/types";
import { dateInputToUtcIso, utcIsoToDateInput } from "@/utils/date";
import { getErrorMessage } from "@/utils/errors";
import { PRIORITY_ORDER, getPriorityStyle } from "@/utils/priority";

const taskSchema = z.object({
  listId: z.string().min(1, "انتخاب لیست الزامی است."),
  title: z.string().min(1, "عنوان الزامی است.").max(200, "عنوان حداکثر ۲۰۰ کاراکتر است."),
  note: z.string().max(2000, "یادداشت حداکثر ۲۰۰۰ کاراکتر است.").optional(),
  priority: z.enum(["None", "Low", "Medium", "High"]),
  dueDate: z
    .string()
    .optional()
    .refine((value) => value === undefined || value === "" || !Number.isNaN(new Date(value).getTime()), {
      message: "تاریخ نامعتبر است.",
    }),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** اگر داده شود، دیالوگ در حالت ویرایش کار می‌کند */
  task?: TodoItem;
  /** لیست پیش‌فرض هنگام ایجاد */
  defaultListId?: string;
}

export function TaskFormDialog({
  open,
  onOpenChange,
  task,
  defaultListId,
}: TaskFormDialogProps) {
  const createTask = useCreateTodoItem();
  const updateTask = useUpdateTodoItem();
  const { data: listsData } = useTodoLists(1, 100);
  const isEditMode = task !== undefined;
  const isPending = createTask.isPending || updateTask.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      listId: defaultListId ?? "",
      title: "",
      note: "",
      priority: "None",
      dueDate: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        listId: task?.listId ?? defaultListId ?? "",
        title: task?.title ?? "",
        note: task?.note ?? "",
        priority: task?.priority ?? "None",
        dueDate: utcIsoToDateInput(task?.dueDateUtc ?? null),
      });
    }
  }, [open, task, defaultListId, reset]);

  const lists = listsData?.items ?? [];

  const onSubmit = (values: TaskFormValues): void => {
    const dueDateUtc = dateInputToUtcIso(values.dueDate ?? "");

    if (isEditMode && task !== undefined) {
      updateTask.mutate(
        {
          id: task.id,
          command: {
            title: values.title,
            note: values.note === "" ? null : values.note ?? null,
            priority: values.priority,
            dueDateUtc: dueDateUtc ?? null,
          },
        },
        { onSuccess: () => onOpenChange(false) },
      );
      return;
    }

    createTask.mutate(
      {
        listId: values.listId,
        title: values.title,
        note: values.note === "" ? null : values.note ?? null,
        priority: values.priority,
        dueDateUtc: dueDateUtc ?? null,
      },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "ویرایش کار" : "کار جدید"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "جزئیات کار را تغییر دهید." : "یک کار جدید به لیست اضافه کنید."}
          </DialogDescription>
        </DialogHeader>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          aria-busy={isPending}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-title" invalid={errors.title !== undefined}>
              عنوان
            </Label>
            <Input
              id="task-title"
              placeholder="مثلاً تماس با مشتری"
              invalid={errors.title !== undefined}
              {...register("title")}
            />
            <InlineError message={errors.title?.message} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-note" invalid={errors.note !== undefined}>
              یادداشت (اختیاری)
            </Label>
            <Textarea
              id="task-note"
              placeholder="جزئیات بیشتر…"
              invalid={errors.note !== undefined}
              {...register("note")}
            />
            <InlineError message={errors.note?.message} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label invalid={errors.listId !== undefined}>لیست</Label>
              <Select
                aria-label="لیست"
                disabled={isEditMode}
                invalid={errors.listId !== undefined}
                {...register("listId")}
              >
                <option value="">انتخاب کنید…</option>
                {lists.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.title}
                  </option>
                ))}
              </Select>
              <InlineError message={errors.listId?.message} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label invalid={errors.priority !== undefined}>اهمیت</Label>
              <Select aria-label="اهمیت" {...register("priority")}>
                {PRIORITY_ORDER.map((priority) => (
                  <option key={priority} value={priority}>
                    {getPriorityStyle(priority).label}
                  </option>
                ))}
              </Select>
              <InlineError message={errors.priority?.message} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-due-date" invalid={errors.dueDate !== undefined}>
              مهلت (اختیاری)
            </Label>
            <Input
              id="task-due-date"
              type="date"
              invalid={errors.dueDate !== undefined}
              {...register("dueDate")}
            />
            <InlineError message={errors.dueDate?.message} />
          </div>

          {createTask.isError && (
            <InlineError message={getErrorMessage(createTask.error, "ایجاد کار ناموفق بود.")} />
          )}
          {updateTask.isError && (
            <InlineError message={getErrorMessage(updateTask.error, "ویرایش کار ناموفق بود.")} />
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              انصراف
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 aria-hidden="true" className="animate-spin" />}
              {isEditMode ? "ذخیره تغییرات" : "افزودن کار"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
