import { HelpRequestRepository } from '../repositories/HelpRequestRepository';
import { HelpRequest } from '../entities/HelpRequest';

/**
 * Caso de uso: Listar todas las solicitudes de ayuda de un beneficiario.
 */
export class ListHelpRequestsByBeneficiary {
  constructor(private repository: HelpRequestRepository) {}

  /**
   * Ejecuta la obtención del historial de solicitudes de un beneficiario.
   * @param beneficiaryId - ID del beneficiario
   * @returns Promise con arreglo de solicitudes (ordenadas por fecha descendente)
   * @throws Error si el ID es inválido
   */
  async execute(beneficiaryId: string): Promise<HelpRequest[]> {
    if (!beneficiaryId || beneficiaryId.trim() === '') {
      throw new Error('El ID del beneficiario es requerido.');
    }
    const requests = await this.repository.listRequestsByBeneficiary(beneficiaryId);
    // Ordenar por fecha descendente (más reciente primero)
    return requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}
