import { HelpRequestRepository } from '../repositories/HelpRequestRepository';
import { HelpRequest } from '../entities/HelpRequest';

/**
 * Caso de uso: Obtener una solicitud de ayuda por su ID.
 */
export class GetHelpRequest {
  constructor(private repository: HelpRequestRepository) {}

  /**
   * Ejecuta la obtención de una solicitud.
   * @param requestId - ID de la solicitud
   * @returns Promise con la solicitud
   * @throws Error si el ID es inválido
   */
  async execute(requestId: string): Promise<HelpRequest> {
    if (!requestId || requestId.trim() === '') {
      throw new Error('El ID de la solicitud es requerido.');
    }
    return this.repository.getRequest(requestId);
  }
}
