import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-6xl font-black text-primary">۴۰۴</p>
      <h1 className="text-xl font-bold">صفحه پیدا نشد</h1>
      <p className="text-sm text-muted-foreground">
        صفحه‌ای که دنبال آن هستید وجود ندارد یا جابه‌جا شده است.
      </p>
      <Link
        to="/"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        بازگشت به داشبورد
      </Link>
    </main>
  );
}
