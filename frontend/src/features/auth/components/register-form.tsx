import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { Loader2, UserPlus } from "lucide-react";
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
import { useRegister } from "@/features/auth/hooks/use-auth-mutations";
import {
  emailField,
  passwordField,
} from "@/features/auth/validation";
import { getErrorMessage } from "@/utils/errors";

const registerSchema = z
  .object({
    name: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد."),
    email: emailField,
    password: passwordField,
    confirmPassword: z.string().min(1, "تکرار رمز عبور الزامی است."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "رمز عبور و تکرار آن یکسان نیستند.",
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const registerUser = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = (values: RegisterFormValues): void => {
    registerUser.mutate({
      name: values.name,
      email: values.email,
      password: values.password,
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">ساخت حساب جدید</CardTitle>
        <CardDescription>در چند ثانیه عضو شوید.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          aria-busy={registerUser.isPending}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="register-name" invalid={errors.name !== undefined}>
              نام و نام خانوادگی
            </Label>
            <Input
              id="register-name"
              placeholder="مثلاً سارا محمدی"
              autoComplete="name"
              invalid={errors.name !== undefined}
              {...register("name")}
            />
            <InlineError message={errors.name?.message} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="register-email" invalid={errors.email !== undefined}>
              ایمیل
            </Label>
            <Input
              id="register-email"
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
            <Label htmlFor="register-password" invalid={errors.password !== undefined}>
              رمز عبور
            </Label>
            <Input
              id="register-password"
              type="password"
              dir="ltr"
              autoComplete="new-password"
              invalid={errors.password !== undefined}
              {...register("password")}
            />
            <InlineError message={errors.password?.message} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="register-confirm-password"
              invalid={errors.confirmPassword !== undefined}
            >
              تکرار رمز عبور
            </Label>
            <Input
              id="register-confirm-password"
              type="password"
              dir="ltr"
              autoComplete="new-password"
              invalid={errors.confirmPassword !== undefined}
              {...register("confirmPassword")}
            />
            <InlineError message={errors.confirmPassword?.message} />
          </div>

          {registerUser.isError && (
            <InlineError
              message={getErrorMessage(registerUser.error, "ثبت‌نام ناموفق بود.")}
            />
          )}

          <Button type="submit" disabled={registerUser.isPending} className="mt-1 w-full">
            {registerUser.isPending ? (
              <Loader2 aria-hidden="true" className="animate-spin" />
            ) : (
              <UserPlus aria-hidden="true" />
            )}
            ثبت‌نام
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            قبلاً ثبت‌نام کرده‌اید؟{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              وارد شوید
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
