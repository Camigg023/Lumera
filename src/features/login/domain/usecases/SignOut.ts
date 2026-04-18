import type { AuthRepository } from '../repositories/AuthRepository';

export class SignOut {
  constructor(private readonly repo: AuthRepository) {}

  execute(): Promise<void> {
    return this.repo.signOut();
  }
}
