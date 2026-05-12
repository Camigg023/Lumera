import { HelpRequest, RequestStatus } from '../entities/HelpRequest';

/**
 * Interfaz del repositorio de solicitudes de ayuda.
 * Define el contrato para acceder a datos de solicitudes desde cualquier fuente.
 */
export interface HelpRequestRepository {
  /**
   * Crea una nueva solicitud de ayuda.
   * @param data - Datos parciales de la solicitud (sin id ni timestamps)
   * @returns Promise con la solicitud creada
   */
  createRequest(data: Partial<HelpRequest>): Promise<HelpRequest>;

  /**
   * Obtiene una solicitud por su ID.
   * @param requestId - ID de la solicitud
   * @returns Promise con la solicitud encontrada
   */
  getRequest(requestId: string): Promise<HelpRequest>;

  /**
   * Lista todas las solicitudes de un beneficiario.
   * @param beneficiaryId - ID del beneficiario
   * @returns Promise con arreglo de solicitudes
   */
  listRequestsByBeneficiary(beneficiaryId: string): Promise<HelpRequest[]>;

  /**
   * Lista todas las solicitudes activas (status: 'activa' | 'en_proceso').
   * @returns Promise con arreglo de solicitudes activas
   */
  listActiveRequests(): Promise<HelpRequest[]>;

  /**
   * Actualiza el estado de una solicitud.
   * @param requestId - ID de la solicitud
   * @param status - Nuevo estado
   * @returns Promise con la solicitud actualizada
   */
  updateRequestStatus(requestId: string, status: RequestStatus): Promise<HelpRequest>;

  /**
   * Cuenta las solicitudes activas de un beneficiario en una semana específica.
   * @param beneficiaryId - ID del beneficiario
   * @param weekStart - Fecha de inicio de la semana en ISO-8601 (lunes)
   * @returns Promise con el número de solicitudes activas en esa semana
   */
  countActiveRequestsInWeek(beneficiaryId: string, weekStart: string): Promise<number>;
}
