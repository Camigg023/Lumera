import { useMemo, useState, useEffect, useCallback } from 'react';
import { HelpRequestDataSource } from '../../data/datasources/HelpRequestDataSource';
import { HelpRequestRepositoryImpl } from '../../data/repositories/HelpRequestRepositoryImpl';
import { CreateHelpRequest } from '../../domain/usecases/CreateHelpRequest';
import { GetHelpRequest } from '../../domain/usecases/GetHelpRequest';
import { ListHelpRequestsByBeneficiary } from '../../domain/usecases/ListHelpRequestsByBeneficiary';
import { CancelHelpRequest } from '../../domain/usecases/CancelHelpRequest';
import { HelpRequest } from '../../domain/entities/HelpRequest';
import { BeneficiaryType } from '../../domain/entities/Beneficiary';
import { KG_LIMITS_BY_TYPE } from '../../domain/entities/HelpRequest';

/**
 * Datos necesarios para crear una solicitud de ayuda.
 */
export interface CreateHelpRequestInput {
  beneficiaryId: string;
  beneficiaryName: string;
  beneficiaryType: BeneficiaryType;
  items: Array<{ category: string; quantity: number }>;
  urgency: string;
  justification: string;
}

/**
 * Hook personalizado para gestionar solicitudes de ayuda.
 * Encapsula la inyección de dependencias, la carga de datos y las operaciones CRUD.
 *
 * @param beneficiaryId - ID del beneficiario autenticado (userId)
 */
export const useHelpRequest = (beneficiaryId: string) => {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar casos de uso con memoización
  const useCases = useMemo(() => {
    const ds = new HelpRequestDataSource();
    const repo = new HelpRequestRepositoryImpl(ds);
    return {
      createRequest: new CreateHelpRequest(repo),
      getRequest: new GetHelpRequest(repo),
      listRequests: new ListHelpRequestsByBeneficiary(repo),
      cancelRequest: new CancelHelpRequest(repo),
    };
  }, []);

  /**
   * Carga todas las solicitudes del beneficiario desde Firestore.
   */
  const loadRequests = useCallback(async () => {
    if (!beneficiaryId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await useCases.listRequests.execute(beneficiaryId);
      setRequests(data);
    } catch (e: any) {
      setError(e?.message ?? 'Error al cargar las solicitudes.');
    } finally {
      setIsLoading(false);
    }
  }, [beneficiaryId, useCases.listRequests]);

  // Cargar solicitudes al montar el hook
  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  /**
   * Crea una nueva solicitud de ayuda con todas las validaciones.
   *
   * @param input - Datos de la solicitud
   * @returns Promise con la solicitud creada
   * @throws Error si no pasa las validaciones de negocio (límite semanal, kg, etc.)
   */
  const create = async (input: CreateHelpRequestInput): Promise<HelpRequest> => {
    setIsLoading(true);
    setError(null);
    try {
      const created = await useCases.createRequest.execute({
        beneficiaryId: input.beneficiaryId,
        beneficiaryName: input.beneficiaryName,
        beneficiaryType: input.beneficiaryType,
        items: input.items.map((item) => ({
          category: item.category as any,
          quantity: item.quantity,
          unit: 'kg' as const,
        })),
        urgency: input.urgency as any,
        justification: input.justification,
      });
      // Recargar lista completa
      await loadRequests();
      return created;
    } catch (e: any) {
      const msg = e?.message ?? 'Error al crear la solicitud.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cancela una solicitud activa.
   * @param requestId - ID de la solicitud a cancelar
   */
  const cancel = async (requestId: string): Promise<void> => {
    setError(null);
    try {
      await useCases.cancelRequest.execute(requestId);
      await loadRequests();
    } catch (e: any) {
      const msg = e?.message ?? 'Error al cancelar la solicitud.';
      setError(msg);
      throw new Error(msg);
    }
  };

  /**
   * Obtiene las solicitudes activas actualmente.
   */
  const activeStatuses: string[] = ['enviada', 'en_revision', 'aprobada', 'en_preparacion', 'en_transito'];
  const activeRequests = useMemo(() => {
    return requests.filter((r) => activeStatuses.includes(r.status));
  }, [requests]);

  /**
   * Calcula el límite de kg máximo para un tipo de organización.
   */
  const getKgLimit = useCallback((type: BeneficiaryType): number => {
    return KG_LIMITS_BY_TYPE[type] || 300;
  }, []);

  /**
   * Verifica si el beneficiario puede crear una nueva solicitud esta semana.
   */
  const canCreateThisWeek = useMemo(() => {
    return activeRequests.length === 0;
  }, [activeRequests]);

  return {
    requests,
    activeRequests,
    isLoading,
    error,
    canCreateThisWeek,
    getKgLimit,
    create,
    cancel,
    reloadRequests: loadRequests,
  };
};
