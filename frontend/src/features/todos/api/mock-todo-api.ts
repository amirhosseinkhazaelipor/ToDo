import type {
  CreateTodoItemCommand,
  CreateTodoListCommand,
  PaginatedList,
  TodoItem,
  TodoItemsQuery,
  TodoListDetail,
  TodoListSummary,
  UpdateTodoItemCommand,
} from "@/types/todo";

import type { TodoApiClient } from "./todo-api.contract";
import { computeDashboardStats, paginate } from "./todo-api.helpers";

const SIMULATED_DELAY_MS = 450;

interface MockTodoList {
  id: string;
  title: string;
  colour: string;
  createdAtUtc: string;
  itemIds: string[];
}

const wait = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));

const clone = <T>(value: T): T => structuredClone(value);

const daysFromNow = (days: number): string =>
  new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

/**
 * Mock implementation of the todo API: an in-memory database seeded with
 * realistic Persian data plus an artificial latency, so every screen
 * exercises its loading / error / empty states like against a real backend.
 */
export function createMockTodoApi(): TodoApiClient {
  const lists: MockTodoList[] = [
    { id: crypto.randomUUID(), title: "شخصی", colour: "#0EA5E9", createdAtUtc: daysFromNow(-30), itemIds: [] },
    { id: crypto.randomUUID(), title: "کار", colour: "#8B5CF6", createdAtUtc: daysFromNow(-21), itemIds: [] },
    { id: crypto.randomUUID(), title: "خرید خانواده", colour: "#22C55E", createdAtUtc: daysFromNow(-9), itemIds: [] },
  ];

  const items: TodoItem[] = [];

  const addItem = (
    list: MockTodoList,
    title: string,
    priority: TodoItem["priority"],
    dueDays: number | null,
    done: boolean,
    note: string | null = null,
  ): void => {
    const item: TodoItem = {
      id: crypto.randomUUID(),
      listId: list.id,
      title,
      note,
      priority,
      dueDateUtc: dueDays === null ? null : daysFromNow(dueDays),
      done,
      completedAtUtc: done ? daysFromNow(-1) : null,
    };

    items.push(item);
    list.itemIds.push(item.id);
  };

  const personal = lists[0]!;
  const work = lists[1]!;
  const shopping = lists[2]!;

  addItem(personal, "۳۰ دقیقه پیاده‌روی روزانه", "Medium", 2, false, "هر روز ساعت ۷ صبح");
  addItem(personal, "تماس با خانواده پدربزرگ", "Low", 4, false);
  addItem(personal, "تمدید اشتراک کتابخانه", "Low", -2, false);
  addItem(personal, "مرتب کردن میز کار", "None", null, true);
  addItem(personal, "خواندن ۲۰ صفحه کتاب", "Low", 1, true);

  addItem(work, "آماده‌سازی ارائه فاز دوم", "High", 1, false, "اسلایدها در درایو تیم");
  addItem(work, "بازبینی کد_pull request تیم فرانت", "High", 0, false);
  addItem(work, "جلسه هم‌راستایی با محصول", "Medium", 3, false);
  addItem(work, "به‌روزرسانی مستندات API", "Medium", -3, false, "بخش احراز هویت باقی مانده");
  addItem(work, "رفع باگ فرم ورود", "High", -1, true);
  addItem(work, "ارسال گزارش هفتگی", "Low", 5, false);

  addItem(shopping, "خرید مواد غذایی هفته", "Medium", 1, false, "شیر، نان، میوه، برنج");
  addItem(shopping, "خرید هدیه تولد خواهر", "High", 6, false);
  addItem(shopping, "شارژ کارت شهروندی", "Low", -4, false);
  addItem(shopping, "خرید لامپ اتاق", "None", null, true);

  const toSummary = (list: MockTodoList): TodoListSummary => ({
    id: list.id,
    title: list.title,
    colour: list.colour,
    itemCount: list.itemIds.length,
    createdAtUtc: list.createdAtUtc,
  });

  const toDetail = (list: MockTodoList): TodoListDetail => {
    const listItems = list.itemIds
      .map((itemId) => items.find((item) => item.id === itemId))
      .filter((item): item is TodoItem => item !== undefined);

    return { ...toSummary(list), items: clone(listItems) };
  };

  const requireList = (id: string): MockTodoList => {
    const list = lists.find((candidate) => candidate.id === id);
    if (list === undefined) {
      throw new Error("لیست مورد نظر یافت نشد.");
    }

    return list;
  };

  const requireItem = (id: string): TodoItem => {
    const item = items.find((candidate) => candidate.id === id);
    if (item === undefined) {
      throw new Error("کار مورد نظر یافت نشد.");
    }

    return item;
  };

  return {
    async getTodoLists({ pageNumber = 1, pageSize = 20 }): Promise<PaginatedList<TodoListSummary>> {
      await wait();

      const summaries = [...lists]
        .sort(
          (a, b) =>
            new Date(b.createdAtUtc).getTime() - new Date(a.createdAtUtc).getTime(),
        )
        .map(toSummary);

      return paginate(summaries, pageNumber, pageSize);
    },

    async getTodoListById(id: string): Promise<TodoListDetail> {
      await wait();

      return clone(toDetail(requireList(id)));
    },

    async createTodoList(command: CreateTodoListCommand): Promise<{ id: string }> {
      await wait();

      const list: MockTodoList = {
        id: crypto.randomUUID(),
        title: command.title.trim(),
        colour: command.colour.toUpperCase(),
        createdAtUtc: new Date().toISOString(),
        itemIds: [],
      };

      lists.unshift(list);

      return { id: list.id };
    },

    async updateTodoList(id: string, command: { title: string; colour: string }): Promise<void> {
      await wait();

      const list = requireList(id);
      list.title = command.title.trim();
      list.colour = command.colour.toUpperCase();
    },

    async deleteTodoList(id: string): Promise<void> {
      await wait();

      const list = requireList(id);
      list.itemIds.forEach((itemId) => {
        const index = items.findIndex((item) => item.id === itemId);
        if (index !== -1) {
          items.splice(index, 1);
        }
      });

      lists.splice(lists.indexOf(list), 1);
    },

    async getTodoItems(query: TodoItemsQuery): Promise<PaginatedList<TodoItem>> {
      await wait();

      const {
        pageNumber = 1,
        pageSize = 20,
        listId,
        done,
        priority,
        overdue,
        search,
      } = query;

      const now = Date.now();

      let result = items.filter((item) => {
        if (listId !== undefined && item.listId !== listId) return false;
        if (done !== undefined && item.done !== done) return false;
        if (priority !== undefined && item.priority !== priority) return false;

        if (
          overdue === true &&
          (item.done ||
            item.dueDateUtc === null ||
            new Date(item.dueDateUtc).getTime() >= now)
        ) {
          return false;
        }

        if (search !== undefined && !item.title.includes(search.trim())) {
          return false;
        }

        return true;
      });

      result = result.sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1;

        const priorityWeight: Record<TodoItem["priority"], number> = {
          None: 0,
          Low: 1,
          Medium: 2,
          High: 3,
        };

        if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }

        return (
          new Date(a.dueDateUtc ?? "9999-12-31").getTime() -
          new Date(b.dueDateUtc ?? "9999-12-31").getTime()
        );
      });

      return paginate(clone(result), pageNumber, pageSize);
    },

    async getTodoItemById(id: string): Promise<TodoItem> {
      await wait();

      return clone(requireItem(id));
    },

    async createTodoItem(
      command: CreateTodoItemCommand,
    ): Promise<{ id: string }> {
      await wait();

      const list = requireList(command.listId);

      const item: TodoItem = {
        id: crypto.randomUUID(),
        listId: list.id,
        title: command.title.trim(),
        note: command.note ?? null,
        priority: command.priority,
        dueDateUtc: command.dueDateUtc ?? null,
        done: false,
        completedAtUtc: null,
      };

      items.push(item);
      list.itemIds.push(item.id);

      return { id: item.id };
    },

    async updateTodoItem(id: string, command: UpdateTodoItemCommand): Promise<void> {
      await wait();

      const item = requireItem(id);
      item.title = command.title.trim();
      item.note = command.note ?? null;
      item.priority = command.priority;
      item.dueDateUtc = command.dueDateUtc ?? null;
    },

    async deleteTodoItem(id: string): Promise<void> {
      await wait();

      const item = requireItem(id);
      const list = requireList(item.listId);

      items.splice(items.indexOf(item), 1);
      list.itemIds.splice(list.itemIds.indexOf(item.id), 1);
    },

    async completeTodoItem(id: string): Promise<void> {
      await wait();

      const item = requireItem(id);
      item.done = true;
      item.completedAtUtc = new Date().toISOString();
    },

    async reopenTodoItem(id: string): Promise<void> {
      await wait();

      const item = requireItem(id);
      item.done = false;
      item.completedAtUtc = null;
    },

    async getDashboard() {
      await wait();

      const summaries = lists.map(toSummary);

      return computeDashboardStats(summaries, clone(items));
    },
  };
}
