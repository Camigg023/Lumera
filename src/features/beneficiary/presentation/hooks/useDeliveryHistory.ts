import { useMemo, useState, useEffect, useCallback } from 'react';
import { HelpRequestDataSource } from '../../data/datasources/HelpRequestDataSource';
import { HelpRequestRepositoryImpl } from '../../data/repositories/HelpRequestRepositoryImpl';
import { ListHelpRequestsByBeneficiary } from '../../domain/usecases/ListHelpRequestsByBeneficiary';
import { GetHelpRequest } from '../../domain/usecases/GetHelpRequest';
import { HelpRequest } from '../../domain/entities/HelpRequest';

/**
 * Hook personalizado para acceder al historial de entregas recibidas.
 * Filtra automáticamente solo las solicitudes con estado 'entregada'.
 *
 * @param beneficiaryId - ID del beneficiario autenticado
 */
export function useDeliveryHistory(beneficiaryId: string) {
  const [deliveries, setDeliveries] = useState<HelpRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar casos de uso con memoización
  const useCases = useMemo(() => {
    const ds = new HelpRequestDataSource();
    const repo = new HelpRequestRepositoryImpl(ds);
    return {
      listRequests: new ListHelpRequestsByBeneficiary(repo),
      getRequest: new GetHelpRequest(repo),
    };
  }, []);

  /**
   * Carga todas las solicitudes del beneficiario y filtra solo las entregadas.
   */
  const loadDeliveries = useCallback(async () => {
    if (!beneficiaryId) return;
    setIsLoading(true);
    setError(null);
    try {
      const all = await useCases.listRequests.execute(beneficiaryId);
      const completed = all.filter((r) => r.status === 'entregada');
      setDeliveries(completed);
    } catch (e: any) {
      setError(e?.message ?? 'Error al cargar el historial de entregas.');
    } finally {
      setIsLoading(false);
    }
  }, [beneficiaryId, useCases.listRequests]);

  // Cargar al montar
  useEffect(() => {
    loadDeliveries();
  }, [loadDeliveries]);

  /**
   * Obtiene el detalle completo de una entrega específica.
   * @param deliveryId - ID de la entrega
   */
  const getDeliveryDetail = useCallback(
    async (deliveryId: string): Promise<HelpRequest> => {
      return useCases.getRequest.execute(deliveryId);
    },
    [useCases.getRequest]
  );

  /**
   * Total acumulado de kg recibidos.
   */
  const totalKgReceived = useMemo(() => {
    return deliveries.reduce((sum, d) => sum + (d.totalKg || 0), 0);
  }, [deliveries]);

  return {
    deliveries,
    isLoading,
    error,
    totalKgReceived,
    getDeliveryDetail,
    reloadDeliveries: loadDeliveries,
  };
}
