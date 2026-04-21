import { PasswordRecoveryRepository } from "../repositories/PasswordRecoveryRepository";

export class SendPasswordResetEmail {
  constructor(private readonly repository: PasswordRecoveryRepository) {}

  async execute(email: string): Promise<void> {
    if (!email || !email.trim()) {
      throw new Error("Email is required");
    }
    // Simple email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }
    return this.repository.sendPasswordResetEmail(email);
  }
}