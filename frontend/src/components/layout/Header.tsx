import { useNavigate } from "react-router";
import { LogOut, Menu, UserRound } from "lucide-react";
import { toast } from "sonner";

import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/auth-store";
import { useUiStore } from "@/stores/ui-store";

export function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const toggleMobileSidebar = useUiStore((state) => state.toggleMobileSidebar);
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout();
    toast.success("با موفقیت خارج شدید.");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b bg-background/90 px-4 backdrop-blur">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="باز کردن منو"
          onClick={toggleMobileSidebar}
        >
          <Menu aria-hidden="true" />
        </Button>
      </div>

      <div className="flex items-center gap-1.5">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2" aria-label="منوی کاربر">
              <span
                aria-hidden="true"
                className="flex size-7 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary"
              >
                {user?.name.charAt(0)}
              </span>
              <span className="hidden text-sm sm:inline">{user?.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-56">
            <DropdownMenuLabel className="flex items-center gap-2">
              <UserRound aria-hidden="true" className="size-4" />
              <span>{user?.name}</span>
            </DropdownMenuLabel>
            <DropdownMenuLabel className="truncate text-xs">
              {user?.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout}>
              <LogOut aria-hidden="true" />
              خروج از حساب
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
