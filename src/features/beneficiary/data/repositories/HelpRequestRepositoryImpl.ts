import { HelpRequestRepository } from '../../domain/repositories/HelpRequestRepository';
import { HelpRequest, RequestStatus } from '../../domain/entities/HelpRequest';
import { HelpRequestDataSource } from '../datasources/HelpRequestDataSource';

/**
 * Implementación concreta del repositorio de solicitudes de ayuda.
 * Actúa como puente entre la capa de dominio y Firebase.
 */
export class HelpRequestRepositoryImpl implements HelpRequestRepository {
  constructor(private dataSource: HelpRequestDataSource) {}

  async createRequest(data: Partial<HelpRequest>): Promise<HelpRequest> {
    return this.dataSource.createRequest(data);
  }

  async getRequest(requestId: string): Promise<HelpRequest> {
    return this.dataSource.getRequest(requestId);
  }

  async listRequestsByBeneficiary(beneficiaryId: string): Promise<HelpRequest[]> {
    return this.dataSource.listRequestsByBeneficiary(beneficiaryId);
  }

  async listActiveRequests(): Promise<HelpRequest[]> {
    return this.dataSource.listActiveRequests();
  }

  async updateRequestStatus(requestId: string, status: RequestStatus): Promise<HelpRequest> {
    return this.dataSource.updateRequestStatus(requestId, status);
  }

  async countActiveRequestsInWeek(beneficiaryId: string, weekStart: string): Promise<number> {
    return this.dataSource.countActiveRequestsInWeek(beneficiaryId, weekStart);
  }
}
