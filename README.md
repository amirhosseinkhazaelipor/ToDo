# TodoApp — پروژه Todo با Clean Architecture + CQRS (بک‌اند .NET + رابط کاربری React)

یک اپلیکیشن کامل مدیریت کارها: **REST API با .NET 10** (Clean Architecture، CQRS با MediatR، DDD، SQL Server، JWT Auth) و **UI فارسی/RTL با React 19 + TypeScript** (پوشه `frontend/`).

## اجرا (بک‌اند)

```bash
dotnet restore
dotnet ef database update --project src/TodoApp.Infrastructure --startup-project src/TodoApp.Api
dotnet run --project src/TodoApp.Api
```

- Swagger UI: `http://localhost:5199/swagger`
- دیتابیس **SQL Server** است (دیتابیس `TodoAppDb` با Windows Authentication ساخته می‌شود) و در زمان Startup به‌صورت خودکار Migration اعمال می‌شود.
- تست‌های واحد Persistence روی **SQLite درون‌حافظه‌ای** اجرا می‌شوند: سریع، ایزوله و مستقل از موتور دیتابیس production.
- برای تغییر Provider فقط پکیج و `UseSqlServer` را در `DependencyInjection` لایه‌ی Infrastructure عوض کنید و Migrationها را دوباره بسازید — هیچ لایه‌ی دیگری تغییری نمی‌کند.

## اجرا (فرانت‌اند)

```bash
cd frontend
pnpm install
pnpm dev   # http://localhost:5173 — به بک‌اند واقعی وصل است (VITE_API_MODE=real در .env)
```

جزئیات کامل UI در `frontend/README.md`.

## اجرای تست‌ها

```bash
dotnet test
```

## ساختار لایه‌ها و جهت وابستگی‌ها

```
TodoApp.Api  ──►  TodoApp.Application  ◄──  TodoApp.Infrastructure
 (Presentation)          │  ▲                      │
                         │  └──────────────────────┘
                         ▼
                  TodoApp.Domain
```

| پروژه | مسئولیت |
|---|---|
| `TodoApp.Domain` | موجودیت‌ها، Aggregate Root، Value Object، Domain Event، قواعد کسب‌وکار (Invariant). هیچ وابستگی‌ای به لایه‌های دیگر ندارد (فقط پکیج بدون‌وابستگی `MediatR.Contracts`). |
| `TodoApp.Application` | Use Caseها با CQRS (Command/Query + Handler)، Validatorها، Pipeline Behaviorها، Specification، DTO، رابط Repository/UnitOfWork و سرویس‌های abstraction. |
| `TodoApp.Infrastructure` | پیاده‌سازی: EF Core + SQLite، Repository، Interceptor (Audit و Dispatch رویدادها)، Transaction Behavior، سرویس زمان و ایمیل. |
| `TodoApp.Api` | کنترلرهای نازک، مپینگ خطا به ProblemDetails، Swagger، تنظیم DI ریشه. |
| `TodoApp.UnitTests` | تست واحد دامنه، هندلرها (با NSubstitute)، Validatorها، Specification و تست‌های Persistence با SQLite درون‌حافظه‌ای. |

## نگاشت اصول معماری به کد

| اصل / الگو | مکان پیاده‌سازی |
|---|---|
| Clean Architecture / Separation of Concerns | ۴ لایه با وابستگی رو به داخل؛ Domain هیچ وابستگی‌ای ندارد |
| CQRS | تفکیک `ICommand`/`IQuery` در `Application/Common/Abstractions` + پوشه‌بندی Commands/Queries |
| Mediator (MediatR) | همه‌ی Use Caseها؛ کنترلرها فقط `ISender` را تزریق می‌کنند |
| SOLID (DIP) | رابط‌ها در Application، پیاده‌سازی در Infrastructure (`IUnitOfWork`, `ITodoListRepository`, `IDateTime`, `IEmailSender`) |
| Repository Pattern | `TodoListRepository`, `TodoItemRepository` + Repository جنریک‌پسند مبتنی بر Specification |
| Unit of Work | `IUnitOfWork` که توسط `ApplicationDbContext` پیاده‌سازی می‌شود |
| DDD (Aggregate Root) | `TodoList` مالک `TodoItem` است؛ ساخت/حذف آیتم فقط با متد `AddItem`/`RemoveItem` ریشه‌ی Aggregate |
| Domain Events (Observer) | `TodoItemCreatedEvent`, `TodoItemCompletedEvent` → انتشار خودکار بعد از Save توسط `DispatchDomainEventsInterceptor` → `TodoItemCompletedEventHandler` (ارسال اعلان) |
| Value Object | `Colour` با اعتبارسنجی + برابری ساختاری |
| Decorator / Pipeline Behaviors | `ValidationBehavior`, `LoggingBehavior`, `PerformanceBehavior`, `TransactionBehavior` |
| Specification Pattern (Composite) | `OverdueTodoItemSpecification`, `TodoItemByListSpecification`, ... + ترکیب `And`/`Or` به‌صورت کاملاً ترجمه‌پذیر به SQL |
| Validation | FluentValidation برای هر Request + خروجی 400 با دیکشنری `errors` |
| DTO Principle | DTO جدا از Entity؛ Request جدا از Command (id از route می‌آید) |
| API Design | REST، kebab-case، `CreatedAtAction` با 201، 204، ProblemDetails (RFC 7807)، `traceId`، JSON Enum به‌صورت رشته |
| Async Programming | تمام مسیر دیتا با `async/await` + `CancellationToken` سراسری |
| Database Principles | Migration برای SQL Server، Index روی ستون‌های پرکاربرد (ListId، DueDateUtc، ترکیبی)، FK با Cascade Delete، محدودیت طول داده، تست Persistence روی SQLite درون‌حافظه‌ای |
| Strategy (زمان) | `IDateTime` تزریق‌شده به‌جای `DateTime.UtcNow` مستقیم → تست‌پذیری قطعی |
| Audit (Cross-cutting) | `AuditableEntityInterceptor` ستون‌های `CreatedAtUtc`/`LastModifiedAtUtc` را خودکار پر می‌کند |

## Endpointها

### Auth — `/api/auth` (بدون نیاز به توکن)
| متد | مسیر | توضیح |
|---|---|---|
| POST | `/register` | ثبت‌نام → 200 + `{ user, token }` |
| POST | `/login` | ورود → 200 + `{ user, token }` |

سایر endpointها با `[Authorize]` محافظت شده‌اند: هدر `Authorization: Bearer <token>` الزامی است.

### Todo Lists — `/api/todo-lists`
| متد | مسیر | توضیح |
|---|---|---|
| GET | `/?pageNumber=1&pageSize=20` | لیست صفحه‌بندی‌شده |
| GET | `/{id}` | جزئیات لیست به‌همراه آیتم‌ها |
| POST | `/` | ایجاد لیست → 201 + id |
| PUT | `/{id}` | تغییر عنوان/رنگ → 204 |
| DELETE | `/{id}` | حذف لیست و آیتم‌ها (Cascade) → 204 |

### Todo Items — `/api/todo-items`
| متد | مسیر | توضیح |
|---|---|---|
| GET | `/?listId=&done=&priority=&overdue=&search=&pageNumber=&pageSize=` | جستجو/فیلتر/صفحه‌بندی |
| GET | `/{id}` | جزئیات آیتم |
| POST | `/` | ایجاد آیتم داخل لیست → 201 |
| PUT | `/{id}` | ویرایش آیتم → 204 |
| DELETE | `/{id}` | حذف آیتم از Aggregate → 204 |
| POST | `/{id}/complete` | انجام آیتم (رویداد دامنه + اعلان) → 204 |
| POST | `/{id}/reopen` | بازگشایی آیتم → 204 |

### نمونه‌ی درخواست

```bash
curl -X POST http://localhost:5199/api/todo-lists \
  -H "Content-Type: application/json" \
  -d '{"title":"Home","colour":"#1FA2FF"}'

curl -X POST http://localhost:5199/api/todo-items \
  -H "Content-Type: application/json" \
  -d '{"listId":"<LIST_ID>","title":"Buy milk","priority":"High","dueDateUtc":"2026-09-10T10:00:00Z"}'

curl "http://localhost:5199/api/todo-items?overdue=true&search=milk"
```

### پاسخ خطا (ProblemDetails)

```json
{
  "title": "One or more validation errors occurred.",
  "status": 400,
  "instance": "/api/todo-lists",
  "traceId": "00-d047df82...",
  "errors": { "Title": ["'Title' must not be empty."] }
}
```

- 400 → خطای اعتبارسنجی (FluentValidation) یا نقض قاعده‌ی دامنه (`DomainException`)
- 404 → `NotFoundException` هندلرها
- 500 → خطای غیرمنتظره (لاگ کامل + پیام عمومی)

## نکات

- **MediatR** روی نسخه‌ی **12.x** (آخرین نسخه‌ی Apache-2.0) پین شده است.
- جریان رفتارهای پایپ‌لاین برای Command ها:
  `Performance → Logging → Validation → Transaction → Handler`
  (خطای اعتبارسنجی هیچ‌وقت Transaction باز نمی‌کند.)
- چون کلیدها GUID سمت دامنه تولید می‌شوند، آیتم تازه‌ی Aggregate با `AddAsync` صریحاً به‌عنوان `EntityState.Added` علامت می‌خورد.
- Connection String در `src/TodoApp.Api/appsettings.json` است؛ برای احراز هویت با SQL Authentication به‌جای `Trusted_Connection=True` از `User Id=...;Password=...;TrustServerCertificate=True` استفاده کنید.
