import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { todoApi } from "@/lib/api";
import type {
  CreateTodoItemCommand,
  TodoItemsQuery,
  UpdateTodoItemCommand,
} from "@/types/todo";

const ITEM_KEY = "todo-items";
const DASHBOARD_KEY = "dashboard";

export function useTodoItems(query: TodoItemsQuery) {
  return useQuery({
    queryKey: [ITEM_KEY, query],
    queryFn: () => todoApi.getTodoItems(query),
    placeholderData: (previous) => previous,
  });
}

function useInvalidateItems() {
  const queryClient = useQueryClient();

  return (): void => {
    void queryClient.invalidateQueries({ queryKey: [ITEM_KEY] });
    void queryClient.invalidateQueries({ queryKey: [DASHBOARD_KEY] });
  };
}

export function useCreateTodoItem() {
  const invalidate = useInvalidateItems();

  return useMutation({
    mutationFn: (command: CreateTodoItemCommand) => todoApi.createTodoItem(command),
    onSuccess: () => {
      invalidate();
      toast.success("کار جدید اضافه شد.");
    },
  });
}

export function useUpdateTodoItem() {
  const invalidate = useInvalidateItems();

  return useMutation({
    mutationFn: ({ id, command }: { id: string; command: UpdateTodoItemCommand }) =>
      todoApi.updateTodoItem(id, command),
    onSuccess: () => {
      invalidate();
      toast.success("کار به‌روزرسانی شد.");
    },
  });
}

export function useDeleteTodoItem() {
  const invalidate = useInvalidateItems();

  return useMutation({
    mutationFn: (id: string) => todoApi.deleteTodoItem(id),
    onSuccess: () => {
      invalidate();
      toast.success("کار حذف شد.");
    },
  });
}

/** تکمیل یا بازگشایی کار (بر اساس وضعیت فعلی) */
export function useToggleTodoItem() {
  const invalidate = useInvalidateItems();

  return useMutation({
    mutationFn: ({ id, done }: { id: string; done: boolean }) =>
      done ? todoApi.reopenTodoItem(id) : todoApi.completeTodoItem(id),
    onSuccess: (_result, variables) => {
      invalidate();
      toast.success(variables.done ? "کار بازگشایی شد." : "آفرین! کار انجام شد. 🎉");
    },
  });
}
