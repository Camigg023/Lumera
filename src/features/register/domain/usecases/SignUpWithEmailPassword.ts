import { RegisterData } from '../entities/RegisterData';
import { AuthRegisterRepository } from '../repositories/AuthRegisterRepository';

export class SignUpWithEmailPassword {
  constructor(private repository: AuthRegisterRepository) {}

  async execute(data: RegisterData): Promise<void> {
    if (!data.email || !data.password || !data.name) {
      throw new Error("Missing required fields");
    }
    return this.repository.signUpWithEmailPassword(data);
  }
}
