import { BeneficiaryRepository } from '../../domain/repositories/BeneficiaryRepository';
import { Beneficiary, BeneficiaryDocument, VerificationStatus } from '../../domain/entities/Beneficiary';
import { BeneficiaryDataSource } from '../datasources/BeneficiaryDataSource';

/**
 * Implementación concreta del repositorio de beneficiarios.
 * Actúa como puente entre la capa de dominio y la fuente de datos (Firebase).
 * Puede agregar lógica de transformación o caché si es necesario.
 */
export class BeneficiaryRepositoryImpl implements BeneficiaryRepository {
  constructor(private dataSource: BeneficiaryDataSource) {}

  async getBeneficiary(userId: string): Promise<Beneficiary> {
    return this.dataSource.getBeneficiary(userId);
  }

  async createBeneficiary(data: Partial<Beneficiary>): Promise<Beneficiary> {
    return this.dataSource.createBeneficiary(data);
  }

  async updateBeneficiary(userId: string, updates: Partial<Beneficiary>): Promise<Beneficiary> {
    return this.dataSource.updateBeneficiary(userId, updates);
  }

  async verifyBeneficiary(userId: string, status: VerificationStatus, notes?: string): Promise<Beneficiary> {
    return this.dataSource.verifyBeneficiary(userId, status, notes);
  }

  async uploadDocument(userId: string, file: File, docType: string): Promise<BeneficiaryDocument> {
    return this.dataSource.uploadDocument(userId, file, docType);
  }

  async listBeneficiaries(): Promise<Beneficiary[]> {
    return this.dataSource.listBeneficiaries();
  }

  async getBeneficiariesByStatus(status: VerificationStatus): Promise<Beneficiary[]> {
    return this.dataSource.getBeneficiariesByStatus(status);
  }
}
