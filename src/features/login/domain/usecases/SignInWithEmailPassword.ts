import type { AuthRepository } from '../repositories/AuthRepository';
import type { User } from '../entities/User';

export class SignInWithEmailPassword {
  constructor(private readonly repo: AuthRepository) {}

  execute(email: string, password: string): Promise<User> {
    return this.repo.signInWithEmailPassword(email, password);
  }
}
