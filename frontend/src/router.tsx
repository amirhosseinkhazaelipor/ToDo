import { createBrowserRouter } from "react-router";

import { GuestOnly, RequireAuth } from "@/components/common/route-guards";
import { AppLayout } from "@/components/layout/AppLayout";
import DashboardPage from "@/pages/DashboardPage";
import ListsPage from "@/pages/ListsPage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import RegisterPage from "@/pages/RegisterPage";
import TasksPage from "@/pages/TasksPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: (
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        ),
      },
      {
        path: "/lists",
        element: (
          <RequireAuth>
            <ListsPage />
          </RequireAuth>
        ),
      },
      {
        path: "/tasks",
        element: (
          <RequireAuth>
            <TasksPage />
          </RequireAuth>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <GuestOnly>
        <LoginPage />
      </GuestOnly>
    ),
  },
  {
    path: "/register",
    element: (
      <GuestOnly>
        <RegisterPage />
      </GuestOnly>
    ),
  },
  { path: "*", element: <NotFoundPage /> },
]);
