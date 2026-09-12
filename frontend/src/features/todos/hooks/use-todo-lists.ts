import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { todoApi } from "@/lib/api";
import type {
  CreateTodoListCommand,
  UpdateTodoListCommand,
} from "@/types/todo";

const LIST_KEY = "todo-lists";
const ITEM_KEY = "todo-items";
const DASHBOARD_KEY = "dashboard";

export function useTodoLists(pageNumber = 1, pageSize = 12) {
  return useQuery({
    queryKey: [LIST_KEY, pageNumber, pageSize],
    queryFn: () => todoApi.getTodoLists({ pageNumber, pageSize }),
    placeholderData: (previous) => previous,
  });
}

export function useTodoListDetail(id: string) {
  return useQuery({
    queryKey: [LIST_KEY, id],
    queryFn: () => todoApi.getTodoListById(id),
  });
}

function useInvalidateTodoData() {
  const queryClient = useQueryClient();

  return (): void => {
    void queryClient.invalidateQueries({ queryKey: [LIST_KEY] });
    void queryClient.invalidateQueries({ queryKey: [ITEM_KEY] });
    void queryClient.invalidateQueries({ queryKey: [DASHBOARD_KEY] });
  };
}

export function useCreateTodoList() {
  const invalidate = useInvalidateTodoData();

  return useMutation({
    mutationFn: (command: CreateTodoListCommand) => todoApi.createTodoList(command),
    onSuccess: () => {
      invalidate();
      toast.success("لیست جدید ساخته شد.");
    },
  });
}

export function useUpdateTodoList() {
  const invalidate = useInvalidateTodoData();

  return useMutation({
    mutationFn: ({ id, command }: { id: string; command: UpdateTodoListCommand }) =>
      todoApi.updateTodoList(id, command),
    onSuccess: () => {
      invalidate();
      toast.success("لیست به‌روزرسانی شد.");
    },
  });
}

export function useDeleteTodoList() {
  const invalidate = useInvalidateTodoData();

  return useMutation({
    mutationFn: (id: string) => todoApi.deleteTodoList(id),
    onSuccess: () => {
      invalidate();
      toast.success("لیست و کارهای آن حذف شد.");
    },
  });
}
