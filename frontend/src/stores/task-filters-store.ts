import { create } from "zustand";

import type { PriorityLevel } from "@/types";

export type TaskStatusFilter = "all" | "open" | "done";

interface TaskFiltersState {
  search: string;
  status: TaskStatusFilter;
  priority: PriorityLevel | "all";
  listId: string;
  pageNumber: number;
  setSearch: (search: string) => void;
  setStatus: (status: TaskStatusFilter) => void;
  setPriority: (priority: PriorityLevel | "all") => void;
  setListId: (listId: string) => void;
  setPageNumber: (pageNumber: number) => void;
  reset: () => void;
}

const INITIAL_STATE = {
  search: "",
  status: "all" as TaskStatusFilter,
  priority: "all" as PriorityLevel | "all",
  listId: "all",
  pageNumber: 1,
};

/**
 * Global client-side filters of the tasks page.
 * Every filter change (except paging) jumps back to page 1.
 */
export const useTaskFiltersStore = create<TaskFiltersState>()((set) => ({
  ...INITIAL_STATE,
  setSearch: (search: string) => set({ search, pageNumber: 1 }),
  setStatus: (status: TaskStatusFilter) => set({ status, pageNumber: 1 }),
  setPriority: (priority: PriorityLevel | "all") =>
    set({ priority, pageNumber: 1 }),
  setListId: (listId: string) => set({ listId, pageNumber: 1 }),
  setPageNumber: (pageNumber: number) => set({ pageNumber }),
  reset: () => set({ ...INITIAL_STATE }),
}));
