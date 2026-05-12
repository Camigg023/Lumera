import { BeneficiaryRepository } from '../repositories/BeneficiaryRepository';
import { Beneficiary } from '../entities/Beneficiary';

/**
 * Caso de uso: Actualizar los datos de un beneficiario existente.
 * Valida que el userId esté presente antes de delegar al repositorio.
 */
export class UpdateBeneficiary {
  constructor(private repository: BeneficiaryRepository) {}

  /**
   * Ejecuta la actualización del perfil de beneficiario.
   * @param userId - ID del usuario propietario
   * @param updates - Campos a actualizar
   * @returns Promise con el beneficiario actualizado
   * @throws Error si el userId es inválido
   */
  async execute(userId: string, updates: Partial<Beneficiary>): Promise<Beneficiary> {
    if (!userId || userId.trim() === '') {
      throw new Error('El ID de usuario es requerido para actualizar.');
    }
    return this.repository.updateBeneficiary(userId, updates);
  }
}
