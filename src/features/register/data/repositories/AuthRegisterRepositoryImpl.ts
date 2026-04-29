import { AuthRegisterDataSource } from '../datasources/AuthRegisterDataSource';
import { AuthRegisterRepository } from '../../domain/repositories/AuthRegisterRepository';
import { RegisterData } from '../../domain/entities/RegisterData';

export class AuthRegisterRepositoryImpl implements AuthRegisterRepository {
  constructor(private dataSource: AuthRegisterDataSource) {}

  async signUpWithEmailPassword(data: RegisterData): Promise<void> {
    return this.dataSource.signUpWithEmailPassword(data);
  }
}
