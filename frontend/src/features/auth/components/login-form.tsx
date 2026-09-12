import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { Loader2, LogIn } from "lucide-react";
import { z } from "zod";

import { InlineError } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/features/auth/hooks/use-auth-mutations";
import {
  emailField,
  passwordField,
} from "@/features/auth/validation";
import { getErrorMessage } from "@/utils/errors";

const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onRegisterLink?: React.ReactNode;
}

export function LoginForm({ onRegisterLink }: LoginFormProps) {
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginFormValues): void => {
    login.mutate(values);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">ورود به حساب</CardTitle>
        <CardDescription>برای ادامه وارد شوید.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          aria-busy={login.isPending}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="login-email" invalid={errors.email !== undefined}>
              ایمیل
            </Label>
            <Input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              dir="ltr"
              autoComplete="email"
              invalid={errors.email !== undefined}
              {...register("email")}
            />
            <InlineError message={errors.email?.message} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="login-password" invalid={errors.password !== undefined}>
              رمز عبور
            </Label>
            <Input
              id="login-password"
              type="password"
              placeholder="••••••••"
              dir="ltr"
              autoComplete="current-password"
              invalid={errors.password !== undefined}
              {...register("password")}
            />
            <InlineError message={errors.password?.message} />
          </div>

          {login.isError && (
            <InlineError message={getErrorMessage(login.error, "ورود ناموفق بود.")} />
          )}

          <Button type="submit" disabled={login.isPending} className="mt-1 w-full">
            {login.isPending ? (
              <Loader2 aria-hidden="true" className="animate-spin" />
            ) : (
              <LogIn aria-hidden="true" />
            )}
            ورود
          </Button>

          {onRegisterLink ?? (
            <p className="text-center text-sm text-muted-foreground">
              حساب ندارید؟{" "}
              <Link to="/register" className="font-medium text-primary hover:underline">
                ثبت‌نام کنید
              </Link>
            </p>
          )}
        </form>

        {import.meta.env.VITE_API_MODE !== "real" && (
          <div className="mt-4 rounded-lg bg-muted p-3 text-center text-xs text-muted-foreground">
            حساب آزمایشی — ایمیل: <span dir="ltr">demo@todo.ir</span> | رمز:{" "}
            <span dir="ltr">12345678</span>
          </div>
        )}
        {import.meta.env.VITE_API_MODE === "real" && (
          <div className="mt-4 rounded-lg bg-muted p-3 text-center text-xs text-muted-foreground">
            حسابی ندارید؟ از دکمه «ثبت‌نام کنید» یک حساب واقعی بسازید.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
