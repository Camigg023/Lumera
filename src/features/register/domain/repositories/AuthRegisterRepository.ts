export interface AuthRegisterRepository {
  signUpWithEmailPassword(
    email: string,
    password: string,
    role: string,
    name: string
  ): Promise<void>;
}
