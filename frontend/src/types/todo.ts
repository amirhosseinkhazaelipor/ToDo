/** Priority of a task — mirrors the backend `PriorityLevel` enum. */
export type PriorityLevel = "None" | "Low" | "Medium" | "High";

/** Generic paged envelope — mirrors the backend `PaginatedList<T>`. */
export interface PaginatedList<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/** Compact list representation — mirrors backend `TodoListSummaryDto`. */
export interface TodoListSummary {
  id: string;
  title: string;
  colour: string;
  itemCount: number;
  createdAtUtc: string;
}

/** A single task — mirrors backend `TodoItemDto`. */
export interface TodoItem {
  id: string;
  listId: string;
  title: string;
  note: string | null;
  priority: PriorityLevel;
  dueDateUtc: string | null;
  done: boolean;
  completedAtUtc: string | null;
}

/** Full list with its tasks — mirrors backend `TodoListDto`. */
export interface TodoListDetail {
  id: string;
  title: string;
  colour: string;
  createdAtUtc: string;
  items: TodoItem[];
}

/** Query parameters of `GET /api/todo-items`. */
export interface TodoItemsQuery {
  pageNumber?: number;
  pageSize?: number;
  listId?: string;
  done?: boolean;
  priority?: PriorityLevel;
  overdue?: boolean;
  search?: string;
}

export interface CreateTodoListCommand {
  title: string;
  colour: string;
}

export interface UpdateTodoListCommand {
  title: string;
  colour: string;
}

export interface CreateTodoItemCommand {
  listId: string;
  title: string;
  note?: string | null;
  priority: PriorityLevel;
  dueDateUtc?: string | null;
}

export interface UpdateTodoItemCommand {
  title: string;
  note?: string | null;
  priority: PriorityLevel;
  dueDateUtc?: string | null;
}

export interface CreatedResource {
  id: string;
}

/** Data of the dashboard screen. */
export interface DashboardStats {
  totalTasks: number;
  doneTasks: number;
  openTasks: number;
  overdueTasks: number;
  completionRate: number;
  tasksPerList: TasksPerListStat[];
  upcomingTasks: TodoItem[];
}

export interface TasksPerListStat {
  listId: string;
  listTitle: string;
  colour: string;
  totalCount: number;
  doneCount: number;
}
