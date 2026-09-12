import type {
  AuthSession,
  LoginRequest,
  RegisterRequest,
} from "@/types/auth";

/**
 * Contract of the authentication API.
 * The mock implementation is selected by default; switching
 * `VITE_API_MODE=real` routes calls to the backend instead.
 */
export interface AuthApiClient {
  login(request: LoginRequest): Promise<AuthSession>;
  register(request: RegisterRequest): Promise<AuthSession>;
}
