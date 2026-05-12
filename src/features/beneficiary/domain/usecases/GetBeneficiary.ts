import { BeneficiaryRepository } from '../repositories/BeneficiaryRepository';
import { Beneficiary } from '../entities/Beneficiary';

/**
 * Caso de uso: Obtener el perfil de un beneficiario por su userId.
 * Orquesta la llamada al repositorio y maneja la lógica de negocio asociada.
 */
export class GetBeneficiary {
  constructor(private repository: BeneficiaryRepository) {}

  /**
   * Ejecuta la obtención del perfil de beneficiario.
   * @param userId - ID del usuario propietario
   * @returns Promise con el beneficiario
   * @throws Error si el userId es inválido o el beneficiario no existe
   */
  async execute(userId: string): Promise<Beneficiary> {
    if (!userId || userId.trim() === '') {
      throw new Error('El ID de usuario es requerido para obtener el perfil.');
    }
    return this.repository.getBeneficiary(userId);
  }
}
