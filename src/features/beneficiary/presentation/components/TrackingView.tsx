import { useRequestTracking } from '../hooks/useRequestTracking';
import { RequestTimeline } from './RequestTimeline';
import { TrackingMap } from './TrackingMap';
import {
  TRACKING_STATUS_LABELS,
  TRACKING_STATUS_COLORS,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  URGENCY_LABELS,
  URGENCY_COLORS,
} from '../../domain/entities/HelpRequest';

/**
 * Props para la vista completa de seguimiento.
 */
interface TrackingViewProps {
  /** ID de la solicitud a seguir */
  requestId: string;
  /** Función para volver atrás */
  onBack?: () => void;
}

/**
 * Vista completa de seguimiento de una solicitud en tiempo real.
 * Combina el timeline, el mapa de entrega, los detalles de la solicitud
 * y el estado actual con notificaciones automáticas.
 */
export function TrackingView({ requestId, onBack }: TrackingViewProps) {
  const { request, isLoading, error, trackingProgress } = useRequestTracking(requestId);

  // ─── LOADING ───
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Cargando seguimiento...</p>
      </div>
    );
  }

  // ─── ERROR ───
  if (error || !request) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center animate-fade-in">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Solicitud no encontrada</h2>
        <p className="text-gray-500 mb-6">{error || 'No se pudo cargar la información de la solicitud.'}</p>
        {onBack && (
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors cursor-pointer"
          >
            Volver
          </button>
        )}
      </div>
    );
  }

  const urgencyColors = URGENCY_COLORS[request.urgency];
  const statusColors = TRACKING_STATUS_COLORS[request.status];
  const isDelivered = request.status === 'entregada';
  const isCancelled = request.status === 'cancelada';
  const isInTransit = request.status === 'en_transito';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* ─── ENCABEZADO ─── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Volver"
            >
              <span className="text-lg">←</span>
            </button>
          )}
          <div>
            <h2 className="text-xl font-bold text-gray-900">Seguimiento de solicitud</h2>
            <p className="text-sm text-gray-500">
              #{request.id.slice(-6).toUpperCase()} · {request.beneficiaryName}
            </p>
          </div>
        </div>

        {/* Badge de estado actual */}
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusColors.bg} ${statusColors.text} border ${statusColors.border}`}
        >
          <span className={`w-2 h-2 rounded-full ${statusColors.dot}`} />
          {TRACKING_STATUS_LABELS[request.status]}
        </span>
      </div>

      {/* ─── MENSAJES DE ESTADO ─── */}
      {isDelivered && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-800 flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <strong>¡Entrega completada!</strong>
            <p className="text-emerald-600">Los alimentos han sido entregados a su organización.</p>
          </div>
        </div>
      )}
      {isCancelled && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800 flex items-center gap-3">
          <span className="text-2xl">❌</span>
          <div>
            <strong>Solicitud cancelada</strong>
            <p className="text-red-600">Esta solicitud fue cancelada y no será procesada.</p>
          </div>
        </div>
      )}

      {/* ─── GRID PRINCIPAL: TIMELINE + MAPA ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Timeline (ocupa 3 columnas en lg) */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">📋</span>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Progreso de la solicitud
            </h3>
            {!isCancelled && (
              <span className="text-xs text-gray-400 ml-auto">
                {trackingProgress()}% completado
              </span>
            )}
          </div>
          <RequestTimeline
            currentStatus={request.status}
            statusHistory={request.statusHistory}
          />
        </div>

        {/* Panel lateral (ocupa 2 columnas en lg) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Mapa (solo si está en tránsito o entregada con ubicación) */}
          {(isInTransit || (isDelivered && request.deliveryLocation)) && request.deliveryLocation ? (
            <TrackingMap
              location={request.deliveryLocation}
              beneficiaryName={request.beneficiaryName}
              deliveryAddress={request.deliveryAddress}
              etaMinutes={request.etaMinutes}
            />
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
              <div className="text-3xl mb-2">
                {isDelivered ? '✅' : '📦'}
              </div>
              <p className="text-sm text-gray-600 font-medium">
                {isDelivered
                  ? 'Entrega completada'
                  : 'La entrega aún no está en tránsito'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {isDelivered
                  ? 'Los alimentos ya fueron recibidos.'
                  : 'El mapa estará disponible cuando la entrega esté en camino.'}
              </p>
            </div>
          )}

          {/* Información del donador */}
          {request.donorName && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                🤝 Donador asignado
              </h4>
              <p className="text-sm font-medium text-gray-900">{request.donorName}</p>
              {request.donorId && (
                <p className="text-xs text-gray-400">ID: #{request.donorId.slice(-6).toUpperCase()}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── DETALLES DE LA SOLICITUD ─── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
          📦 Detalles de la solicitud
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Productos */}
          <div>
            <p className="text-xs text-gray-500 font-medium mb-2">Productos solicitados:</p>
            <div className="space-y-1.5">
              {request.items.map((item) => (
                <div key={item.category} className="flex items-center gap-2 text-sm">
                  <span>{CATEGORY_ICONS[item.category]}</span>
                  <span className="text-gray-700">{CATEGORY_LABELS[item.category]}</span>
                  <span className="text-gray-900 font-semibold ml-auto">
                    {item.quantity} {item.unit}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between text-sm font-semibold text-gray-900">
              <span>Total</span>
              <span>{request.totalKg} kg</span>
            </div>
          </div>

          {/* Metadatos */}
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Urgencia</p>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium mt-0.5 ${urgencyColors.bg} ${urgencyColors.text}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${urgencyColors.dot}`} />
                {URGENCY_LABELS[request.urgency]}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Justificación</p>
              <p className="text-sm text-gray-700 mt-0.5">{request.justification}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Creada</p>
              <p className="text-sm text-gray-700 mt-0.5">
                {new Date(request.createdAt).toLocaleDateString('es-CO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── PRIORIDAD (si tiene score) ─── */}
      {request.priorityScore && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            ⚡ Prioridad
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-orange-50 border-2 border-orange-300 flex items-center justify-center">
              <span className="text-xl font-bold text-orange-600">{request.priorityScore.total}</span>
            </div>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { label: 'Sin ayuda', value: request.priorityScore.breakdown.timeSinceLastHelp, max: 25 },
                { label: 'Personas', value: request.priorityScore.breakdown.peopleServed, max: 20 },
                { label: 'Urgencia', value: request.priorityScore.breakdown.urgency, max: 25 },
                { label: 'Distancia', value: request.priorityScore.breakdown.distanceToCenter, max: 15 },
                { label: 'Historial', value: request.priorityScore.breakdown.complianceHistory, max: 15 },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-sm font-bold text-gray-900">{item.value}</div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1 overflow-hidden">
                    <div
                      className="h-full bg-orange-400 rounded-full"
                      style={{ width: `${(item.value / item.max) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
