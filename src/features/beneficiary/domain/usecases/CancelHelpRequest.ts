import { HelpRequestRepository } from '../repositories/HelpRequestRepository';
import { HelpRequest } from '../entities/HelpRequest';

/**
 * Caso de uso: Cancelar una solicitud de ayuda activa.
 * Solo se pueden cancelar solicitudes en estado 'activa'.
 */
export class CancelHelpRequest {
  constructor(private repository: HelpRequestRepository) {}

  /**
   * Ejecuta la cancelación de una solicitud.
   * @param requestId - ID de la solicitud a cancelar
   * @returns Promise con la solicitud actualizada
   * @throws Error si la solicitud no está activa
   */
  async execute(requestId: string): Promise<HelpRequest> {
    if (!requestId || requestId.trim() === '') {
      throw new Error('El ID de la solicitud es requerido.');
    }

    const request = await this.repository.getRequest(requestId);

    if (request.status !== 'enviada' && request.status !== 'en_revision') {
      throw new Error(`No se puede cancelar una solicitud en estado "${request.status}". Solo se cancelan solicitudes en estado enviada o en revisión.`);
    }

    return this.repository.updateRequestStatus(requestId, 'cancelada');
  }
}
