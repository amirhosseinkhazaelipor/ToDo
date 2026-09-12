import type {
  CreateTodoItemCommand,
  CreateTodoListCommand,
  DashboardStats,
  PaginatedList,
  TodoItem,
  TodoItemsQuery,
  TodoListDetail,
  TodoListSummary,
  UpdateTodoItemCommand,
  UpdateTodoListCommand,
} from "@/types/todo";

/**
 * Contract of the todo API — a 1:1 mirror of the .NET backend endpoints.
 * The UI only depends on this interface, so switching between the mock
 * implementation and the real HTTP client is invisible to the components.
 */
export interface TodoApiClient {
  getTodoLists(query: {
    pageNumber?: number;
    pageSize?: number;
  }): Promise<PaginatedList<TodoListSummary>>;

  getTodoListById(id: string): Promise<TodoListDetail>;

  createTodoList(command: CreateTodoListCommand): Promise<{ id: string }>;

  updateTodoList(id: string, command: UpdateTodoListCommand): Promise<void>;

  deleteTodoList(id: string): Promise<void>;

  getTodoItems(query: TodoItemsQuery): Promise<PaginatedList<TodoItem>>;

  getTodoItemById(id: string): Promise<TodoItem>;

  createTodoItem(command: CreateTodoItemCommand): Promise<{ id: string }>;

  updateTodoItem(id: string, command: UpdateTodoItemCommand): Promise<void>;

  deleteTodoItem(id: string): Promise<void>;

  completeTodoItem(id: string): Promise<void>;

  reopenTodoItem(id: string): Promise<void>;

  getDashboard(): Promise<DashboardStats>;
}
