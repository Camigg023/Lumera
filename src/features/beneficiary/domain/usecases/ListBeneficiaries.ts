import { BeneficiaryRepository } from '../repositories/BeneficiaryRepository';
import { Beneficiary } from '../entities/Beneficiary';

/**
 * Caso de uso: Listar todos los beneficiarios registrados.
 * Usado principalmente por la vista de administración.
 */
export class ListBeneficiaries {
  constructor(private repository: BeneficiaryRepository) {}

  /**
   * Ejecuta la obtención de todos los beneficiarios.
   * @returns Promise con arreglo completo de beneficiarios
   */
  async execute(): Promise<Beneficiary[]> {
    return this.repository.listBeneficiaries();
  }
}
