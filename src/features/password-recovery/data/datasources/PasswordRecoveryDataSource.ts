import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import app from "../../../../config/firebase";

export class PasswordRecoveryDataSource {
  private readonly auth = getAuth(app);

  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      throw new Error("Failed to send password reset email: " + (error as Error).message);
    }
  }
}