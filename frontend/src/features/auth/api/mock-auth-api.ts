import type {
  AuthSession,
  LoginRequest,
  RegisterRequest,
  User,
} from "@/types/auth";

import type { AuthApiClient } from "./auth-api.contract";

interface StoredUser extends User {
  password: string;
}

const USERS_STORAGE_KEY = "todo-app:users";
const TOKEN_STORAGE_KEY = "todo-app:token";
const SIMULATED_DELAY_MS = 500;

/**
 * Mock auth API: keeps users in localStorage and simulates network latency.
 * This is demo-only — replace with the real backend for production use.
 */
export function createMockAuthApi(): AuthApiClient {
  const loadUsers = (): StoredUser[] => {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);

    if (raw === null) {
      const seedUser: StoredUser = {
        id: crypto.randomUUID(),
        name: "کاربر نمونه",
        email: "demo@todo.ir",
        password: "12345678",
      };
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([seedUser]));

      return [seedUser];
    }

    return JSON.parse(raw) as StoredUser[];
  };

  const persistUsers = (users: StoredUser[]): void => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  const createSession = (user: User): AuthSession => {
    const token = `mock-jwt.${btoa(user.email)}.${Date.now()}`;
    localStorage.setItem(TOKEN_STORAGE_KEY, token);

    return { user, token };
  };

  const wait = (): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));

  return {
    async login(request: LoginRequest): Promise<AuthSession> {
      await wait();

      const users = loadUsers();
      const user = users.find(
        (candidate) =>
          candidate.email.toLowerCase() === request.email.toLowerCase() &&
          candidate.password === request.password,
      );

      if (user === undefined) {
        throw new Error("ایمیل یا رمز عبور نادرست است.");
      }

      return createSession({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    },

    async register(request: RegisterRequest): Promise<AuthSession> {
      await wait();

      const users = loadUsers();
      const emailTaken = users.some(
        (candidate) =>
          candidate.email.toLowerCase() === request.email.toLowerCase(),
      );

      if (emailTaken) {
        throw new Error("این ایمیل قبلاً ثبت شده است.");
      }

      const user: StoredUser = {
        id: crypto.randomUUID(),
        name: request.name,
        email: request.email,
        password: request.password,
      };

      persistUsers([...users, user]);

      return createSession({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    },
  };
}
