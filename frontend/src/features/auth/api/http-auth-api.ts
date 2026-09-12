import type {
  AuthSession,
  LoginRequest,
  RegisterRequest,
} from "@/types/auth";

import type { AuthApiClient } from "./auth-api.contract";
import type { AxiosInstance } from "axios";

/**
 * Real auth API backed by the .NET backend.
 * NOTE: the current backend has no auth endpoints yet — when they are added
 * (POST /api/auth/login, POST /api/auth/register), no UI code needs to change.
 */
export function createHttpAuthApi(client: AxiosInstance): AuthApiClient {
  return {
    async login(request: LoginRequest): Promise<AuthSession> {
      const { data } = await client.post<AuthSession>("/auth/login", request);
      return data;
    },

    async register(request: RegisterRequest): Promise<AuthSession> {
      const { data } = await client.post<AuthSession>("/auth/register", request);
      return data;
    },
  };
}
