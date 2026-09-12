import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";

import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { PageHeader } from "@/components/common/page-header";
import { Pagination } from "@/components/common/pagination";
import { EmptyState, ErrorState } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TodoListFormDialog,
} from "@/features/todos/components/todo-list-form-dialog";
import {
  useDeleteTodoList,
  useTodoLists,
} from "@/features/todos/hooks/use-todo-lists";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTaskFiltersStore } from "@/stores/task-filters-store";
import type { TodoListSummary } from "@/types";
import { formatDate, formatNumber } from "@/utils/date";
import { getErrorMessage } from "@/utils/errors";

const PAGE_SIZE = 12;

export default function ListsPage() {
  useDocumentTitle("لیست‌ها");
  const navigate = useNavigate();
  const setListFilter = useTaskFiltersStore((state) => state.setListId);

  const [pageNumber, setPageNumber] = useState(1);
  const { data, isError, error, isPending, refetch } = useTodoLists(
    pageNumber,
    PAGE_SIZE,
  );

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingList, setEditingList] = useState<TodoListSummary | undefined>();
  const [deletingList, setDeletingList] = useState<TodoListSummary | undefined>();

  const deleteList = useDeleteTodoList();

  const openCreateDialog = (): void => {
    setEditingList(undefined);
    setFormDialogOpen(true);
  };

  const openEditDialog = (list: TodoListSummary): void => {
    setEditingList(list);
    setFormDialogOpen(true);
  };

  const viewTasks = (list: TodoListSummary): void => {
    setListFilter(list.id);
    navigate("/tasks");
  };

  return (
    <>
      <PageHeader
        title="لیست‌ها"
        description="لیست‌های خود را مدیریت کنید"
        action={
          <Button onClick={openCreateDialog}>
            <Plus aria-hidden="true" />
            لیست جدید
          </Button>
        }
      />

      {isError ? (
        <ErrorState
          message={getErrorMessage(error, "دریافت لیست‌ها ناموفق بود.")}
          onRetry={() => void refetch()}
        />
      ) : isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-36" />
          ))}
        </div>
      ) : data !== undefined && data.items.length === 0 ? (
        <EmptyState
          title="هنوز لیستی ندارید"
          description="اولین لیست خود را بسازید تا کارها را دسته‌بندی کنید."
          action={
            <Button size="sm" onClick={openCreateDialog}>
              <Plus aria-hidden="true" />
              ساخت لیست
            </Button>
          }
        />
      ) : data !== undefined ? (
        <div className="flex flex-col gap-6">
          <section
            aria-label="لیست‌های کارها"
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {data.items.map((list) => (
              <Card key={list.id} className="transition-shadow hover:shadow-md">
                <CardContent className="flex h-full flex-col gap-3 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="size-3.5 shrink-0 rounded-full"
                        style={{ backgroundColor: list.colour }}
                      />
                      <h2 className="truncate text-base font-semibold">{list.title}</h2>
                    </div>
                    <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                      {formatNumber(list.itemCount)} کار
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    ساخته‌شده در {formatDate(list.createdAtUtc)}
                  </p>

                  <div className="mt-auto flex items-center gap-1 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => viewTasks(list)}
                    >
                      مشاهده کارها
                      <ArrowLeft aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`ویرایش لیست ${list.title}`}
                      onClick={() => openEditDialog(list)}
                    >
                      <Pencil aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`حذف لیست ${list.title}`}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setDeletingList(list)}
                    >
                      <Trash2 aria-hidden="true" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>

          <Pagination
            pageNumber={data.pageNumber}
            totalPages={data.totalPages}
            totalCount={data.totalCount}
            onPageChange={setPageNumber}
          />
        </div>
      ) : null}

      <TodoListFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        list={editingList}
      />

      <ConfirmDialog
        open={deletingList !== undefined}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingList(undefined);
          }
        }}
        title="حذف لیست"
        description={`لیست «${deletingList?.title ?? ""}» و همه کارهای آن حذف می‌شوند. این عمل بازگشت‌پذیر نیست.`}
        onConfirm={() => {
          if (deletingList !== undefined) {
            deleteList.mutate(deletingList.id);
          }
        }}
      />
    </>
  );
}
