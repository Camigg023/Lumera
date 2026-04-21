export interface PasswordRecoveryRepository {
  sendPasswordResetEmail(email: string): Promise<void>;
}