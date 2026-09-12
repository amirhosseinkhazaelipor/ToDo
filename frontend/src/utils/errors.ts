import axios from "axios";

interface ProblemDetailsLike {
  detail?: string;
  title?: string;
  errors?: Record<string, string[]>;
}

/**
 * Extracts the most user-friendly message from a thrown value: the backend
 * ProblemDetails `detail`/`errors` when present, otherwise the Error message.
 * No `any` — the axios payload is read through a narrow structural type.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ProblemDetailsLike | undefined;

    if (data?.detail !== undefined && data.detail !== "") {
      return data.detail;
    }

    const firstFieldError =
      data?.errors !== undefined
        ? Object.values(data.errors).flat().find((message) => message !== "")
        : undefined;

    if (firstFieldError !== undefined) {
      return firstFieldError;
    }

    if (data?.title !== undefined && data.title !== fallback) {
      return data.title;
    }

    if (error.message !== "") {
      return error.message;
    }
  }

  if (error instanceof Error && error.message !== "") {
    return error.message;
  }

  return fallback;
}
