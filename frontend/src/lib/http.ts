import axios, { type AxiosInstance } from "axios";

import { useAuthStore } from "@/stores/auth-store";

/**
 * Pre-configured axios instance for the real .NET backend.
 * Used only when `VITE_API_MODE=real`; the mock service layer bypasses it.
 */
export function createHttpClient(baseUrl: string): AxiosInstance {
  const client = axios.create({
    baseURL: baseUrl,
    timeout: 15_000,
    headers: { "Content-Type": "application/json" },
  });

  client.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;

    if (token !== null) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      // Expired/invalid session → drop it and go back to the login screen.
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        useAuthStore.getState().logout();
        window.location.assign("/login");
      }

      return Promise.reject(error);
    },
  );

  return client;
}
