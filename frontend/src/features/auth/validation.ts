import { z } from "zod";

/** قواعد اعتبارسنجی مشترک فیلدهای احراز هویت (پیام‌ها فارسی) */
export const emailField = z
  .string()
  .min(1, "ایمیل الزامی است.")
  .email("فرمت ایمیل معتبر نیست.");

export const passwordField = z
  .string()
  .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد.");
