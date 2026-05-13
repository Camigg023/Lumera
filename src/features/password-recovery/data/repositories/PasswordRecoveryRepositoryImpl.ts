import { PasswordRecoveryRepository } from "../../domain/repositories/PasswordRecoveryRepository";
import { PasswordRecoveryDataSource } from "../datasources/PasswordRecoveryDataSource";

export class PasswordRecoveryRepositoryImpl implements PasswordRecoveryRepository {
  private readonly dataSource = new PasswordRecoveryDataSource();

  async sendPasswordResetEmail(email: string): Promise<void> {
    return this.dataSource.sendPasswordResetEmail(email);
  }
}