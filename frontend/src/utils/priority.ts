import type { PriorityLevel } from "@/types";

export interface PriorityStyle {
  label: string;
  className: string;
  /** ۰ تا ۳ — برای مرتب‌سازی و عرض نمودار */
  weight: number;
}

const PRIORITY_STYLES: Record<PriorityLevel, PriorityStyle> = {
  High: {
    label: "بالا",
    className: "bg-destructive/15 text-destructive",
    weight: 3,
  },
  Medium: {
    label: "متوسط",
    className: "bg-warning/20 text-warning-foreground",
    weight: 2,
  },
  Low: {
    label: "کم",
    className: "bg-primary/10 text-primary",
    weight: 1,
  },
  None: {
    label: "بدون",
    className: "bg-muted text-muted-foreground",
    weight: 0,
  },
};

export function getPriorityStyle(priority: PriorityLevel): PriorityStyle {
  return PRIORITY_STYLES[priority];
}

export const PRIORITY_ORDER: readonly PriorityLevel[] = [
  "None",
  "Low",
  "Medium",
  "High",
];

/** لیست رنگ‌های پیشنهادی برای لیست‌ها — همه با فرمت #RRGGBB که بک‌اند قبول می‌کند */
export const LIST_COLOUR_PALETTE: readonly string[] = [
  "#4F46E5",
  "#0EA5E9",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
];
