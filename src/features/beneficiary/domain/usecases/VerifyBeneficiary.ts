import { BeneficiaryRepository } from '../repositories/BeneficiaryRepository';
import { Beneficiary, VerificationStatus } from '../entities/Beneficiary';

/**
 * Caso de uso: Cambiar el estado de verificación documental de un beneficiario.
 * Usado por administradores para aprobar o rechazar la documentación.
 */
export class VerifyBeneficiary {
  constructor(private repository: BeneficiaryRepository) {}

  /**
   * Ejecuta la verificación del beneficiario.
   * @param userId - ID del usuario a verificar/rechazar
   * @param status - Estado a asignar ('verified' | 'rejected')
   * @param notes - Notas opcionales (ej: motivo de rechazo)
   * @returns Promise con el beneficiario actualizado
   * @throws Error si el userId o status son inválidos
   */
  async execute(userId: string, status: VerificationStatus, notes?: string): Promise<Beneficiary> {
    if (!userId || userId.trim() === '') {
      throw new Error('El ID de usuario es requerido.');
    }
    if (status !== 'verified' && status !== 'rejected') {
      throw new Error('El estado debe ser "verified" o "rejected".');
    }
    if (status === 'rejected' && (!notes || notes.trim() === '')) {
      throw new Error('Debe proporcionar un motivo cuando rechaza la verificación.');
    }
    return this.repository.verifyBeneficiary(userId, status, notes);
  }
}
