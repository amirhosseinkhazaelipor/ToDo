import { Navigate, useLocation } from "react-router";

import { useAuthStore } from "@/stores/auth-store";

interface RequireAuthProps {
  children: React.ReactNode;
}

/** ریدایرکت مهمان‌ها به صفحه ورود و به‌خاطر سپردن مسیر مقصد */
export function RequireAuth({ children }: RequireAuthProps) {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (user === null) {
    return (
      <Navigate to="/login" replace state={{ from: location.pathname }} />
    );
  }

  return <>{children}</>;
}

interface GuestOnlyProps {
  children: React.ReactNode;
}

/** کاربر واردشده نباید صفحات ورود/ثبت‌نام را ببیند */
export function GuestOnly({ children }: GuestOnlyProps) {
  const user = useAuthStore((state) => state.user);

  if (user !== null) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
