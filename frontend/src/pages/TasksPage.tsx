import { useMemo, useState } from "react";
import { Plus, RotateCcw, Search } from "lucide-react";

import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { PageHeader } from "@/components/common/page-header";
import { Pagination } from "@/components/common/pagination";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  TaskCard,
} from "@/features/todos/components/task-card";
import { TaskFormDialog } from "@/features/todos/components/task-form-dialog";
import {
  useDeleteTodoItem,
  useTodoItems,
  useToggleTodoItem,
} from "@/features/todos/hooks/use-todo-items";
import { useTodoLists } from "@/features/todos/hooks/use-todo-lists";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTaskFiltersStore } from "@/stores/task-filters-store";
import type { PriorityLevel, TodoItem } from "@/types";
import { getErrorMessage } from "@/utils/errors";
import { PRIORITY_ORDER, getPriorityStyle } from "@/utils/priority";

const PAGE_SIZE = 10;

export default function TasksPage() {
  useDocumentTitle("کارها");

  const filters = useTaskFiltersStore();
  const debouncedSearch = useDebouncedValue(filters.search, 350);

  const { data: listsData } = useTodoLists(1, 100);
  const listsById = useMemo(() => {
    const map = new Map<string, { id: string; title: string; colour: string }>();
    listsData?.items.forEach((list) =>
      map.set(list.id, { id: list.id, title: list.title, colour: list.colour }),
    );

    return map;
  }, [listsData]);

  const query = useTodoItems({
    pageNumber: filters.pageNumber,
    pageSize: PAGE_SIZE,
    listId: filters.listId === "all" ? undefined : filters.listId,
    done:
      filters.status === "all" ? undefined : filters.status === "done",
    priority: filters.priority === "all" ? undefined : filters.priority,
    search: debouncedSearch.trim() === "" ? undefined : debouncedSearch.trim(),
  });

  const toggleTask = useToggleTodoItem();
  const deleteTask = useDeleteTodoItem();

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TodoItem | undefined>();
  const [deletingTask, setDeletingTask] = useState<TodoItem | undefined>();

  const hasActiveFilters =
    filters.search !== "" ||
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.listId !== "all";

  const openCreateDialog = (): void => {
    setEditingTask(undefined);
    setFormDialogOpen(true);
  };

  const openEditDialog = (task: TodoItem): void => {
    setEditingTask(task);
    setFormDialogOpen(true);
  };

  return (
    <>
      <PageHeader
        title="کارها"
        description="جستجو، فیلتر و مدیریت همه کارها"
        action={
          <Button onClick={openCreateDialog}>
            <Plus aria-hidden="true" />
            کار جدید
          </Button>
        }
      />

      {/* نوار ابزار فیلترها */}
      <section
        aria-label="فیلترها"
        className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground"
          />
          <Input
            type="search"
            placeholder="جستجو در عنوان کارها…"
            aria-label="جستجو"
            className="ps-9"
            value={filters.search}
            onChange={(event) => filters.setSearch(event.target.value)}
          />
        </div>

        <Select
          aria-label="فیلتر وضعیت"
          value={filters.status}
          onChange={(event) =>
            filters.setStatus(event.target.value as typeof filters.status)
          }
        >
          <option value="all">همه وضعیت‌ها</option>
          <option value="open">باز</option>
          <option value="done">انجام‌شده</option>
        </Select>

        <Select
          aria-label="فیلتر اهمیت"
          value={filters.priority}
          onChange={(event) =>
            filters.setPriority(event.target.value as PriorityLevel | "all")
          }
        >
          <option value="all">همه اهمیت‌ها</option>
          {PRIORITY_ORDER.map((priority) => (
            <option key={priority} value={priority}>
              {getPriorityStyle(priority).label}
            </option>
          ))}
        </Select>

        <div className="flex gap-2">
          <Select
            aria-label="فیلتر لیست"
            value={filters.listId}
            onChange={(event) => filters.setListId(event.target.value)}
            className="flex-1"
          >
            <option value="all">همه لیست‌ها</option>
            {listsData?.items.map((list) => (
              <option key={list.id} value={list.id}>
                {list.title}
              </option>
            ))}
          </Select>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="icon"
              aria-label="پاک کردن فیلترها"
              onClick={filters.reset}
            >
              <RotateCcw aria-hidden="true" />
            </Button>
          )}
        </div>
      </section>

      {query.isError ? (
        <ErrorState
          message={getErrorMessage(query.error, "دریافت کارها ناموفق بود.")}
          onRetry={() => void query.refetch()}
        />
      ) : query.isPending ? (
        <LoadingState />
      ) : query.data.items.length === 0 ? (
        <EmptyState
          title={hasActiveFilters ? "نتیجه‌ای یافت نشد" : "هنوز کاری ندارید"}
          description={
            hasActiveFilters
              ? "فیلترها را تغییر دهید یا جستجوی دیگری امتحان کنید."
              : "اولین کار خود را اضافه کنید."
          }
          action={
            hasActiveFilters ? (
              <Button size="sm" variant="outline" onClick={filters.reset}>
                پاک کردن فیلترها
              </Button>
            ) : (
              <Button size="sm" onClick={openCreateDialog}>
                <Plus aria-hidden="true" />
                افزودن کار
              </Button>
            )
          }
        />
      ) : (
        <div className="flex flex-col gap-5">
          <ul aria-label="فهرست کارها" className="flex flex-col gap-3">
            {query.data.items.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                list={listsById.get(task.listId)}
                onToggle={(item) =>
                  toggleTask.mutate({ id: item.id, done: item.done })
                }
                onEdit={openEditDialog}
                onDelete={setDeletingTask}
              />
            ))}
          </ul>

          <Pagination
            pageNumber={query.data.pageNumber}
            totalPages={query.data.totalPages}
            totalCount={query.data.totalCount}
            onPageChange={filters.setPageNumber}
          />
        </div>
      )}

      <TaskFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        task={editingTask}
        defaultListId={filters.listId === "all" ? undefined : filters.listId}
      />

      <ConfirmDialog
        open={deletingTask !== undefined}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingTask(undefined);
          }
        }}
        title="حذف کار"
        description={`کار «${deletingTask?.title ?? ""}» حذف می‌شود. این عمل بازگشت‌پذیر نیست.`}
        onConfirm={() => {
          if (deletingTask !== undefined) {
            deleteTask.mutate(deletingTask.id);
          }
        }}
      />
    </>
  );
}
