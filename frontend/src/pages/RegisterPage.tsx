import { GuestOnly } from "@/components/common/route-guards";
import { BrandMark } from "@/components/layout/Sidebar";
import { RegisterForm } from "@/features/auth/components/register-form";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function RegisterPage() {
  useDocumentTitle("ثبت‌نام");

  return (
    <GuestOnly>
      <main className="flex min-h-dvh flex-col items-center justify-center gap-6 p-4">
        <BrandMark />
        <RegisterForm />
      </main>
    </GuestOnly>
  );
}
