import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { authApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import type { LoginRequest, RegisterRequest } from "@/types/auth";

/** ورود کاربر و ذخیره سشن */
export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (request: LoginRequest) => authApi.login(request),
    onSuccess: (session) => {
      setSession(session);
      toast.success(`خوش آمدید، ${session.user.name}!`);
      navigate("/", { replace: true });
    },
  });
}

/** ثبت‌نام کاربر جدید و ورود خودکار */
export function useRegister() {
  const setSession = useAuthStore((state) => state.setSession);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (request: RegisterRequest) => authApi.register(request),
    onSuccess: (session) => {
      setSession(session);
      toast.success("حساب شما ساخته شد. خوش آمدید!");
      navigate("/", { replace: true });
    },
  });
}
