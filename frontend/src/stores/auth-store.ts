import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AuthSession, User } from "@/types/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  setSession: (session: AuthSession) => void;
  logout: () => void;
}

/** Global client-side auth session, persisted to localStorage. */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setSession: ({ user, token }: AuthSession) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: "todo-app:session" },
  ),
);
