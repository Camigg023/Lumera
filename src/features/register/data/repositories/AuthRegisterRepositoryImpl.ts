import { AuthRegisterDataSource } from '../datasources/AuthRegisterDataSource';
import { AuthRegisterRepository } from '../../domain/repositories/AuthRegisterRepository';

export class AuthRegisterRepositoryImpl implements AuthRegisterRepository {
  constructor(private dataSource: AuthRegisterDataSource) {}

  async signUpWithEmailPassword(
    email: string,
    password: string,
    role: string,
    name: string
  ): Promise<void> {
    return this.dataSource.signUpWithEmailPassword(email, password, role, name);
  }
}
