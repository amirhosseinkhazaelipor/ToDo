import { NavLink } from "react-router";
import { ClipboardList, LayoutDashboard, ListTodo } from "lucide-react";

import { useUiStore } from "@/stores/ui-store";
import { cn } from "@/utils/cn";

const NAV_ITEMS: { to: string; label: string; icon: typeof LayoutDashboard }[] = [
  { to: "/", label: "داشبورد", icon: LayoutDashboard },
  { to: "/lists", label: "لیست‌ها", icon: ListTodo },
  { to: "/tasks", label: "کارها", icon: ClipboardList },
];

interface SidebarNavProps {
  onNavigate?: () => void;
  className?: string;
}

/** منوی اصلی — هم در سایدبار دسکتاپ و هم در دراور موبایل استفاده می‌شود */
export function SidebarNav({ onNavigate, className }: SidebarNavProps) {
  return (
    <nav aria-label="منوی اصلی" className={cn("flex flex-col gap-1", className)}>
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )
          }
        >
          <Icon aria-hidden="true" className="size-5" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

/** سایدبار دسکتاپ */
export function Sidebar() {
  const isMobileSidebarOpen = useUiStore((state) => state.isMobileSidebarOpen);
  const setMobileSidebarOpen = useUiStore((state) => state.setMobileSidebarOpen);

  return (
    <>
      {/* دسکتاپ */}
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-e bg-card p-4 md:flex">
        <BrandMark />
        <SidebarNav className="mt-6" />
        <p className="mt-auto text-center text-xs text-muted-foreground">
          نسخه {`۱.۰.۰`}
        </p>
      </aside>

      {/* دراور موبایل */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          role="presentation"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
          <aside
            className="absolute inset-y-0 right-0 w-64 border-e bg-card p-4 shadow-lg"
            aria-label="منوی موبایل"
          >
            <BrandMark />
            <SidebarNav className="mt-6" onNavigate={() => setMobileSidebarOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}

export function BrandMark() {
  return (
    <div className="flex items-center gap-2 px-1">
      <span
        aria-hidden="true"
        className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"
      >
        <ListTodo className="size-5" />
      </span>
      <span className="text-lg font-bold">تودو</span>
    </div>
  );
}
