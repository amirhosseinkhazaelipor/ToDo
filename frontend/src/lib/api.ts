import { createHttpClient } from "@/lib/http";

import { createHttpAuthApi } from "@/features/auth/api/http-auth-api";
import { createMockAuthApi } from "@/features/auth/api/mock-auth-api";
import type { AuthApiClient } from "@/features/auth/api/auth-api.contract";
import { createHttpTodoApi } from "@/features/todos/api/http-todo-api";
import { createMockTodoApi } from "@/features/todos/api/mock-todo-api";
import type { TodoApiClient } from "@/features/todos/api/todo-api.contract";

/**
 * Service-layer composition root.
 *
 * `VITE_API_MODE=mock` (default) → in-memory data with simulated latency.
 * `VITE_API_MODE=real`           → axios calls to the .NET backend.
 *
 * Components only see the interfaces (`TodoApiClient` / `AuthApiClient`),
 * so switching modes (or swapping in a real server later) is a one-line change.
 */
const apiMode = import.meta.env.VITE_API_MODE ?? "mock";

const httpClient = createHttpClient(
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5199/api",
);

export const todoApi: TodoApiClient =
  apiMode === "real" ? createHttpTodoApi(httpClient) : createMockTodoApi();

export const authApi: AuthApiClient =
  apiMode === "real" ? createHttpAuthApi(httpClient) : createMockAuthApi();
