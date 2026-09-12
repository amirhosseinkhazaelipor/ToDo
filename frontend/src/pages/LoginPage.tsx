import { GuestOnly } from "@/components/common/route-guards";
import { BrandMark } from "@/components/layout/Sidebar";
import { LoginForm } from "@/features/auth/components/login-form";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function LoginPage() {
  useDocumentTitle("ورود");

  return (
    <GuestOnly>
      <main className="flex min-h-dvh flex-col items-center justify-center gap-6 p-4">
        <BrandMark />
        <LoginForm />
      </main>
    </GuestOnly>
  );
}
