import { HelpRequest } from '../../domain/entities/HelpRequest';
import { HelpRequestCard } from './HelpRequestCard';

/**
 * Props para la lista de solicitudes de ayuda.
 */
interface HelpRequestListProps {
  /** Lista completa de solicitudes */
  requests: HelpRequest[];
  /** Función para cancelar una solicitud */
  onCancelRequest?: (requestId: string) => Promise<void>;
  /** Indica si está procesando una cancelación */
  isCancelling?: boolean;
  /** Indica si está cargando */
  isLoading?: boolean;
  /** Función para ver el tracking de una solicitud */
  onViewTracking?: (requestId: string) => void;
}

/**
 * Lista de solicitudes de ayuda del beneficiario.
 * Muestra las solicitudes agrupadas: activas primero, luego historial.
 * Cada tarjeta incluye un botón "Ver seguimiento" para solicitudes activas.
 */
export function HelpRequestList({
  requests,
  onCancelRequest,
  isCancelling = false,
  isLoading = false,
  onViewTracking,
}: HelpRequestListProps) {
  // Separar solicitudes activas del historial
  const activeStatuses: string[] = ['enviada', 'en_revision', 'aprobada', 'en_preparacion', 'en_transito'];
  const activeRequests = requests.filter(
    (r) => activeStatuses.includes(r.status)
  );
  const historyRequests = requests.filter(
    (r) => r.status === 'entregada' || r.status === 'cancelada'
  );

  if (isLoading && requests.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">📭</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-1">No hay solicitudes aún</h3>
        <p className="text-sm text-gray-500">
          Cree su primera solicitud de donación para empezar a recibir alimentos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Solicitudes activas */}
      {activeRequests.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            🔵 Solicitudes activas ({activeRequests.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeRequests.map((request) => (
              <HelpRequestCard
                key={request.id}
                request={request}
                onCancel={onCancelRequest}
                isCancelling={isCancelling}
                onViewTracking={onViewTracking}
              />
            ))}
          </div>
        </div>
      )}

      {/* Historial */}
      {historyRequests.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            📜 Historial ({historyRequests.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-70">
            {historyRequests.map((request) => (
              <HelpRequestCard
                key={request.id}
                request={request}
                onViewTracking={onViewTracking}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
