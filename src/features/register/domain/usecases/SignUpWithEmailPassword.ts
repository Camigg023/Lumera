import { AuthRegisterRepository } from '../repositories/AuthRegisterRepository';

export class SignUpWithEmailPassword {
  constructor(private repository: AuthRegisterRepository) {}

  async execute(
    email: string,
    password: string,
    role: string,
    name: string
  ): Promise<void> {
    if (!email || !password || !name) {
      throw new Error("Missing fields");
    }
    return this.repository.signUpWithEmailPassword(email, password, role, name);
  }
}
