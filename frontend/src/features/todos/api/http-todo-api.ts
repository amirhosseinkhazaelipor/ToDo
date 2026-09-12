import type { AxiosInstance } from "axios";

import type {
  CreateTodoItemCommand,
  CreateTodoListCommand,
  CreatedResource,
  DashboardStats,
  PaginatedList,
  TodoItem,
  TodoItemsQuery,
  TodoListDetail,
  TodoListSummary,
  UpdateTodoItemCommand,
  UpdateTodoListCommand,
} from "@/types/todo";

import type { TodoApiClient } from "./todo-api.contract";
import { computeDashboardStats } from "./todo-api.helpers";

/**
 * Real HTTP implementation against the .NET backend.
 * Routes and payloads mirror the TodoApp.Api controllers exactly.
 */
export function createHttpTodoApi(client: AxiosInstance): TodoApiClient {
  return {
    async getTodoLists(query: {
      pageNumber?: number;
      pageSize?: number;
    }): Promise<PaginatedList<TodoListSummary>> {
      const { data } = await client.get<PaginatedList<TodoListSummary>>(
        "/todo-lists",
        { params: query },
      );

      return data;
    },

    async getTodoListById(id: string): Promise<TodoListDetail> {
      const { data } = await client.get<TodoListDetail>(`/todo-lists/${id}`);

      return data;
    },

    async createTodoList(command: CreateTodoListCommand): Promise<CreatedResource> {
      const { data } = await client.post<CreatedResource>("/todo-lists", command);

      return data;
    },

    async updateTodoList(id: string, command: UpdateTodoListCommand): Promise<void> {
      await client.put(`/todo-lists/${id}`, command);
    },

    async deleteTodoList(id: string): Promise<void> {
      await client.delete(`/todo-lists/${id}`);
    },

    async getTodoItems(query: TodoItemsQuery): Promise<PaginatedList<TodoItem>> {
      const { data } = await client.get<PaginatedList<TodoItem>>("/todo-items", {
        params: query,
      });

      return data;
    },

    async getTodoItemById(id: string): Promise<TodoItem> {
      const { data } = await client.get<TodoItem>(`/todo-items/${id}`);

      return data;
    },

    async createTodoItem(command: CreateTodoItemCommand): Promise<CreatedResource> {
      const { data } = await client.post<CreatedResource>("/todo-items", command);

      return data;
    },

    async updateTodoItem(id: string, command: UpdateTodoItemCommand): Promise<void> {
      await client.put(`/todo-items/${id}`, command);
    },

    async deleteTodoItem(id: string): Promise<void> {
      await client.delete(`/todo-items/${id}`);
    },

    async completeTodoItem(id: string): Promise<void> {
      await client.post(`/todo-items/${id}/complete`);
    },

    async reopenTodoItem(id: string): Promise<void> {
      await client.post(`/todo-items/${id}/reopen`);
    },

    /**
     * The backend does not expose a dashboard endpoint yet, so in real mode
     * the stats are composed client-side. Swap for GET /api/dashboard when
     * the endpoint exists.
     */
    async getDashboard(): Promise<DashboardStats> {
      const [lists, items] = await Promise.all([
        client.get<PaginatedList<TodoListSummary>>("/todo-lists", {
          params: { pageNumber: 1, pageSize: 100 },
        }),
        client.get<PaginatedList<TodoItem>>("/todo-items", {
          params: { pageNumber: 1, pageSize: 100 },
        }),
      ]);

      return computeDashboardStats(lists.data.items, items.data.items);
    },
  };
}
