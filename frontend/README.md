# TodoApp UI — رابط کاربری تودو

رابط کاربری **فارسی و RTL** برای بک‌اند .NET، ساخته‌شده با استک زیر:

| بخش | تکنولوژی |
|---|---|
| Build | Vite 6 |
| فریم‌ورک | React 19 + TypeScript (strict، بدون `any`) |
| پکیج‌منیجر | pnpm |
| استایل | Tailwind CSS v4 (پراپرتی‌های منطقی `ms-/me-/ps-/pe-` برای RTL) |
| کامپوننت پایه | shadcn/ui (نوشته‌شده در `src/components/ui` با CVA + Radix) |
| State سرور | TanStack Query v5 |
| State کلاینت | Zustand (persist برای تم و سشن) |
| فرم | React Hook Form + Zod (پیام‌های خطای فارسی) |
| مسیریابی | React Router v7 (`createBrowserRouter`) |
| فونت | Vazirmatn Variable (باندل محلی) |

## اجرا

```bash
cd frontend
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # type-check + build تولیدی
pnpm preview    # پیش‌نمایش نسخه build شده
```

**حساب آزمایشی (فقط حالت mock):** `demo@todo.ir` / `12345678` — در حالت real از صفحه ثبت‌نام استفاده کنید.

## اتصال به بک‌اند واقعی (.NET) — حالت پیش‌فرض

پروژه با فایل `.env` روی **حالت real** تنظیم شده و مستقیماً به `TodoApp.Api` وصل است:

```
VITE_API_MODE=real
VITE_API_BASE_URL=http://localhost:5199/api
```

1. بک‌اند را اجرا کنید: `dotnet run --project src/TodoApp.Api` (پورت 5199)
2. فرانت را اجرا کنید: `pnpm dev` (پورت 5173 — CORS روی بک‌اند برای همین پورت باز است)
3. از صفحه ثبت‌نام یک حساب واقعی بسازید؛ کاربر در جدول `Users` دیتابیس ذخیره می‌شود.

**احراز هویت واقعی (JWT):** بک‌اند endpointهای `POST /api/auth/register` و `POST /api/auth/login` را دارد (PBKDF2 برای هش رمز + توکن JWT). axios interceptor توکن را به همه درخواست‌ها اضافه می‌کند و پاسخ 401 کاربر را به صفحه ورود برمی‌گرداند. کنترلرهای todo-lists و todo-items با `[Authorize]` محافظت شده‌اند.

**حالت Mock:** اگر `.env` را حذف یا `VITE_API_MODE=mock` کنید، همان UI با داده‌ی جعلی درون‌حافظه‌ای و تاخیر مصنوعی اجرا می‌شود (حساب آزمایشی `demo@todo.ir` / `12345678`).

## ساختار

```
src/
├── components/
│   ├── ui/            ← shadcn-style: button, input, dialog, dropdown, ...
│   ├── common/        ← صفحات حالت (Loading/Error/Empty)، Pagination، ConfirmDialog، ...
│   └── layout/        ← AppLayout، Sidebar، Header، Footer
├── features/
│   ├── auth/          ← api/ (contract+mock+http)، hooks/، components/ (فرم‌ها)
│   └── todos/         ← api/، hooks/ (useQuery/useMutation)، components/ (کارت کار، دیالوگ‌ها، نمودارها)
├── pages/             ← DashboardPage، ListsPage، TasksPage، LoginPage، RegisterPage، NotFoundPage
├── stores/            ← Zustand: auth، theme، ui (drawer)، task-filters
├── lib/               ← api.ts (factory)، http.ts (axios+interceptor)، query-client.ts
├── types/             ← تایپ‌های DTO هم‌تراز با بک‌اند
├── hooks/             ← useDebouncedValue، useTheme، useDocumentTitle
└── utils/             ← cn، date (Intl فارسی)، priority، errors
```

## صفحات

1. **ورود / ثبت‌نام** — اعتبارسنجی کامل با Zod، گارد مسیر (RequireAuth/GuestOnly)
2. **داشبورد** — ۴ کارت آمار، نمودار دونات نرخ تکمیل (SVG)، نمودار میله‌ای پیشرفت هر لیست، کارهای پیش‌رو
3. **لیست‌ها** — CRUD کامل با دیالوگ فرم (رنگ از پالت + color picker) و حذف با تایید
4. **کارها** — جدول/کارت با جستجوی debounced، فیلتر وضعیت/اهمیت/لیست، صفحه‌بندی، تکمیل/بازگشایی/ویرایش/حذف

## UI/UX

- کاملاً Responsive (mobile-first: دراور موبایل + کارت به‌جای جدول)
- Dark/Light/System theme با تشخیص خودکار سیستم
- دسترسی‌پذیری: aria-labelها، focus ring، نقش‌های معنایی، progressbar/progressbar مقدارها
- Loading/Error/Empty state برای همه بخش‌های داده‌محور
- اعلان‌های موفقیت/خطا با sonner
