import { HelpRequestRepository } from '../repositories/HelpRequestRepository';

/**
 * Caso de uso: Contar las solicitudes activas de un beneficiario en la semana actual.
 * Usado para validar el límite semanal antes de crear una nueva solicitud.
 */
export class CountActiveRequestsInWeek {
  constructor(private repository: HelpRequestRepository) {}

  /**
   * Ejecuta el conteo de solicitudes activas en la semana.
   * @param beneficiaryId - ID del beneficiario
   * @param weekStart - Fecha de inicio de la semana ISO-8601
   * @returns Promise con el número de solicitudes activas
   */
  async execute(beneficiaryId: string, weekStart: string): Promise<number> {
    return this.repository.countActiveRequestsInWeek(beneficiaryId, weekStart);
  }
}
