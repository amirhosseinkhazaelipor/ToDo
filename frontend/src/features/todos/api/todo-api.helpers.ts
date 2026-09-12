import type {
  DashboardStats,
  PaginatedList,
  TodoItem,
  TodoListSummary,
} from "@/types/todo";

/** Computes dashboard numbers from full collections (shared by both API impls). */
export function computeDashboardStats(
  lists: readonly TodoListSummary[],
  items: readonly TodoItem[],
): DashboardStats {
  const totalTasks = items.length;
  const doneTasks = items.filter((item) => item.done).length;
  const openTasks = totalTasks - doneTasks;
  const now = Date.now();
  const overdueTasks = items.filter(
    (item) =>
      !item.done &&
      item.dueDateUtc !== null &&
      new Date(item.dueDateUtc).getTime() < now,
  ).length;

  const tasksPerList = lists.map((list) => {
    const listItems = items.filter((item) => item.listId === list.id);

    return {
      listId: list.id,
      listTitle: list.title,
      colour: list.colour,
      totalCount: listItems.length,
      doneCount: listItems.filter((item) => item.done).length,
    };
  });

  const upcomingTasks = items
    .filter(
      (item) =>
        !item.done &&
        item.dueDateUtc !== null &&
        new Date(item.dueDateUtc).getTime() >= now,
    )
    .sort(
      (a, b) =>
        new Date(a.dueDateUtc ?? 0).getTime() -
        new Date(b.dueDateUtc ?? 0).getTime(),
    )
    .slice(0, 5);

  return {
    totalTasks,
    doneTasks,
    openTasks,
    overdueTasks,
    completionRate: totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100),
    tasksPerList,
    upcomingTasks,
  };
}

/** Builds a paged slice of a collection (used by the mock API). */
export function paginate<T>(
  source: readonly T[],
  pageNumber: number,
  pageSize: number,
): PaginatedList<T> {
  const totalCount = source.length;
  const totalPages = pageSize > 0 ? Math.ceil(totalCount / pageSize) : 0;
  const start = (pageNumber - 1) * pageSize;

  return {
    items: source.slice(start, start + pageSize),
    pageNumber,
    pageSize,
    totalCount,
    totalPages,
    hasPreviousPage: pageNumber > 1,
    hasNextPage: pageNumber < totalPages,
  };
}
